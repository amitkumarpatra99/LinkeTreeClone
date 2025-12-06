import clientPromise from "@/lib/mongodb";

export async function POST(request) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("linktree"); // Use 'linktree' database
        const collection = db.collection("users");

        // Check if handle is provided
        if (!body.handle) {
            return Response.json({ success: false, error: true, message: "Handle is required!" });
        }

        // Check if handle already exists (if verifying uniqueness is required in future steps)
        const existingUser = await collection.findOne({ handle: body.handle });

        if (existingUser) {
            // Update existing user
            const result = await collection.updateOne(
                { handle: body.handle },
                {
                    $set: {
                        links: body.links,
                        pic: body.pic,
                        handle: body.handle
                    }
                }
            );
            return Response.json({ success: true, error: false, message: 'Link Tree Updated!', result });
        } else {
            // Create new user
            const result = await collection.insertOne(body);
            return Response.json({ success: true, error: false, message: 'Link Tree Created!', result });
        }

    } catch (error) {
        console.error("Database Error:", error);
        return Response.json({ success: false, error: true, message: error.message });
    }
}