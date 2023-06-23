import { connectMongoDB } from '@lib/MongoConnect';
import Users from "@lib/models/users";
import {convertUser} from "@lib/api";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { email, password } = req.body;


    try {
        await connectMongoDB()
        const user = await Users.findOne({ email });

        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        if (user.password === password) {
            res.status(200).json(user);
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }


    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
