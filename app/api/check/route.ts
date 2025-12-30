
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; 

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const handle = decoded.handle;

        const client = await clientPromise;
        const db = client.db("linktree");
        const collection = db.collection("users");

        const user = await collection.findOne({ handle });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            user: {
                handle: user.handle,
                email: user.email,
                pic: user.pic,
                links: user.links
            }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Invalid Token" }, { status: 401 });
    }
}
