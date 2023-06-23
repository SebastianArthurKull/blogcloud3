import { connectMongoDB } from '@lib/MongoConnect';
import Post from "@lib/models/posts";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { title, content, ownerId, avatar} = req.body;

    try {
        await connectMongoDB()
        const newPost = new Post({
            title,
            content,
            ownerId,
            avatar,
            likes: []
        });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
