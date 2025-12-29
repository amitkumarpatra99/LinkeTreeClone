import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("linktree");
        const collection = db.collection("users");

        // Fetch all users (limit to 50 for performance)
        const users = await collection.find({}).limit(50).toArray();

        return NextResponse.json({ success: true, users });
    } catch (error: any) {
        console.error("Database Error:", error);
        return NextResponse.json({ success: false, error: true, message: error.message }, { status: 500 });
    }
}
