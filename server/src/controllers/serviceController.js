import Service from '../models/Service.js';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'el-almani-salon/services',
        resource_type: 'image',
        transformation: [{ fetch_format: 'auto', quality: 'auto:good' }],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

export async function getServices(req, res) {
  res.json(await Service.find().sort({ createdAt: -1 }));
}

export async function getServiceById(req, res) {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.json(service);
}

export async function createService(req, res) {
  let coverImage = '/logo.png';
  let coverPublicId = '';

  if (req.file) {
    const upload = await uploadToCloudinary(req.file.buffer);
    coverImage = upload.secure_url;
    coverPublicId = upload.public_id;
  }

  const service = await Service.create({
    title: req.body.title,
    description: req.body.description || '',
    coverImage,
    coverPublicId,
  });

  res.status(201).json(service);
}

export async function updateService(req, res) {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: 'Not found' });
  }

  service.title = req.body.title ?? service.title;
  service.description = req.body.description ?? service.description;

  if (req.file) {
    if (service.coverPublicId) {
      await cloudinary.uploader.destroy(service.coverPublicId, { resource_type: 'image' });
    }

    const upload = await uploadToCloudinary(req.file.buffer);
    service.coverImage = upload.secure_url;
    service.coverPublicId = upload.public_id;
  }

  await service.save();
  res.json(service);
}

export async function deleteService(req, res) {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (service.coverPublicId) {
    await cloudinary.uploader.destroy(service.coverPublicId, { resource_type: 'image' });
  }

  await service.deleteOne();
  res.json({ message: 'Deleted' });
}
