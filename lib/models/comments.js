import { Schema, model, models } from 'mongoose';

const schema = new Schema({
    postId: String,
    ownerId: String,
    content: String,
    createdAt: Date,
    updatedAt: Date
}, { timestamps: true });

const Comment = models.comments || model('comments', schema, "comments");

export default Comment;
