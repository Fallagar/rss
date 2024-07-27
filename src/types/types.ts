export interface IUserDocument {
    _id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IArticle {
    _id?: string;
    title: string;
    link: string;
    pubDate: string;
    authorUrl: string;
    author: string;
    imageUrl: string;
    id: string;
    contentSnippet: string;
    hidden: boolean;
    subredditURL: string;
    subreddit: string;
}
export interface IFeedItem {
    title: string;
    link: string;
    pubDate: string;
    author: string;
    content: string;
    contentSnippet: string;
    id: string;
    isoDate: string;
}

export interface IFeed {
    items: IFeedItem[];
    link: string;
    feedUrl: string;
    title: string;
    lastBuildDate: string;
}

export interface IRssResponse {
    feed: IFeed;
}
