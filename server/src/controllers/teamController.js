import cloudinary from '../config/cloudinary.js';
import TeamMember from '../models/TeamMember.js';

const TEAM_FOLDER = 'el-almani-salon/team';

function toType(value) {
  return value === 'video' ? 'video' : 'image';
}

function uploadBuffer(file, folder) {
  const isImage = file.mimetype.startsWith('image/');

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        ...(isImage
          ? { transformation: [{ fetch_format: 'auto', quality: 'auto:good' }] }
          : {}),
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
}

async function destroyAsset(publicId, resourceType = 'image') {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

function normalizeLinks(body, currentLinks = {}) {
  return {
    facebook: body.facebook ?? currentLinks.facebook ?? '',
    instagram: body.instagram ?? currentLinks.instagram ?? '',
    whatsapp: body.whatsapp ?? currentLinks.whatsapp ?? '',
  };
}

export async function getTeam(req, res) {
  const team = await TeamMember.find().sort({ createdAt: -1 });
  res.json(team);
}

export async function getTeamMember(req, res) {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    res.status(404).json({ message: 'Team member not found' });
    return;
  }

  res.json(member);
}

export async function createTeamMember(req, res) {
  const { name, role, shortBio, fullBio } = req.body;
  let avatar = '/logo.png';
  let avatarPublicId = '';

  if (req.file) {
    const upload = await uploadBuffer(req.file, TEAM_FOLDER);
    avatar = upload.secure_url;
    avatarPublicId = upload.public_id;
  }

  const member = await TeamMember.create({
    name,
    role,
    shortBio,
    fullBio,
    avatar,
    avatarPublicId,
    socialLinks: normalizeLinks(req.body),
  });

  res.status(201).json(member);
}

export async function updateTeamMember(req, res) {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    res.status(404).json({ message: 'Team member not found' });
    return;
  }

  member.name = req.body.name ?? member.name;
  member.role = req.body.role ?? member.role;
  member.shortBio = req.body.shortBio ?? member.shortBio;
  member.fullBio = req.body.fullBio ?? member.fullBio;
  member.socialLinks = {
    ...member.socialLinks,
    ...normalizeLinks(req.body, member.socialLinks),
  };

  if (req.file) {
    if (member.avatarPublicId) {
      await destroyAsset(member.avatarPublicId, 'image');
    }

    const upload = await uploadBuffer(req.file, TEAM_FOLDER);
    member.avatar = upload.secure_url;
    member.avatarPublicId = upload.public_id;
  }

  await member.save();
  res.json(member);
}

export async function deleteTeamMember(req, res) {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    res.status(404).json({ message: 'Team member not found' });
    return;
  }

  if (member.avatarPublicId) {
    await destroyAsset(member.avatarPublicId, 'image');
  }

  await Promise.all(
    member.works.flatMap((work) =>
      work.media.map((mediaItem) =>
        destroyAsset(mediaItem.publicId, mediaItem.type === 'video' ? 'video' : 'image')
      )
    )
  );

  await member.deleteOne();
  res.json({ message: 'Team member deleted' });
}

export async function createTeamWork(req, res) {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    res.status(404).json({ message: 'Team member not found' });
    return;
  }

  const files = req.files || [];

  if (!files.length) {
    res.status(400).json({ message: 'At least one image or video is required' });
    return;
  }

  const media = await Promise.all(
    files.map(async (file) => {
      const upload = await uploadBuffer(file, `${TEAM_FOLDER}/works`);

      return {
        url: upload.secure_url,
        publicId: upload.public_id,
        type: toType(file.mimetype.split('/')[0]),
        title: req.body.mediaTitle || '',
        description: req.body.mediaDescription || '',
      };
    })
  );

  member.works.unshift({
    title: req.body.title,
    description: req.body.description,
    serviceType: req.body.serviceType,
    media,
  });

  await member.save();
  res.status(201).json(member);
}

export async function updateTeamWork(req, res) {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    res.status(404).json({ message: 'Team member not found' });
    return;
  }

  const work = member.works.id(req.params.workId);

  if (!work) {
    res.status(404).json({ message: 'Work not found' });
    return;
  }

  work.title = req.body.title ?? work.title;
  work.description = req.body.description ?? work.description;
  work.serviceType = req.body.serviceType ?? work.serviceType;

  const files = req.files || [];

  if (files.length) {
    const newMedia = await Promise.all(
      files.map(async (file) => {
        const upload = await uploadBuffer(file, `${TEAM_FOLDER}/works`);

        return {
          url: upload.secure_url,
          publicId: upload.public_id,
          type: toType(file.mimetype.split('/')[0]),
          title: req.body.mediaTitle || '',
          description: req.body.mediaDescription || '',
        };
      })
    );

    work.media.push(...newMedia);
  }

  await member.save();
  res.json(member);
}

export async function deleteTeamWork(req, res) {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    res.status(404).json({ message: 'Team member not found' });
    return;
  }

  const work = member.works.id(req.params.workId);

  if (!work) {
    res.status(404).json({ message: 'Work not found' });
    return;
  }

  await Promise.all(
    work.media.map((mediaItem) =>
      destroyAsset(mediaItem.publicId, mediaItem.type === 'video' ? 'video' : 'image')
    )
  );
  work.deleteOne();
  await member.save();

  res.json(member);
}

export async function deleteTeamWorkMedia(req, res) {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    res.status(404).json({ message: 'Team member not found' });
    return;
  }

  const work = member.works.id(req.params.workId);

  if (!work) {
    res.status(404).json({ message: 'Work not found' });
    return;
  }

  const mediaItem = work.media.id(req.params.mediaId);

  if (!mediaItem) {
    res.status(404).json({ message: 'Media not found' });
    return;
  }

  await destroyAsset(mediaItem.publicId, mediaItem.type === 'video' ? 'video' : 'image');
  mediaItem.deleteOne();
  await member.save();

  res.json(member);
}
