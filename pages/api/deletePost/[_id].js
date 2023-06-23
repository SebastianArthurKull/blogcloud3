import { connectMongoDB } from '@lib/MongoConnect';
import Post from "@lib/models/posts";

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { _id } = req.query;

    try {
        await connectMongoDB();

        // Find the post to delete
        const post = await Post.findById(_id);

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        // Delete the post
        await Post.findByIdAndDelete(_id);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
