import {Schema, model, models} from "mongoose";

const taskSchema = new Schema({
    task: {
        type: String,
        required: true
    },
},
);

const Task = models.Task || model("Task", taskSchema, "task")

export default Task;