import { MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import SectionTitle from '../components/SectionTitle';

function SocialIcon({ type }) {
  const common = 'h-4 w-4';

  if (type === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
        <path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l.9-4.2A8 8 0 1 1 20 12Z" />
        <path d="M8.9 9.1c.2-.5.5-.5.8-.5h.7c.2 0 .5 0 .7.5.2.5.7 1.7.8 1.8.1.2.1.4 0 .6l-.4.7c-.1.2-.2.4 0 .7.2.3.8 1.2 1.8 1.9 1.2.8 2.1 1 2.4 1.1.2.1.5 0 .7-.2l.8-.9c.2-.2.4-.3.7-.2l1.7.8c.3.1.5.3.5.6 0 .3-.1 1.7-1.1 2.4-.9.6-2 .6-2.2.5-.2 0-3.8-1.4-5.9-5-.5-.9-1-2-.9-2.8.1-.7.4-1 .6-1.2Z" />
      </svg>
    );
  }

  if (type === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common}>
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.2-1.5 1.5-1.5H16V5.1c-.2 0-.9-.1-1.9-.1-1.9 0-3.1 1.1-3.1 3.4V11H8v3h2.9v7h2.6Z" />
      </svg>
    );
  }

  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={common}>
      <path d="M16.3 3H13v12.9c0 1.3-1 2.3-2.3 2.3-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2c.2 0 .4 0 .5.1v-3.3a5.5 5.5 0 0 0-.6 0A5.5 5.5 0 1 0 16 16V9.4c1 .7 2.1 1.2 3.4 1.2V7.2c-1 0-2.2-.8-3.1-1.7-.7-.8-1-1.6-1-2.5Z" />
    </svg>
  );
}

const socialButtons = [
  { key: 'whatsapp', label: 'واتساب' },
  { key: 'facebook', label: 'فيسبوك' },
  { key: 'instagram', label: 'إنستجرام' },
  { key: 'tiktok', label: 'تيك توك' },
];

export default function Contact() {
  const [settings, setSettings] = useState({
    phone: '+20 100 000 0000',
    whatsapp: '201000000000',
    address: 'مصر',
    addresses: [],
    facebook: '#',
    instagram: '#',
    tiktok: '#',
  });

  useEffect(() => {
    api
      .get('/settings')
      .then((response) => {
        setSettings((prev) => ({ ...prev, ...response.data }));
      })
      .catch(() => {});
  }, []);

  const addressButtons = settings.addresses?.length
    ? settings.addresses
    : settings.address
      ? [{ label: settings.address, url: '#' }]
      : [];

  function getSocialHref(key) {
    if (key === 'whatsapp') {
      return settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : '#';
    }
    return settings[key] || '#';
  }

  return (
    <section className="section">
      <SectionTitle
        eyebrow="تواصل"
        title="تواصل معنا"
        desc="للحجز أو الاستفسار عن الخدمات ومواعيد العمل، يمكنك التواصل معنا مباشرة."
      />

      <div className="container-x grid gap-6 px-4 md:grid-cols-2">
        <div className="glass space-y-6 rounded-3xl p-8">
          <p className="flex gap-3">
            <Phone className="text-gold" />
            {settings.phone}
          </p>

          <div className="space-y-3">
            <p className="flex gap-3">
              <MapPin className="text-gold" />
              العناوين
            </p>
            <div className="flex flex-wrap gap-3">
              {addressButtons.map((item, index) => (
                <a
                  key={item._id || index}
                  className="btn border border-gold/30 text-gold"
                  href={item.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin className="mr-2" size={16} />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {socialButtons.map((item) => (
              <a
                key={item.key}
                className={`flex h-14 w-14 items-center justify-center rounded-full transition duration-200 hover:-translate-y-1 ${
                  item.key === 'whatsapp'
                    ? 'bg-gold text-black shadow-[0_0_24px_rgba(212,166,50,0.35)]'
                    : 'border border-gold/30 text-gold hover:border-gold hover:bg-gold/10'
                }`}
                href={getSocialHref(item.key)}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                title={item.label}
              >
                <SocialIcon type={item.key} />
              </a>
            ))}
          </div>
        </div>

        <form className="glass space-y-4 rounded-3xl p-8">
          <input className="input" placeholder="الاسم" />
          <input className="input" placeholder="رقم الهاتف" />
          <textarea className="input min-h-32" placeholder="اكتب رسالتك أو استفسارك" />
          <button type="button" className="btn btn-gold w-full">
            إرسال الرسالة
          </button>
        </form>
      </div>
    </section>
  );
}
