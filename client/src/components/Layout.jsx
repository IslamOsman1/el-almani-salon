import { MapPin, Menu, Scissors } from 'lucide-react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const links = [
  { label: 'الرئيسية', to: '/' },
  { label: 'من نحن', to: '/about' },
  { label: 'الخدمات', to: '/services' },
  { label: 'المعرض', to: '/gallery' },
  { label: 'الفريق', to: '/team' },
  { label: 'اتصل بنا', to: '/contact' },
];

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

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    phone: '',
    whatsapp: '',
    addresses: [],
    facebook: '#',
    instagram: '#',
    tiktok: '#',
  });

  useEffect(() => {
    api.get('/settings').then((response) => setSettings((prev) => ({ ...prev, ...response.data }))).catch(() => {});
  }, []);

  const footerAddresses = settings.addresses?.length
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
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gold/20 bg-black/80 backdrop-blur">
        <div className="container-x flex h-20 items-center justify-between px-4">
          <div className="flex items-center">
            <button className="md:hidden" onClick={() => setOpen((value) => !value)}>
              <Menu />
            </button>

            <div className="hidden gap-7 md:flex">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `brand-serif text-base tracking-[0.08em] ${isActive ? 'text-gold' : 'text-gray-300 hover:text-white'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <Link to="/" className="flex flex-row-reverse items-center gap-3">
            <img src="/logo.png" className="h-12 w-12 rounded-full object-cover" />
            <div className="text-right">
              <b className="brand-serif gold-text text-2xl tracking-[0.14em]">EL ALMANI</b>
              <p className="brand-serif text-xs tracking-[0.18em] text-gray-400">صالون حلاقة رجالي</p>
            </div>
          </Link>
        </div>

        {open ? (
          <div className="border-t border-gold/10 bg-black p-4 text-right md:hidden">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="brand-serif block py-3 text-base tracking-[0.08em]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
      </nav>

      <main className="pt-20">
        <Outlet />
      </main>

      <footer className="border-t border-gold/20 bg-black py-10">
        <div className="container-x grid gap-8 px-4 md:grid-cols-[1.2fr_.95fr_.95fr] md:items-start">
          <div className="text-right">
            <Scissors className="mb-3 mr-auto text-gold md:mr-0" />
            <h3 className="gold-text text-2xl font-bold tracking-widest">EL ALMANI SALON</h3>
            <p className="mt-3 leading-7 text-gray-400">
              خدمات حلاقة وعناية رجالية، معرض أعمال حقيقي، وفريق محترف يقدم تجربة مرتبة وعصرية.
            </p>
          </div>

          <div className="text-right">
            <h4 className="mb-4 text-lg font-bold text-gold">روابط التواصل</h4>
            <div className="flex flex-wrap justify-end gap-3">
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

          <div className="text-right">
            <h4 className="mb-4 text-lg font-bold text-gold">العناوين</h4>
            <div className="flex flex-wrap justify-end gap-3">
              {footerAddresses.map((item, index) => (
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
            {settings.phone ? <p className="mt-4 text-sm text-gray-400">{settings.phone}</p> : null}
          </div>
        </div>
      </footer>
    </>
  );
}
