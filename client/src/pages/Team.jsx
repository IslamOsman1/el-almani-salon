import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import SectionTitle from '../components/SectionTitle';

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/team')
      .then((response) => setTeam(response.data))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false));
  }, []);

  const fallback = [
    {
      _id: 'demo-1',
      name: 'Ahmed El Almani',
      role: 'خبير حلاقة رجالية',
      shortBio: 'متخصص في التدرجات الدقيقة وتهذيب اللحية وإبراز الستايل المناسب لكل عميل.',
      avatar: '/logo.png',
      works: [],
    },
    {
      _id: 'demo-2',
      name: 'Omar Salah',
      role: 'مصفف شعر',
      shortBio: 'يركز على القصات الحديثة واللمسات النهائية التي تعطي مظهرًا أنيقًا وواضحًا.',
      avatar: '/logo.png',
      works: [],
    },
  ];

  const members = team.length ? team : fallback;

  return (
    <section className="section">
      <div className="container-x px-4">
        <SectionTitle
          eyebrow="الفريق"
          title="فريق العمل"
          desc="تعرّف على أعضاء الفريق، اختصاص كل شخص، والأعمال التي يقدمها داخل الصالون."
        />

        {loading ? (
          <p className="py-16 text-center text-gold">جاري تحميل الفريق...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member, index) => (
              <motion.article
                key={member._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group overflow-hidden rounded-[2rem] border border-gold/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-gold"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                  <img src={member.avatar || '/logo.png'} alt={member.name} className="h-80 w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>

                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">{member.name}</h3>
                      <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-sm text-gold">
                        <Briefcase size={16} />
                        {member.role}
                      </p>
                    </div>
                    <span className="rounded-full border border-gold/20 px-3 py-1 text-xs text-gray-300">
                      {member.works?.length || 0} أعمال
                    </span>
                  </div>

                  <p className="min-h-16 leading-7 text-gray-300">{member.shortBio}</p>

                  <div className="flex flex-wrap gap-3">
                    <Link className="btn btn-gold" to={`/team/${member._id}`}>
                      عرض الأعمال
                      <ArrowRight className="ml-2" size={18} />
                    </Link>

                    {member.socialLinks?.whatsapp ? (
                      <a className="btn border border-gold/30 text-gold" href={`https://wa.me/${member.socialLinks.whatsapp}`} target="_blank" rel="noreferrer">
                        <MessageCircle className="mr-2" size={18} />
                        واتساب
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
