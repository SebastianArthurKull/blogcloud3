import { connectMongoDB } from '@lib/MongoConnect';
import Comment from "@lib/models/comments";

export default async function handler(req, res) {
    const { method } = req;

    if (req.method !== "GET") {
        res.status(405).json({ msg: "Only GET requests are allowed." });
        return;
    }

    try {
        connectMongoDB();
        const { postId } = req.query;
        console.log(postId)
        const comments = Comment.find({postId}).exec();

        res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error, msg: "Something went wrong!" });
    }
}

