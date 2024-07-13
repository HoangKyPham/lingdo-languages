import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSubscriptionSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    vnPayCustomerId: {
        type: String,
        required: true,
        unique: true
    },
    vnPaySubscriptionId: {
        type: String,
        required: true,
        unique: true
    },
    vnPayPriceId: {
        type: String,
        required: true
    },
    vnPayCurrentPeriodEnd: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model("UserSubscription", userSubscriptionSchema);
