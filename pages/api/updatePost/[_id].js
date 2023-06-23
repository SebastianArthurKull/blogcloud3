import { connectMongoDB } from '@lib/MongoConnect';
import Post from "@lib/models/posts";

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { id, title, content, ownerId, avatar } = req.body;

    try {
        await connectMongoDB();

        // Find the post to update
        const post = await Post.findById(id);

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        // Update the post properties
        post.set({
            title: title,
            content: content,
            ownerId: ownerId,
            avatar: avatar
        });

        // Save the updated post
        const updatedPost = await post.save();

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
