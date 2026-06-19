import multer from 'multer';
const storage=multer.memoryStorage();
const fileFilter=(req,file,cb)=>file.mimetype.startsWith('image/')?cb(null,true):cb(new Error('Only images allowed'),false);
export default multer({storage,fileFilter,limits:{fileSize:5*1024*1024}});
