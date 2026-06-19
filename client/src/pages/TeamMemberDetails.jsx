import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, FolderOpen, ImageIcon, MessageCircle, PlayCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import OptimizedImage from '../components/OptimizedImage';
import LazyVideo from '../components/LazyVideo';

function WorkCard({ memberId, work, index }) {
  const cover = work.media?.[0];
  const imageCount = work.media?.filter((item) => item.type === 'image').length || 0;
  const videoCount = work.media?.filter((item) => item.type === 'video').length || 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group overflow-hidden rounded-[2rem] border border-gold/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]"
    >
      <Link to={`/team/${memberId}/works/${work._id}`} className="block">
        <div className="relative overflow-hidden">
          {cover?.type === 'video' ? (
            <LazyVideo src={cover.url} className="h-72 w-full transition duration-500 group-hover:scale-105" muted preload="metadata" />
          ) : (
            <OptimizedImage
              src={cover?.url || '/logo.png'}
              alt={work.title}
              className="h-72 w-full"
              imgClassName="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {work.serviceType ? (
              <span className="rounded-full bg-gold/90 px-3 py-1 text-xs font-bold text-black">
                {work.serviceType}
              </span>
            ) : null}
            {cover?.type === 'video' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                <PlayCircle size={14} />
                فيديو
              </span>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 p-5 text-right">
          <div>
            <h3 className="text-2xl font-black">{work.title}</h3>
            <p className="mt-3 line-clamp-3 leading-7 text-gray-400">{work.description || 'عمل مميز ضمن أعمال هذا العضو.'}</p>
          </div>

          <div className="flex flex-wrap justify-end gap-2 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 px-3 py-2 text-gray-300">
              <ImageIcon size={14} className="text-gold" />
              {imageCount} صور
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 px-3 py-2 text-gray-300">
              <PlayCircle size={14} className="text-gold" />
              {videoCount} فيديوهات
            </span>
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-bold text-gold">
            فتح صفحة العمل
            <ArrowLeft size={16} />
          </div>
        </div>
      </Link>
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

  const stats = useMemo(() => {
    const works = member?.works || [];
    const media = works.flatMap((work) => work.media || []);

    return {
      works: works.length,
      images: media.filter((item) => item.type === 'image').length,
      videos: media.filter((item) => item.type === 'video').length,
    };
  }, [member]);

  if (loading) {
    return <section className="section text-center text-gold">جاري تحميل صفحة العضو...</section>;
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

        <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="overflow-hidden rounded-[2.25rem] border border-gold/20 bg-black/50 shadow-gold"
          >
            <OptimizedImage
              src={member.avatar || '/logo.png'}
              alt={member.name}
              eager
              highPriority
              className="h-[500px] w-full"
              imgClassName="h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 380px"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.25rem] border border-gold/20 bg-[radial-gradient(circle_at_top,rgba(214,168,58,0.16),rgba(0,0,0,0.78)_45%)] p-8 text-right"
          >
            <p className="mb-4 text-sm font-bold tracking-[0.35em] text-gold">عضو من الفريق</p>
            <h1 className="gold-text text-4xl font-black md:text-6xl">{member.name}</h1>

            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 text-sm text-gold">
              <Briefcase size={16} />
              {member.role}
            </p>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
              {member.fullBio || member.shortBio}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-gold/15 bg-black/25 p-4">
                <p className="text-sm text-gray-400">الأعمال</p>
                <p className="mt-2 text-3xl font-black text-gold">{stats.works}</p>
              </div>
              <div className="rounded-[1.5rem] border border-gold/15 bg-black/25 p-4">
                <p className="text-sm text-gray-400">الصور</p>
                <p className="mt-2 text-3xl font-black text-gold">{stats.images}</p>
              </div>
              <div className="rounded-[1.5rem] border border-gold/15 bg-black/25 p-4">
                <p className="text-sm text-gray-400">الفيديوهات</p>
                <p className="mt-2 text-3xl font-black text-gold">{stats.videos}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              {member.socialLinks?.whatsapp ? (
                <a
                  className="btn btn-gold"
                  href={`https://wa.me/${member.socialLinks.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="mr-2" size={18} />
                  واتساب
                </a>
              ) : null}

              <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 px-4 py-2 text-sm text-gray-300">
                <FolderOpen size={16} className="text-gold" />
                تصفح أعمال العضو
              </span>
            </div>
          </motion.div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="text-right">
              <p className="text-sm font-bold tracking-[0.35em] text-gold">الأعمال</p>
              <h2 className="mt-2 text-3xl font-black">أعمال هذا العضو</h2>
            </div>
            <p className="max-w-2xl text-right text-sm leading-7 text-gray-400">
              كل عمل يظهر هنا في شكل كارت مستقل. عند الضغط على أي كارت ستفتح صفحة مخصصة للعمل تعرض صوره
              وفيديوهاته وتفاصيله بشكل أوضح ومرتب.
            </p>
          </div>

          {member.works?.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {member.works.map((work, index) => (
                <WorkCard key={work._id} memberId={member._id} work={work} index={index} />
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
