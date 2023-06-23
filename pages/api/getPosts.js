import { connectMongoDB } from '@lib/MongoConnect';
import Post from "@lib/models/posts";

connectMongoDB();

export default async function handler(req, res) {
    const { method } = req;

    if (req.method !== "GET") {
        res.status(405).send({msg: "Only GET requests are allowed."});
        return
    }

    try {
        // await connectMongoDB()
        const tasks = await Post.find()
        res.status(200).send(tasks)
    } catch (e) {
        console.log(e)
        res.status(400).send({e, msg: "Something went wrong!"});
    }
}
