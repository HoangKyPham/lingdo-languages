import { Schema } from "mongoose";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const challengeOptionSchema = new Schema({
    activeChallenge : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    correct: {
        type: Boolean,
        required: true,
    },
    imageSrc: {
        type: String,
    },
    audioSrc: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false,
});

challengeOptionSchema.plugin(mongoosePaginate)


export default mongoose.model("ChallengeOption", challengeOptionSchema);
