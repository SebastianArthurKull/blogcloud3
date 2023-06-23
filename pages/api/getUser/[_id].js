import { connectMongoDB } from '@lib/MongoConnect';
import Users from "@lib/models/users";
connectMongoDB();

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.status(405).send({ msg: "Only GET requests are allowed." });
        return;
    }


    try {
        await connectMongoDB();
        const { _id } = req.query;
        const user = await Users.findById(_id);

        if (!user) {
            res.status(404).send({ msg: "Users not found." });
            return;
        }

        res.status(200).send(user);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e, msg: "Something went wrong!" });
    }
}
