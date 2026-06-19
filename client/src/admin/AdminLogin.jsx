import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function AdminLogin() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    email: 'admin@elalmani.com',
    password: 'admin123',
  });
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('adminToken', data.token);
      toast.success('تم تسجيل الدخول بنجاح');
      nav('/admin');
    } catch (e) {
      const message =
        e.response?.data?.message ||
        (e.request ? 'تعذر الاتصال بالخادم. أعد تشغيل الواجهة والخادم.' : 'فشل تسجيل الدخول');

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#30220a,#050505_55%)] px-4 py-16">
      <form
        onSubmit={submit}
        className="mx-auto mt-20 max-w-md rounded-3xl border border-gold/20 bg-black/80 p-8 shadow-gold"
      >
        <img src="/logo.png" className="mx-auto h-24 w-24 rounded-full object-cover" />
        <h1 className="gold-text mt-5 text-center text-3xl font-black">دخول الإدارة</h1>
        <div className="mt-8 space-y-4">
          <input
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="البريد الإلكتروني"
          />
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="كلمة المرور"
          />
          <button className="btn btn-gold w-full" disabled={loading}>
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </div>
      </form>
    </section>
  );
}
