import mongoose from "mongoose";

const Schema = mongoose.Schema;


const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userImageSrc: {
        type: String,
        required: true,
    },
    activeCourse: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        require: true,
    },
    hearts: {
        type: Number,
        required: true,
        default: 5
    },
    points: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
})

export default mongoose.model("UserProgress", userSchema);

