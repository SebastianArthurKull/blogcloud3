import {Schema, model, models} from 'mongoose';

const schema = new Schema({
    email: String,
    password: String,
    name: String,
    avatar: String,
    bio: String,
    follows: [String],
});

const Users = models.users || model('users', schema, "users");

export default Users;
