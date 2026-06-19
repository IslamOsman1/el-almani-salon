import { motion } from 'framer-motion';
import { Play, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import SectionTitle from '../components/SectionTitle';

function GalleryModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 p-4 backdrop-blur" onClick={onClose}>
      <div className="container-x max-h-[90vh] overflow-y-auto rounded-[2rem] border border-gold/20 bg-[#090909] p-6" onClick={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-[0.35em] text-gold">{item.serviceType || 'عمل من المعرض'}</p>
            <h2 className="mt-2 text-3xl font-black">{item.title}</h2>
            <p className="mt-3 max-w-3xl text-gray-400">{item.description}</p>
            <div className="mt-4 flex items-center gap-3">
              <img src={item.member.avatar || '/logo.png'} alt={item.member.name} className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{item.member.name}</p>
                <Link to={`/team/${item.member._id}`} className="text-sm text-gold" onClick={onClose}>
                  الذهاب إلى صفحة العضو
                </Link>
              </div>
            </div>
          </div>

          <button type="button" className="rounded-full border border-gold/20 p-3 text-gold" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {item.media.map((mediaItem) => (
            <div key={mediaItem._id} className="overflow-hidden rounded-[1.5rem] border border-gold/20 bg-black/50">
              {mediaItem.type === 'video' ? (
                <video src={mediaItem.url} className="h-72 w-full bg-black object-cover" controls playsInline preload="metadata" />
              ) : (
                <img src={mediaItem.url} alt={mediaItem.title || item.title} className="h-72 w-full object-cover" loading="lazy" />
              )}

              <div className="p-4 text-sm text-gray-400">
                {mediaItem.description || item.description || 'تفاصيل العمل المعروض'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState('الكل');
  const [serviceFilter, setServiceFilter] = useState('الكل');
  const [memberFilter, setMemberFilter] = useState('الكل');

  useEffect(() => {
    api
      .get('/gallery')
      .then((response) => setItems(response.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const serviceTypes = useMemo(() => ['الكل', ...new Set(items.map((item) => item.serviceType).filter(Boolean))], [items]);
  const members = useMemo(() => ['الكل', ...new Set(items.map((item) => item.member?.name).filter(Boolean))], [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesQuery =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.serviceType?.toLowerCase().includes(query) ||
        item.member?.name?.toLowerCase().includes(query);

      const hasVideo = item.media?.some((mediaItem) => mediaItem.type === 'video');
      const hasImage = item.media?.some((mediaItem) => mediaItem.type === 'image');
      const matchesMedia =
        mediaFilter === 'الكل' ||
        (mediaFilter === 'صور' && hasImage) ||
        (mediaFilter === 'فيديوهات' && hasVideo);

      const matchesService = serviceFilter === 'الكل' || item.serviceType === serviceFilter;
      const matchesMember = memberFilter === 'الكل' || item.member?.name === memberFilter;

      return matchesQuery && matchesMedia && matchesService && matchesMember;
    });
  }, [items, search, mediaFilter, serviceFilter, memberFilter]);

  return (
    <section className="section">
      <div className="container-x px-4">
        <SectionTitle
          eyebrow="المعرض"
          title="معرض أعمال الفريق"
          desc="استعرض صور وفيديوهات الأعمال الحقيقية المنفذة داخل الصالون، مع تصفية سهلة حسب الخدمة أو عضو الفريق."
        />

        <div className="mb-8 grid gap-4 rounded-[2rem] border border-gold/20 bg-black/40 p-5 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <label className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
            <input className="input pl-11" placeholder="ابحث باسم العمل أو العضو أو نوع الخدمة" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>

          <select className="input" value={mediaFilter} onChange={(event) => setMediaFilter(event.target.value)}>
            <option>الكل</option>
            <option>صور</option>
            <option>فيديوهات</option>
          </select>

          <select className="input" value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)}>
            {serviceTypes.map((serviceType) => (
              <option key={serviceType}>{serviceType}</option>
            ))}
          </select>

          <select className="input" value={memberFilter} onChange={(event) => setMemberFilter(event.target.value)}>
            {members.map((member) => (
              <option key={member}>{member}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="py-16 text-center text-gold">جاري تحميل المعرض...</p>
        ) : (
          <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
            {filteredItems.map((item, index) => {
              const cover = item.media?.[0];
              const hasVideo = item.media?.some((mediaItem) => mediaItem.type === 'video');

              return (
                <motion.article
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="group mb-5 break-inside-avoid overflow-hidden rounded-[1.75rem] border border-gold/20 bg-black/40"
                >
                  <button type="button" className="block w-full text-left" onClick={() => setSelectedItem(item)}>
                    <div className="relative">
                      {cover?.type === 'video' ? (
                        <video src={cover.url} className="max-h-[420px] w-full bg-black object-cover" muted preload="metadata" />
                      ) : (
                        <img src={cover?.url || '/logo.png'} alt={item.title} className="max-h-[420px] w-full object-cover" loading="lazy" />
                      )}

                      {hasVideo ? (
                        <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/75 px-3 py-2 text-xs text-white">
                          <Play size={14} />
                          فيديو
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-4 p-5">
                      <div className="flex items-center gap-3">
                        <img src={item.member.avatar || '/logo.png'} alt={item.member.name} className="h-11 w-11 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold">{item.member.name}</p>
                          <p className="text-xs text-gray-400">{item.member.role}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-gold/10 px-3 py-1 text-xs text-gold">{item.serviceType || 'خدمة عامة'}</span>
                        <span className="rounded-full border border-gold/20 px-3 py-1 text-xs text-gray-400">
                          {item.media?.length || 0} عناصر
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  </button>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      <GalleryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}
