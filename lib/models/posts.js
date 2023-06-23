import { Schema, model, models } from 'mongoose';


const schema = new Schema({
    title: String,
    content: String,
    ownerId: String,
    avatar: [String],
    likes: [String],
    createdAt: Date,
    updatedAt: Date
}, { timestamps: true });

const Post = models.posts || model('posts', schema, "posts");

export default Post;