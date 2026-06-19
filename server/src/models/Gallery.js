import mongoose from 'mongoose';
const gallerySchema=new mongoose.Schema({title:{type:String,required:true},description:String,serviceType:String,imageUrl:{type:String,required:true},publicId:String},{timestamps:true});
export default mongoose.model('Gallery',gallerySchema);
