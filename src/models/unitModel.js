import { Schema } from "mongoose";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const unitSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    activeCourse : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Course",
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

unitSchema.plugin(mongoosePaginate)

export default mongoose.model("Unit", unitSchema);

