import axios from "axios";
import ArticlesList from "../../components/articlesList";
import { connectDB } from "../../lib/mongodb";
import Article from "../../models/Article";
import { IArticle } from "../../types/types";
import { unstable_cache } from "next/cache";

const getCahchedData = unstable_cache(
    async () => {
        await connectDB();

        try {
            const articles: IArticle[] = await Article.find({
                hidden: false,
            });
            return JSON.parse(JSON.stringify(articles));
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    [""],
    {
        revalidate: 60000,
    }
);

export default async function Page() {
    const data = await getCahchedData();

    return <ArticlesList initialArticles={data} />;
}
