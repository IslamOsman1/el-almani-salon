import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Crown,
  Images,
  MessageCircle,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import SectionTitle from '../components/SectionTitle';

const fallbackServices = [
  {
    _id: 'service-1',
    title: 'قصات شعر عصرية',
    description: 'تنفيذ نظيف يبرز الملامح ويمنحك مظهرًا مرتبًا وواثقًا.',
    coverImage: '/logo.png',
  },
  {
    _id: 'service-2',
    title: 'تهذيب اللحية',
    description: 'رسم دقيق للحواف وتناسق في الشكل بما يناسب الوجه.',
    coverImage: '/logo.png',
  },
  {
    _id: 'service-3',
    title: 'عناية متكاملة',
    description: 'تجربة مريحة تجمع بين النظافة والاهتمام بالمظهر النهائي.',
    coverImage: '/logo.png',
  },
];

const fallbackTeam = [
  {
    _id: 'member-1',
    name: 'Ahmed El Almani',
    role: 'خبير حلاقة رجالية',
    shortBio: 'متخصص في التدرجات الدقيقة وتهذيب اللحية وإبراز الستايل المناسب لكل عميل.',
    avatar: '/logo.png',
  },
  {
    _id: 'member-2',
    name: 'Omar Salah',
    role: 'مصفف شعر',
    shortBio: 'يركز على القصات الحديثة واللمسات النهائية التي تعطي مظهرًا أنيقًا وواضحًا.',
    avatar: '/logo.png',
  },
];

const heroFeatures = [
  { icon: Sparkles, label: 'إطلالة فاخرة' },
  { icon: Scissors, label: 'قصات دقيقة' },
  { icon: ShieldCheck, label: 'عناية ونظافة' },
  { icon: Crown, label: 'خدمة مميزة' },
];

const heroPillars = ['أناقة', 'دقة', 'راحة'];

export default function Home() {
  const [services, setServices] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    api.get('/services').then((response) => setServices(response.data)).catch(() => setServices([]));
    api.get('/team').then((response) => setTeam(response.data)).catch(() => setTeam([]));
  }, []);

  const serviceCards = services.length ? services : fallbackServices;
  const teamCards = team.length ? team : fallbackTeam;

  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(70,49,12,0.95),#050505_58%)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(214,168,58,0.08),transparent_28%,transparent)]" />
        <div className="container-x px-4 py-6 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-[linear-gradient(180deg,rgba(12,12,12,0.98),rgba(5,5,5,0.95))] shadow-[0_24px_60px_rgba(0,0,0,0.45)] md:rounded-[2.75rem]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,168,58,0.12),transparent_35%),radial-gradient(circle_at_85%_38%,rgba(214,168,58,0.12),transparent_28%)]" />
            <div className="absolute left-1/2 top-0 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative grid gap-6 p-4 sm:p-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:p-10">
              <div className="space-y-4 text-right md:order-1">
                <div className="px-2 py-2 md:hidden">
                  <div className="relative text-center">
                    <p className="brand-serif gold-text text-[1.55rem] tracking-[0.08em] sm:text-[1.9rem]">EL ALMANI SALON</p>
                    <p className="mt-1 text-[10px] tracking-[0.35em] text-gold/80 sm:text-xs sm:tracking-[0.45em]">BARBERSHOP</p>
                  </div>
                </div>

                <div className="hidden items-center justify-between md:flex">
                  <div className="rounded-full border border-gold/30 bg-black/45 px-6 py-3 text-sm tracking-[0.35em] text-gold">
                    صالون رجالي فاخر
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="brand-serif gold-text text-4xl tracking-[0.12em]">EL ALMANI SALON</p>
                      <p className="mt-1 text-sm tracking-[0.38em] text-gold/80">BARBERSHOP</p>
                    </div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-black/60 p-2 shadow-[0_0_38px_rgba(214,168,58,0.18)]">
                      <img src="/logo.png" alt="EL ALMANI SALON" className="h-full w-full rounded-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="relative space-y-3 overflow-hidden rounded-[1.6rem] px-3 py-4 pt-1 md:space-y-4 md:rounded-none md:px-0 md:py-0 md:pt-4">
                  <div
                    className="absolute inset-0 bg-center bg-no-repeat opacity-[0.12] md:hidden"
                    style={{ backgroundImage: "url('/logo.png')", backgroundSize: '320px' }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,168,58,0.08),transparent_58%)] md:hidden" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.3),rgba(5,5,5,0.72))] md:hidden" />
                  <div className="relative flex items-center justify-end gap-3 text-gold">
                    <span className="h-px w-14 bg-gold/70" />
                    <p className="text-xs font-bold tracking-[0.35em] sm:text-sm">ارتقِ بإطلالتك</p>
                  </div>

                  <div className="relative text-right">
                    <h1 className="font-display text-[2rem] font-black leading-[0.9] text-white sm:text-[3.2rem] md:text-7xl">
                      <span className="gold-text">تجربة</span>
                      <br />
                      <span className="gold-text">حلاقة</span>
                      <br />
                      <span>رجالية</span>
                      <br />
                      <span>استثنائية</span>
                    </h1>
                  </div>

                  <div className="relative flex justify-end">
                    <div className="h-[3px] w-40 rounded-full bg-gradient-to-l from-transparent via-gold to-transparent shadow-[0_0_14px_rgba(214,168,58,0.85)]" />
                  </div>

                </div>

                <div className="grid gap-2 pt-1 sm:grid-cols-2 sm:gap-3">
                  <a
                    className="flex items-center justify-between rounded-[1.1rem] border border-gold/45 bg-[linear-gradient(135deg,rgba(214,168,58,0.18),rgba(214,168,58,0.05))] px-4 py-3 text-sm text-gold shadow-[0_0_28px_rgba(214,168,58,0.16)] transition hover:-translate-y-1 sm:rounded-[1.4rem] sm:px-5 sm:py-4 sm:text-base"
                    href="https://wa.me/201000000000"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ArrowLeft size={20} />
                    <span className="font-bold">تواصل عبر واتساب</span>
                    <MessageCircle size={20} />
                  </a>

                  <Link
                    className="flex items-center justify-between rounded-[1.1rem] border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white transition hover:-translate-y-1 hover:border-gold/35 sm:rounded-[1.4rem] sm:px-5 sm:py-4 sm:text-base"
                    to="/gallery"
                  >
                    <ArrowLeft size={20} />
                    <span className="font-bold">شاهد الأعمال</span>
                    <Images size={20} className="text-gold" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-[1.3rem] border border-gold/15 bg-white/[0.03] p-2 sm:grid-cols-4 sm:rounded-[1.6rem] sm:p-3">
                  {heroFeatures.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="rounded-[0.95rem] border border-white/8 bg-black/25 px-2 py-3 text-center sm:rounded-[1.1rem] sm:px-3 sm:py-4"
                      >
                        <Icon className="mx-auto mb-2 text-gold" size={20} />
                        <p className="text-xs leading-5 text-gray-200 sm:text-sm sm:leading-6">{item.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="hidden rounded-[1.7rem] border border-gold/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 sm:p-5 md:block">
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/25 bg-black/35">
                      <ShieldCheck className="text-gold" />
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black tracking-[0.08em] text-gold">جودة. نظافة. ثقة.</p>
                      <p className="mt-2 text-sm leading-7 text-gray-300">
                        منتجات ممتازة، فريق محترف، واهتمام بالتفاصيل من أول لحظة حتى اللمسة الأخيرة.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative hidden md:order-2 md:block"
              >
                <div className="absolute inset-x-8 top-8 h-44 rounded-full bg-gold/20 blur-3xl" />
                <div className="relative overflow-hidden rounded-[1.9rem] border border-gold/20 bg-black/40">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <img
                    src="/logo.png"
                    alt="EL ALMANI SALON"
                    className="h-[380px] w-full object-cover sm:h-[460px] md:h-[640px]"
                  />
                </div>

                <div className="absolute bottom-4 left-4 right-4 rounded-[1.3rem] border border-gold/20 bg-black/70 p-4 backdrop-blur md:bottom-6 md:left-6 md:right-6">
                  <div className="grid grid-cols-3 gap-2">
                    {heroPillars.map((item) => (
                      <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-center">
                        <Star className="mx-auto mb-2 text-gold" size={16} />
                        <p className="text-sm font-semibold text-white">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <SectionTitle
          eyebrow="الخدمات"
          title="أبرز خدماتنا"
          desc="تصفح الخدمات بالسحب يمينًا ويسارًا، ثم افتح كل خدمة لمشاهدة الأعمال المرتبطة بها."
        />

        <div className="container-x px-4">
          <div className="scroll-shell">
            <div className="scroll-row">
              {serviceCards.map((service, index) => (
                <motion.article
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group overflow-hidden rounded-[1.5rem] border border-gold/20 bg-black/35 sm:rounded-[2rem]"
                >
                  <Link to={`/services/${service._id}`} className="block">
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                      <img
                        src={service.coverImage || '/logo.png'}
                        alt={service.title}
                        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-80"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-3 p-4 text-right sm:space-y-4 sm:p-6">
                      <h3 className="text-xl font-black sm:text-2xl">{service.title}</h3>
                      <p className="text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">{service.description}</p>
                      <span className="inline-flex items-center text-sm text-gold sm:text-base">
                        عرض تفاصيل الخدمة
                        <ArrowLeft className="mr-2" size={18} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[radial-gradient(circle_at_top,rgba(214,168,58,0.1),transparent_55%)]">
        <SectionTitle
          eyebrow="الفريق"
          title="تعرّف على الفريق"
          desc="فريق متخصص في الحلاقة الرجالية والستايلات الحديثة، ولكل عضو أعماله وتجربته الخاصة."
        />

        <div className="container-x px-4">
          <div className="scroll-shell">
            <div className="scroll-row">
              {teamCards.map((member, index) => (
                <motion.article
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group overflow-hidden rounded-[1.5rem] border border-gold/20 bg-black/35 sm:rounded-[2rem]"
                >
                  <Link to={`/team/${member._id}`} className="block">
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />
                      <img
                        src={member.avatar || '/logo.png'}
                        alt={member.name}
                        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-80"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-2 p-4 text-right sm:space-y-3 sm:p-6">
                      <h3 className="text-xl font-black sm:text-2xl">{member.name}</h3>
                      <p className="text-sm text-gold sm:text-base">{member.role}</p>
                      <p className="text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">{member.shortBio}</p>
                      <span className="inline-flex items-center text-sm text-gold sm:text-base">
                        مشاهدة الأعمال
                        <ArrowLeft className="mr-2" size={18} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
