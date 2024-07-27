import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Article from "../../../models/Article";

export async function GET() {
    await connectDB();
    try {
        const articles = await Article.find();
        return NextResponse.json({ articles });
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}
export async function POST(request: Request) {
    await connectDB();

    try {
        const data = await request.json();
        const article = new Article(data);
        await article.save();
        return NextResponse.json({ article });
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}

export async function PUT(request: Request) {
    await connectDB();

    try {
        const data = await request.json();
        const { _id, ...rest } = data;
        const article = await Article.findByIdAndUpdate(_id, rest, {
            new: true,
        });
        console.log(article);
        return NextResponse.json({ article });
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}

export async function PATCH(request: Request) {
    await connectDB();

    try {
        const data = await request.json();
        const { _id, hidden } = data;
        console.log(data);
        console.log("123", hidden, _id);
        const article = await Article.findByIdAndUpdate(
            _id,
            { hidden },
            { new: true }
        );
        console.log(article);
        return NextResponse.json({ article });
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}
export async function DELETE(request: Request) {
    await connectDB();

    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        await Article.findByIdAndDelete(id);
        return NextResponse.json({ message: "Article deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}
