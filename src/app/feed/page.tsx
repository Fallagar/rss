import axios from "axios";
import ArticlesList from "../../components/articlesList";
import { connectDB } from "../../lib/mongodb";
import Article from "../../models/Article";
import { IArticle } from "../../types/types";

// const ArticlesPage = ({ initialArticles }: { initialArticles: Article[] }) => {
//     return <ArticlesList initialArticles={initialArticles} />;
// };

async function getData() {
    await connectDB();

    try {
        const articles: IArticle[] = await Article.find({
            hidden: false,
        }).lean();
        //@ts-ignore
        return JSON.parse(JSON.stringify(articles));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function Page() {
    const data = await getData();

    return <ArticlesList initialArticles={data} />;
}
