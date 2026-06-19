import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, ImageIcon, PlayCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

export default function TeamWorkDetails() {
  const { id, workId } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/team/${id}`)
      .then((response) => setMember(response.data))
      .catch(() => setMember(null))
      .finally(() => setLoading(false));
  }, [id]);

  const work = useMemo(() => {
    if (!member) return null;
    return member.works?.find((item) => item._id === workId) || null;
  }, [member, workId]);

  const cover = work?.media?.[0];

  if (loading) {
    return <section className="section text-center text-gold">جاري تحميل العمل...</section>;
  }

  if (!member || !work) {
    return (
      <section className="section">
        <div className="container-x px-4 text-center">
          <h1 className="gold-text text-4xl font-black">العمل غير موجود</h1>
          <p className="mt-4 text-gray-400">تعذر العثور على هذا العمل أو بيانات العضو المرتبط به.</p>
          <Link to={`/team/${id}`} className="btn btn-gold mt-8">
            العودة إلى صفحة العضو
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-x space-y-10 px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to={`/team/${id}`} className="inline-flex items-center gap-2 text-sm text-gold">
            <ArrowLeft size={16} />
            العودة إلى صفحة العضو
          </Link>

          <Link to="/team" className="inline-flex items-center gap-2 text-sm text-gray-400">
            عرض الفريق
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="overflow-hidden rounded-[2.25rem] border border-gold/20 bg-black/45"
          >
            {cover?.type === 'video' ? (
              <video src={cover.url} className="h-[520px] w-full bg-black object-cover" controls playsInline preload="metadata" />
            ) : (
              <img
                src={cover?.url || '/logo.png'}
                alt={work.title}
                className="h-[520px] w-full object-cover"
                loading="lazy"
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.25rem] border border-gold/20 bg-[radial-gradient(circle_at_top,rgba(214,168,58,0.16),rgba(0,0,0,0.78)_45%)] p-8 text-right"
          >
            <p className="text-sm font-bold tracking-[0.35em] text-gold">تفاصيل العمل</p>
            <h1 className="gold-text mt-4 text-4xl font-black md:text-6xl">{work.title}</h1>

            {work.serviceType ? (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 text-sm text-gold">
                <Briefcase size={16} />
                {work.serviceType}
              </p>
            ) : null}

            <p className="mt-6 text-lg leading-8 text-gray-300">
              {work.description || 'هذا العمل يعرض مجموعة من الصور والفيديوهات الخاصة بهذا العضو داخل هذه الخدمة.'}
            </p>

            <div className="mt-8 rounded-[1.7rem] border border-gold/15 bg-black/25 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-400">تم تنفيذ العمل بواسطة</p>
                  <Link to={`/team/${member._id}`} className="mt-2 inline-block text-2xl font-black text-gold">
                    {member.name}
                  </Link>
                  <p className="mt-2 text-sm text-gray-400">{member.role}</p>
                </div>
                <img src={member.avatar || '/logo.png'} alt={member.name} className="h-20 w-20 rounded-2xl object-cover" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 px-4 py-2 text-gray-300">
                <ImageIcon size={16} className="text-gold" />
                {work.media?.filter((item) => item.type === 'image').length || 0} صور
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 px-4 py-2 text-gray-300">
                <PlayCircle size={16} className="text-gold" />
                {work.media?.filter((item) => item.type === 'video').length || 0} فيديوهات
              </span>
            </div>
          </motion.div>
        </div>

        <div className="space-y-5">
          <div className="text-right">
            <p className="text-sm font-bold tracking-[0.35em] text-gold">المعرض</p>
            <h2 className="mt-2 text-3xl font-black">صور وفيديوهات هذا العمل</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {work.media?.map((mediaItem, index) => (
              <motion.article
                key={mediaItem._id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="overflow-hidden rounded-[1.75rem] border border-gold/20 bg-black/35"
              >
                {mediaItem.type === 'video' ? (
                  <video src={mediaItem.url} className="h-80 w-full bg-black object-cover" controls playsInline preload="metadata" />
                ) : (
                  <img src={mediaItem.url} alt={mediaItem.title || work.title} className="h-80 w-full object-cover" loading="lazy" />
                )}

                <div className="space-y-3 p-5 text-right">
                  <div className="flex justify-end">
                    <span className="rounded-full border border-gold/20 px-3 py-1 text-xs text-gray-300">
                      {mediaItem.type === 'video' ? 'فيديو' : 'صورة'}
                    </span>
                  </div>
                  <p className="text-sm leading-7 text-gray-400">
                    {mediaItem.description || work.description || 'عنصر من معرض هذا العمل.'}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
