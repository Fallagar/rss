import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import cheerio from "cheerio";
import { connectDB } from "../../../lib/mongodb";
import Article from "../../../models/Article";
import { IArticle, IFeedItem } from "../../../types/types";
const parser = new Parser();
export const dynamic = "force-dynamic";
import { z } from "zod";
const articleSchemaZod = z.object({
    title: z.string().min(1),
    link: z.string().min(1),
    pubDate: z.string().min(1),
    authorUrl: z.string().min(1),
    author: z.string().min(1),
    imageUrl: z.string().default(""),
    id: z.string().min(1),
    contentSnippet: z.string().default(""),
    subredditURL: z.string().default(""),
    subreddit: z.string().default(""),
    hidden: z.boolean().default(false),
});

function parseHtml(html: string) {
    const $ = cheerio.load(html);
    let imageSrc = $("img").attr("src") || "";

    return imageSrc;
}

function extractSubreddit(inputString: string): string | null {
    const pattern = /submitted by\s+\/u\/\w+\s+to\s+r\/(\w+)/;
    const match = pattern.exec(inputString);

    if (match) {
        const subreddit = match[1];
        return subreddit;
    } else {
        return null;
    }
}

function contentParser(item: IFeedItem) {
    const subreddit = extractSubreddit(item.contentSnippet) || "";
    const article: IArticle = {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        authorUrl: `https://www.reddit.com${item.author}`,
        author: item.author,
        imageUrl: parseHtml(item.content) || "",
        id: item.id,
        contentSnippet: item.contentSnippet
            .replace(/submitted by[\s\S]*$/, "")
            .trim(),
        subredditURL: `https://www.reddit.com/r/${subreddit}`,
        subreddit: subreddit,
        hidden: false,
    };
    try {
        const result = articleSchemaZod.safeParse(article);

        if (result.success) {
            return article;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}
export async function GET(request: NextRequest) {
    await connectDB();
    const feed = await parser.parseURL("http://www.reddit.com/.rss?limit=20");

    if (Array.isArray(feed.items)) {
        const articles = feed.items.map((item) =>
            contentParser(item as IFeedItem)
        );
        console.log(articles);
        const savedArticles = await Promise.all(
            articles.map(async (article) => {
                try {
                    return await Article.create(article);
                } catch (error: any) {
                    console.error(`Error saving article: ${error.message}`);
                    return null;
                }
            })
        );
    }

    return NextResponse.json({ feed, array: Array.isArray(feed.items) });
}
