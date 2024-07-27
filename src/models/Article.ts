import mongoose, { Schema, model, models } from "mongoose";

const Str = mongoose.Schema.Types.String as any;
Str.checkRequired((v: any) => v != null);

const articleSchema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    pubDate: { type: String, required: true },
    authorUrl: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true, default: "" },
    id: { type: String, required: true, unique: true },
    contentSnippet: { type: String, required: true, default: "" },
    subredditURL: { type: String, required: true, default: "" },
    subreddit: { type: String, required: true, default: "" },
    hidden: { type: Boolean, required: true, default: false },
});

const Article = models.Article || model("Article", articleSchema);
export default Article;
