import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import SectionTitle from '../components/SectionTitle';
import OptimizedImage from '../components/OptimizedImage';

const fallback = [
  'قصات شعر عصرية',
  'تهذيب اللحية',
  'عناية متكاملة',
  'تدرجات حديثة',
  'عناية بالشعر',
  'تصوير الأعمال',
];

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api
      .get('/services')
      .then((response) => setServices(response.data))
      .catch(() => setServices([]));
  }, []);

  const data = services.length
    ? services
    : fallback.map((title, index) => ({
        _id: index,
        title,
        description: 'خدمة احترافية تُنفذ بعناية وتُظهر النتيجة النهائية بشكل أنيق وواضح.',
        coverImage: '/logo.png',
      }));

  return (
    <section className="section">
      <div className="container-x px-4">
        <SectionTitle
          eyebrow="الخدمات"
          title="خدمات EL ALMANY SALON"
          desc="اسحب يمينًا ويسارًا لاكتشاف الخدمات، ثم افتح كل خدمة لمشاهدة أعمال الفريق الخاصة بها."
        />

        <div className="scroll-shell">
          <div className="scroll-row">
            {data.map((service, index) => (
              <motion.article
                key={service._id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="group overflow-hidden rounded-[2rem] border border-gold/20 bg-black/35"
              >
                <Link to={`/services/${service._id}`} className="block">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                    <OptimizedImage
                      src={service.coverImage || '/logo.png'}
                      alt={service.title}
                      className="h-80 w-full"
                      imgClassName="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 340px"
                    />
                  </div>

                  <div className="space-y-4 p-6">
                    <h3 className="text-2xl font-black">{service.title}</h3>
                    <p className="leading-7 text-gray-400">{service.description}</p>
                    <span className="inline-flex items-center text-gold">
                      عرض أعمال الخدمة
                      <ArrowRight className="ml-2" size={18} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
