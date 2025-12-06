import clientPromise from "@/lib/mongodb";

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db("linktree");
        const collection = db.collection("users");

        // Fetch all users (limit to 50 for performance)
        const users = await collection.find({}).limit(50).toArray();

        return Response.json({ success: true, users });
    } catch (error) {
        console.error("Database Error:", error);
        return Response.json({ success: false, error: true, message: error.message });
    }
}
