import Gallery from '../models/Gallery.js';
import TeamMember from '../models/TeamMember.js';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'el-almani-salon' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

export async function getGallery(req, res) {
  const members = await TeamMember.find().sort({ createdAt: -1 });

  const items = members.flatMap((member) =>
    member.works
      .filter((work) => work.media?.length)
      .map((work) => ({
      _id: work._id,
      title: work.title,
      description: work.description,
      serviceType: work.serviceType,
      media: work.media,
      member: {
        _id: member._id,
        name: member.name,
        role: member.role,
        avatar: member.avatar,
      },
      createdAt: work.createdAt,
    }))
  );

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(items);
}

export async function createGallery(req, res) {
  const { title, description, serviceType } = req.body;
  if (!req.file) return res.status(400).json({ message: 'Image is required' });
  const up = await uploadToCloudinary(req.file.buffer);
  const item = await Gallery.create({
    title,
    description,
    serviceType,
    imageUrl: up.secure_url,
    publicId: up.public_id,
  });
  res.status(201).json(item);
}

export async function updateGallery(req, res) {
  const item = await Gallery.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  item.title = req.body.title ?? item.title;
  item.description = req.body.description ?? item.description;
  item.serviceType = req.body.serviceType ?? item.serviceType;
  if (req.file) {
    if (item.publicId) await cloudinary.uploader.destroy(item.publicId);
    const up = await uploadToCloudinary(req.file.buffer);
    item.imageUrl = up.secure_url;
    item.publicId = up.public_id;
  }
  await item.save();
  res.json(item);
}

export async function deleteGallery(req, res) {
  const item = await Gallery.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  if (item.publicId) await cloudinary.uploader.destroy(item.publicId);
  await item.deleteOne();
  res.json({ message: 'Deleted' });
}
