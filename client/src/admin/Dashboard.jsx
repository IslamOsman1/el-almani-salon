import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, LogOut, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import TeamManager from './TeamManager';
import TeamWorksManager from './TeamWorksManager';

function Field(props) {
  return <input className="input" {...props} />;
}

const emptyGalleryForm = {
  title: '',
  description: '',
  serviceType: '',
  image: null,
};

const emptyServiceForm = {
  title: '',
  description: '',
  coverImage: null,
  coverImageUrl: '',
};

const emptyAddress = { label: '', url: '' };

export default function Dashboard({ initialTab = 'gallery' }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState(initialTab);
  const [gallery, setGallery] = useState([]);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState({});
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [galleryEditId, setGalleryEditId] = useState(null);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [loadingService, setLoadingService] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  async function loadDashboardData() {
    try {
      const [galleryResponse, servicesResponse, settingsResponse] = await Promise.all([
        api.get('/gallery'),
        api.get('/services'),
        api.get('/settings'),
      ]);

      setGallery(galleryResponse.data);
      setServices(servicesResponse.data);
      setSettings(settingsResponse.data || {});
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    return () => {
      if (serviceForm.coverImageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(serviceForm.coverImageUrl);
      }
    };
  }, [serviceForm.coverImageUrl]);

  function logout() {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  }

  function openTab(nextTab) {
    setTab(nextTab);

    if (nextTab === 'team') {
      navigate(id ? `/admin/team/${id}` : '/admin/team');
      return;
    }

    navigate('/admin');
  }

  async function saveGallery(event) {
    event.preventDefault();
    setLoadingGallery(true);

    try {
      const formData = new FormData();
      Object.entries(galleryForm).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      if (galleryEditId) {
        await api.put(`/gallery/${galleryEditId}`, formData);
        toast.success('Gallery item updated');
      } else {
        await api.post('/gallery', formData);
        toast.success('Gallery item added');
      }

      setGalleryForm(emptyGalleryForm);
      setGalleryEditId(null);
      await loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving gallery');
    } finally {
      setLoadingGallery(false);
    }
  }

  async function deleteGallery(idToDelete) {
    if (!confirm('Delete gallery item?')) {
      return;
    }

    try {
      await api.delete(`/gallery/${idToDelete}`);
      toast.success('Gallery item deleted');
      await loadDashboardData();
    } catch (error) {
      toast.error('Failed to delete gallery item');
    }
  }

  async function saveService(event) {
    event.preventDefault();
    setLoadingService(true);

    try {
      const formData = new FormData();
      formData.append('title', serviceForm.title);
      formData.append('description', serviceForm.description || '');
      if (serviceForm.coverImage) {
        formData.append('coverImage', serviceForm.coverImage);
      }

      if (serviceForm._id) {
        await api.put(`/services/${serviceForm._id}`, formData);
        toast.success('Service updated');
      } else {
        await api.post('/services', formData);
        toast.success('Service created');
      }

      setServiceForm(emptyServiceForm);
      await loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving service');
    } finally {
      setLoadingService(false);
    }
  }

  async function deleteService(idToDelete) {
    if (!confirm('Delete service?')) {
      return;
    }

    try {
      await api.delete(`/services/${idToDelete}`);
      toast.success('Service deleted');
      await loadDashboardData();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  }

  function handleServiceImageChange(file) {
    setServiceForm((current) => {
      if (current.coverImageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(current.coverImageUrl);
      }

      return {
        ...current,
        coverImage: file,
        coverImageUrl: file ? URL.createObjectURL(file) : current.coverImageUrl || '',
      };
    });
  }

  async function saveSettings(event) {
    event.preventDefault();
    setLoadingSettings(true);

    try {
      await api.put('/settings', settings);
      toast.success('Settings saved');
      await loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoadingSettings(false);
    }
  }

  function updateAddress(index, key, value) {
    setSettings((current) => ({
      ...current,
      addresses: (current.addresses || []).map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function addAddress() {
    setSettings((current) => ({
      ...current,
      addresses: [...(current.addresses || []), { ...emptyAddress }],
    }));
  }

  function removeAddress(index) {
    setSettings((current) => ({
      ...current,
      addresses: (current.addresses || []).filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-gold/20 bg-black/90 p-4 backdrop-blur">
        <div className="container-x flex flex-wrap items-center justify-between gap-3">
          <b className="gold-text text-2xl">EL ALMANY Dashboard</b>
          <button onClick={logout} className="btn border border-gold/40 text-gold">
            <LogOut className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      <main className="container-x px-4 py-8">
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {['gallery', 'services', 'team', 'settings'].map((item) => (
            <button
              key={item}
              onClick={() => openTab(item)}
              className={`btn ${tab === item ? 'btn-gold' : 'border border-gold/30 text-gold'}`}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === 'gallery' ? (
          <section className="space-y-5">
            <div className="admin-card">
              <h2 className="text-2xl font-bold">Gallery Feed</h2>
              <p className="mt-3 max-w-3xl text-gray-400">
                The public gallery is now generated automatically from Team works. Add or edit works here,
                then they will appear on the public gallery page automatically.
              </p>
            </div>

            <TeamWorksManager initialMemberId={id} />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {gallery.map((item) => {
                const cover = item.media?.[0];

                return (
                  <article className="admin-card" key={item._id}>
                    {cover?.type === 'video' ? (
                      <video src={cover.url} className="h-48 w-full rounded-xl bg-black object-cover" controls />
                    ) : (
                      <img
                        src={cover?.url || '/logo.png'}
                        className="h-48 w-full rounded-xl object-cover"
                        loading="lazy"
                      />
                    )}

                    <div className="mt-4 flex items-center gap-3">
                      <img
                        src={item.member?.avatar || '/logo.png'}
                        alt={item.member?.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.member?.name}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-gold/10 px-3 py-1 text-gold">
                        {item.serviceType || 'General'}
                      </span>
                      <span className="rounded-full border border-gold/20 px-3 py-1 text-gray-400">
                        {item.media?.length || 0} media
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {tab === 'services' ? (
          <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <form onSubmit={saveService} className="admin-card space-y-4">
              <h2 className="text-xl font-bold">Service</h2>
              <Field
                placeholder="Title"
                value={serviceForm.title}
                onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                required
              />
              <textarea
                className="input min-h-28"
                placeholder="Description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              />
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => handleServiceImageChange(e.target.files?.[0] || null)}
              />
              <div className="overflow-hidden rounded-2xl border border-gold/20 bg-black/30">
                <img
                  src={serviceForm.coverImageUrl || '/logo.png'}
                  alt={serviceForm.title || 'Service preview'}
                  className="h-44 w-full object-cover"
                />
              </div>
              <button className="btn btn-gold w-full" disabled={loadingService}>
                {loadingService ? 'Saving...' : 'Save Service'}
              </button>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <article className="admin-card" key={service._id}>
                  <img
                    src={service.coverImage || '/logo.png'}
                    alt={service.title}
                    className="h-52 w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                  <h3 className="mt-3 text-xl font-bold">{service.title}</h3>
                  <p className="mt-2 text-gray-400">{service.description}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="btn border border-gold/30 text-gold"
                      onClick={() =>
                        setServiceForm({
                          ...service,
                          coverImage: null,
                          coverImageUrl: service.coverImage || '',
                        })
                      }
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn border border-red-500/40 text-red-300"
                      onClick={() => deleteService(service._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {tab === 'team' ? <TeamManager selectedMemberId={id} /> : null}

        {tab === 'settings' ? (
          <form onSubmit={saveSettings} className="admin-card mx-auto max-w-2xl space-y-4">
            <h2 className="text-xl font-bold">إعدادات التواصل</h2>
            {['phone', 'whatsapp', 'facebook', 'instagram', 'tiktok'].map((key) => (
              <Field
                key={key}
                placeholder={key}
                value={settings[key] || ''}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              />
            ))}
            <div className="space-y-3 rounded-2xl border border-gold/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-gold">العناوين</h3>
                <button type="button" className="btn border border-gold/30 text-gold" onClick={addAddress}>
                  إضافة عنوان
                </button>
              </div>

              {(settings.addresses || []).map((item, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-gold/10 p-3 md:grid-cols-[1fr_1fr_auto]">
                  <Field
                    placeholder="اسم الفرع أو العنوان"
                    value={item.label || ''}
                    onChange={(e) => updateAddress(index, 'label', e.target.value)}
                  />
                  <Field
                    placeholder="رابط العنوان على الخريطة"
                    value={item.url || ''}
                    onChange={(e) => updateAddress(index, 'url', e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn border border-red-500/40 text-red-300"
                    onClick={() => removeAddress(index)}
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
            <button className="btn btn-gold w-full" disabled={loadingSettings}>
              {loadingSettings ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </button>
          </form>
        ) : null}
      </main>
    </div>
  );
}
