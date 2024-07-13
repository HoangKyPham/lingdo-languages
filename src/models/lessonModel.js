import { Schema } from "mongoose";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"


const lessonSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    activeUnit : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required : true,
    },
    order : {
        type : Number,
        required : true,
    },
}, {
    timestamps : true,
    versionKey : false
})

lessonSchema.plugin(mongoosePaginate)

export default mongoose.model("Lesson", lessonSchema);

