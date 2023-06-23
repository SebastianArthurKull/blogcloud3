import { connectMongoDB } from '@lib/MongoConnect';
import Users from "@lib/models/users";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { email, password, name, avatar, bio, follows } = req.body;

    try {
        await connectMongoDB()
        const newUser = new Users({
            email,
            password,
            name,
            avatar,
            bio,
            follows,
        });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
