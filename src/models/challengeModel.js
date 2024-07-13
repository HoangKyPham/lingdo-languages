import { Schema } from "mongoose";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const challengeSchema = new Schema({
    activeLesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: true,
    },
    type: {
        type: String,
        enum: ["SELECT", "ASSIST"],
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

challengeSchema.plugin(mongoosePaginate)


export default mongoose.model("Challenge", challengeSchema);
