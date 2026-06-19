import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, MessageCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

function WorkBlock({ work, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="space-y-5 rounded-[2rem] border border-gold/20 bg-black/35 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold">{work.title}</h3>
          <p className="mt-2 text-gray-400">{work.description}</p>
        </div>
        <span className="rounded-full bg-gold/10 px-4 py-2 text-sm text-gold">
          {work.serviceType || 'خدمة عامة'}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {work.media?.map((mediaItem) => (
          <div key={mediaItem._id} className="overflow-hidden rounded-[1.5rem] border border-gold/20 bg-black/50">
            {mediaItem.type === 'video' ? (
              <video src={mediaItem.url} className="h-72 w-full bg-black object-cover" controls playsInline preload="metadata" />
            ) : (
              <img src={mediaItem.url} alt={mediaItem.title || work.title} className="h-72 w-full object-cover" loading="lazy" />
            )}

            <div className="space-y-2 p-4">
              <span className="rounded-full border border-gold/20 px-3 py-1 text-xs text-gray-300">
                {mediaItem.type === 'video' ? 'فيديو' : 'صورة'}
              </span>
              <p className="text-sm text-gray-400">{mediaItem.description || work.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.article>
  );
}

export default function TeamMemberDetails() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/team/${id}`)
      .then((response) => setMember(response.data))
      .catch(() => setMember(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <section className="section text-center text-gold">جاري تحميل الصفحة...</section>;
  }

  if (!member) {
    return (
      <section className="section">
        <div className="container-x px-4 text-center">
          <h1 className="gold-text text-4xl font-black">العضو غير موجود</h1>
          <p className="mt-4 text-gray-400">تعذر العثور على بيانات هذا العضو في الوقت الحالي.</p>
          <Link to="/team" className="btn btn-gold mt-8">
            العودة إلى الفريق
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-x space-y-10 px-4">
        <Link to="/team" className="inline-flex items-center gap-2 text-sm text-gold">
          <ArrowLeft size={16} />
          العودة إلى الفريق
        </Link>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr] lg:items-start">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="overflow-hidden rounded-[2.25rem] border border-gold/20 bg-black/50 shadow-gold">
            <img src={member.avatar || '/logo.png'} alt={member.name} className="h-[520px] w-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2.25rem] border border-gold/20 bg-[radial-gradient(circle_at_top,rgba(214,168,58,0.16),rgba(0,0,0,0.75)_45%)] p-8">
            <p className="mb-4 text-sm font-bold tracking-[0.35em] text-gold">عضو من الفريق</p>
            <h1 className="gold-text text-4xl font-black md:text-6xl">{member.name}</h1>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 text-sm text-gold">
              <Briefcase size={16} />
              {member.role}
            </p>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">{member.fullBio || member.shortBio}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {member.socialLinks?.whatsapp ? (
                <a className="btn btn-gold" href={`https://wa.me/${member.socialLinks.whatsapp}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2" size={18} />
                  واتساب
                </a>
              ) : null}

              <span className="rounded-full border border-gold/20 px-4 py-2 text-sm text-gray-300">
                {member.works?.length || 0} أعمال
              </span>
            </div>
          </motion.div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold tracking-[0.35em] text-gold">الأعمال</p>
              <h2 className="mt-2 text-3xl font-black">أعمال هذا العضو</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-gray-400">
              هنا ستجد الصور والفيديوهات المرتبطة بأعمال العضو، مع عرض واضح لكل خدمة أو مشروع قام بتنفيذه.
            </p>
          </div>

          {member.works?.length ? (
            <div className="space-y-5">
              {member.works.map((work, index) => (
                <WorkBlock key={work._id} work={work} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-gold/20 bg-black/30 p-10 text-center text-gray-400">
              لا توجد أعمال مضافة لهذا العضو حتى الآن.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
