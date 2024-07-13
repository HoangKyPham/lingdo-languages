import { Schema } from "mongoose";
import mongoose from "mongoose";

const challengeProgressSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    activeChallenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge",
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

export default mongoose.model("ChallengeProgress", challengeProgressSchema);
