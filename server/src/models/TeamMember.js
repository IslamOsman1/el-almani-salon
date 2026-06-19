import mongoose from 'mongoose';

const teamWorkMediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    title: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const teamWorkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    serviceType: { type: String, default: '', trim: true },
    media: [teamWorkMediaSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    shortBio: { type: String, default: '', trim: true },
    fullBio: { type: String, default: '', trim: true },
    avatar: { type: String, default: '/logo.png' },
    avatarPublicId: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '', trim: true },
      instagram: { type: String, default: '', trim: true },
      whatsapp: { type: String, default: '', trim: true },
    },
    works: [teamWorkSchema],
  },
  { timestamps: true }
);

export default mongoose.model('TeamMember', teamMemberSchema);
