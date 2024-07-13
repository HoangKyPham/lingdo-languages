import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const Schema = mongoose.Schema;
const courseSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    imageSrc : {
        type : String,
        required : true,
    }
}, {
    timestamps : true,
    versionKey : false
})

courseSchema.plugin(mongoosePaginate)

export default mongoose.model("Course", courseSchema);

