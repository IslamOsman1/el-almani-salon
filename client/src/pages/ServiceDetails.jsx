import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/services/${id}`), api.get('/gallery')])
      .then(([serviceResponse, galleryResponse]) => {
        setService(serviceResponse.data);
        setGalleryItems(galleryResponse.data);
      })
      .catch(() => {
        setService(null);
        setGalleryItems([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const filteredWorks = useMemo(() => {
    if (!service) return [];
    return galleryItems.filter((item) => item.serviceType === service.title);
  }, [galleryItems, service]);

  if (loading) {
    return <section className="section text-center text-gold">جاري تحميل الخدمة...</section>;
  }

  if (!service) {
    return (
      <section className="section">
        <div className="container-x px-4 text-center">
          <h1 className="gold-text text-4xl font-black">الخدمة غير موجودة</h1>
          <Link to="/services" className="btn btn-gold mt-8">
            العودة إلى الخدمات
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-x space-y-10 px-4">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm text-gold">
          <ArrowLeft size={16} />
          العودة إلى الخدمات
        </Link>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="overflow-hidden rounded-[2rem] border border-gold/20 bg-black/40">
            <img src={service.coverImage || '/logo.png'} alt={service.title} className="h-[420px] w-full object-cover" />
          </div>

          <div className="rounded-[2rem] border border-gold/20 bg-[radial-gradient(circle_at_top,rgba(214,168,58,0.14),rgba(0,0,0,0.78)_45%)] p-8">
            <p className="text-sm font-bold tracking-[0.35em] text-gold">الخدمة</p>
            <h1 className="gold-text mt-4 text-4xl font-black md:text-6xl">{service.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">{service.description}</p>
            <p className="mt-6 text-sm text-gray-400">يوجد {filteredWorks.length} عملًا مرتبطًا بهذه الخدمة</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-bold tracking-[0.35em] text-gold">الأعمال</p>
            <h2 className="mt-2 text-3xl font-black">أعمال الفريق ضمن هذه الخدمة</h2>
          </div>

          {filteredWorks.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredWorks.map((work, index) => {
                const cover = work.media?.[0];
                const hasVideo = work.media?.some((mediaItem) => mediaItem.type === 'video');

                return (
                  <motion.article
                    key={work._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="overflow-hidden rounded-[1.75rem] border border-gold/20 bg-black/35"
                  >
                    <div className="relative">
                      {cover?.type === 'video' ? (
                        <video src={cover.url} className="h-72 w-full bg-black object-cover" muted preload="metadata" />
                      ) : (
                        <img src={cover?.url || '/logo.png'} alt={work.title} className="h-72 w-full object-cover" loading="lazy" />
                      )}
                      {hasVideo ? (
                        <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-xs text-white">
                          <Play size={14} />
                          فيديو
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-4 p-5">
                      <div className="flex items-center gap-3">
                        <img src={work.member?.avatar || '/logo.png'} alt={work.member?.name} className="h-10 w-10 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold">{work.member?.name}</p>
                          <Link to={`/team/${work.member?._id}`} className="text-xs text-gold">
                            فتح صفحة العضو
                          </Link>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold">{work.title}</h3>
                      <p className="text-sm leading-6 text-gray-400">{work.description}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-gold/20 bg-black/30 p-10 text-center text-gray-400">
              لا توجد أعمال مضافة لهذه الخدمة حتى الآن.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
