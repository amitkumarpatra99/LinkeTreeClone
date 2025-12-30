
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("linktree");
        const collection = db.collection("users");

        if (!body.handle) {
            return NextResponse.json({ success: false, error: true, message: "Handle is required!" }, { status: 400 });
        }

        const result = await collection.updateOne(
            { handle: body.handle },
            { 
                $set: { 
                    links: body.links,
                    pic: body.pic,
                    bio: body.bio,
                    theme: body.theme
                } 
            },
            { upsert: true }
        );

        return NextResponse.json({ success: true, error: false, message: 'Profile Updated!', result });

    } catch (error: any) {
        console.error("Database Error:", error);
        return NextResponse.json({ success: false, error: true, message: error.message }, { status: 500 });
    }
}
