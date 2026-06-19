import Service from '../models/Service.js';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'el-almani-salon/services', resource_type: 'image' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

export async function getServices(req,res){res.json(await Service.find().sort({createdAt:-1}))}
export async function getServiceById(req,res){const s=await Service.findById(req.params.id);if(!s)return res.status(404).json({message:'Not found'});res.json(s)}
export async function createService(req,res){
  let coverImage='/logo.png';
  let coverPublicId='';
  if(req.file){const upload=await uploadToCloudinary(req.file.buffer);coverImage=upload.secure_url;coverPublicId=upload.public_id}
  res.status(201).json(await Service.create({...req.body,coverImage,coverPublicId}))
}
export async function updateService(req,res){
  const s=await Service.findById(req.params.id);if(!s)return res.status(404).json({message:'Not found'});
  s.title=req.body.title??s.title;
  s.description=req.body.description??s.description;
  s.icon=req.body.icon??s.icon;
  if(req.file){
    if(s.coverPublicId)await cloudinary.uploader.destroy(s.coverPublicId,{resource_type:'image'});
    const upload=await uploadToCloudinary(req.file.buffer);
    s.coverImage=upload.secure_url;
    s.coverPublicId=upload.public_id;
  }
  await s.save();
  res.json(s)
}
export async function deleteService(req,res){const s=await Service.findById(req.params.id);if(!s)return res.status(404).json({message:'Not found'});if(s.coverPublicId)await cloudinary.uploader.destroy(s.coverPublicId,{resource_type:'image'});await s.deleteOne();res.json({message:'Deleted'})}
