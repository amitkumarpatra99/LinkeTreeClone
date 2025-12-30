
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // In production, use environment variable

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { handle, password } = body;

        if (!handle || !password) {
            return NextResponse.json({ success: false, message: "Handle and password are required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("linktree");
        const collection = db.collection("users");

        // Find user
        const user = await collection.findOne({ handle });
        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        // Generate Token
        const token = jwt.sign({ handle: user.handle, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

        return NextResponse.json({ 
            success: true, 
            message: "Login successful", 
            token,
            user: {
                handle: user.handle,
                email: user.email,
                pic: user.pic,
                links: user.links
            }
        });

    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
