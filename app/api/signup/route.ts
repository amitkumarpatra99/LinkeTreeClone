
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { handle, email, password } = body;

        if (!handle || !email || !password) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("linktree");
        const collection = db.collection("users");

        // Check if user already exists
        const existingUser = await collection.findOne({ $or: [{ handle }, { email }] });
        if (existingUser) {
            return NextResponse.json({ success: false, message: "User with this handle or email already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            handle,
            email,
            password: hashedPassword,
            links: [],
            pic: "",
            createdAt: new Date()
        };

        await collection.insertOne(newUser);

        return NextResponse.json({ success: true, message: "User created successfully" });

    } catch (error: any) {
        console.error("Signup Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
