import Setting from '../models/Setting.js';

const defaultSettings = {
  phone: '+20 100 000 0000',
  whatsapp: '201000000000',
  address: 'مصر',
  addresses: [],
  facebook: '#',
  instagram: '#',
  tiktok: '#',
};

export async function getSettings(req,res){
  let s=await Setting.findOne();
  if(!s)s=await Setting.create(defaultSettings);
  if(!Array.isArray(s.addresses))s.addresses=[];
  res.json(s)
}

export async function updateSettings(req,res){
  let s=await Setting.findOne();
  const nextData = {
    ...req.body,
    addresses: Array.isArray(req.body.addresses) ? req.body.addresses : [],
  };
  if(!s)s=await Setting.create({...defaultSettings,...nextData});
  else Object.assign(s,nextData),await s.save();
  res.json(s)
}
