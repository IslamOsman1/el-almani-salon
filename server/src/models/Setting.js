import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: '', trim: true },
    url: { type: String, default: '', trim: true },
  },
  { _id: true }
);

const settingSchema=new mongoose.Schema({
  phone:String,
  whatsapp:String,
  address:String,
  addresses:[addressSchema],
  facebook:String,
  instagram:String,
  tiktok:String
},{timestamps:true});
export default mongoose.model('Setting',settingSchema);
