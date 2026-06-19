import { useEffect, useMemo, useState } from 'react';
import { Edit, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const emptyWorkForm = {
  title: '',
  description: '',
  serviceType: '',
  files: [],
};

function Field(props) {
  return <input className="input" {...props} />;
}

function PreviewGrid({ files, onRemove }) {
  const previews = useMemo(
    () =>
      files.map((file) => ({
        name: file.name,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: URL.createObjectURL(file),
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  if (!previews.length) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {previews.map((preview, index) => (
        <div key={`${preview.name}-${index}`} className="relative overflow-hidden rounded-2xl border border-gold/20">
          {preview.type === 'video' ? (
            <video src={preview.url} className="h-40 w-full bg-black object-cover" muted />
          ) : (
            <img src={preview.url} alt={preview.name} className="h-40 w-full object-cover" />
          )}
          <button
            type="button"
            className="absolute right-2 top-2 rounded-full bg-black/80 p-2 text-white"
            onClick={() => onRemove(index)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function TeamWorksManager({ initialMemberId }) {
  const [team, setTeam] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(initialMemberId || '');
  const [selectedMember, setSelectedMember] = useState(null);
  const [workForm, setWorkForm] = useState(emptyWorkForm);
  const [editingWorkId, setEditingWorkId] = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [savingWork, setSavingWork] = useState(false);

  async function loadTeam() {
    setLoadingTeam(true);

    try {
      const response = await api.get('/team');
      setTeam(response.data);
    } catch (error) {
      toast.error('Failed to load team');
    } finally {
      setLoadingTeam(false);
    }
  }

  async function loadServices() {
    try {
      const response = await api.get('/services');
      setServices(response.data || []);
    } catch (error) {
      setServices([]);
      toast.error('Failed to load services');
    }
  }

  async function loadSelectedMember(memberId) {
    if (!memberId) {
      setSelectedMember(null);
      return;
    }

    try {
      const response = await api.get(`/team/${memberId}`);
      setSelectedMember(response.data);
    } catch (error) {
      setSelectedMember(null);
      toast.error('Failed to load member details');
    }
  }

  useEffect(() => {
    loadTeam();
    loadServices();
  }, []);

  useEffect(() => {
    setSelectedMemberId(initialMemberId || '');
  }, [initialMemberId]);

  useEffect(() => {
    loadSelectedMember(selectedMemberId);
  }, [selectedMemberId]);

  function resetWorkForm() {
    setEditingWorkId(null);
    setWorkForm(emptyWorkForm);
  }

  function fillWorkForm(work) {
    setEditingWorkId(work._id);
    setWorkForm({
      title: work.title || '',
      description: work.description || '',
      serviceType: work.serviceType || '',
      files: [],
    });
  }

  function removePreviewFile(index) {
    setWorkForm((current) => ({
      ...current,
      files: current.files.filter((_, fileIndex) => fileIndex !== index),
    }));
  }

  async function refreshData(memberId = selectedMemberId) {
    await loadTeam();
    await loadSelectedMember(memberId);
  }

  async function saveWork(event) {
    event.preventDefault();

    if (!selectedMemberId) {
      toast.error('Choose a team member first');
      return;
    }

    setSavingWork(true);

    try {
      const formData = new FormData();
      formData.append('title', workForm.title);
      formData.append('description', workForm.description);
      formData.append('serviceType', workForm.serviceType);
      workForm.files.forEach((file) => formData.append('work', file));

      if (editingWorkId) {
        await api.put(`/team/${selectedMemberId}/works/${editingWorkId}`, formData);
        toast.success('Work updated');
      } else {
        await api.post(`/team/${selectedMemberId}/works`, formData);
        toast.success('Work added');
      }

      resetWorkForm();
      await refreshData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save work');
    } finally {
      setSavingWork(false);
    }
  }

  async function removeWork(workId) {
    if (!selectedMemberId || !confirm('Delete this work and all related media?')) {
      return;
    }

    try {
      await api.delete(`/team/${selectedMemberId}/works/${workId}`);
      toast.success('Work deleted');
      await refreshData();
      resetWorkForm();
    } catch (error) {
      toast.error('Failed to delete work');
    }
  }

  async function removeMedia(workId, mediaId) {
    if (!selectedMemberId || !confirm('Delete this single media item?')) {
      return;
    }

    try {
      await api.delete(`/team/${selectedMemberId}/works/${workId}/media/${mediaId}`);
      toast.success('Media deleted');
      await refreshData();
    } catch (error) {
      toast.error('Failed to delete media');
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={saveWork} className="admin-card space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{editingWorkId ? 'Edit Work' : 'Add Work'}</h2>
          {editingWorkId ? (
            <button type="button" className="text-sm text-gold" onClick={resetWorkForm}>
              Cancel
            </button>
          ) : null}
        </div>

        <p className="text-sm text-gray-400">Choose the team member, then add images and videos for this work.</p>

        <select
          className="input"
          value={selectedMemberId}
          onChange={(event) => setSelectedMemberId(event.target.value)}
          disabled={loadingTeam}
        >
          <option value="">Select team member</option>
          {team.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name} - {member.role}
            </option>
          ))}
        </select>

        <Field
          placeholder="Work title"
          value={workForm.title}
          onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
          required
        />
        <textarea
          className="input min-h-24"
          placeholder="Work description"
          value={workForm.description}
          onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
        />
        <select
          className="input"
          value={workForm.serviceType}
          onChange={(e) => setWorkForm({ ...workForm, serviceType: e.target.value })}
        >
          <option value="">Select service type</option>
          {services.map((service) => (
            <option key={service._id} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
        <input
          className="input"
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => setWorkForm({ ...workForm, files: Array.from(e.target.files || []) })}
        />

        <PreviewGrid files={workForm.files} onRemove={removePreviewFile} />

        <button className="btn btn-gold w-full" disabled={savingWork || !selectedMemberId}>
          <Plus className="mr-2" size={18} />
          {savingWork ? 'Uploading work...' : editingWorkId ? 'Update Work' : 'Add Work'}
        </button>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Member Works</h2>
          <span className="text-sm text-gray-400">{selectedMember?.works?.length || 0} works</span>
        </div>

        {selectedMember ? (
          <div className="space-y-4">
            <div className="admin-card flex flex-wrap items-center gap-4">
              <img
                src={selectedMember.avatar || '/logo.png'}
                alt={selectedMember.name}
                className="h-24 w-24 rounded-2xl object-cover"
              />
              <div>
                <h3 className="text-2xl font-bold">{selectedMember.name}</h3>
                <p className="mt-2 text-gold">{selectedMember.role}</p>
                <p className="mt-2 text-sm text-gray-400">{selectedMember.shortBio}</p>
              </div>
            </div>

            <div className="space-y-5">
              {selectedMember.works?.map((work) => (
                <article key={work._id} className="admin-card space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">{work.title}</h3>
                      <p className="mt-2 text-sm text-gray-400">{work.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-gold/10 px-3 py-1 text-xs text-gold">
                        {work.serviceType || 'General'}
                      </span>
                      <button
                        type="button"
                        className="btn border border-gold/30 text-gold"
                        onClick={() => fillWorkForm(work)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn border border-red-500/40 text-red-300"
                        onClick={() => removeWork(work._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {work.media?.map((mediaItem) => (
                      <div key={mediaItem._id} className="overflow-hidden rounded-2xl border border-gold/20">
                        {mediaItem.type === 'video' ? (
                          <video
                            src={mediaItem.url}
                            className="h-52 w-full bg-black object-cover"
                            controls
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={mediaItem.url}
                            alt={mediaItem.title || work.title}
                            className="h-52 w-full object-cover"
                            loading="lazy"
                          />
                        )}

                        <div className="space-y-3 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full border border-gold/20 px-3 py-1 text-xs text-gray-300">
                              {mediaItem.type}
                            </span>
                            <button
                              type="button"
                              className="text-sm text-red-300"
                              onClick={() => removeMedia(work._id, mediaItem._id)}
                            >
                              Delete media
                            </button>
                          </div>
                          <p className="text-sm text-gray-400">{mediaItem.description || 'Team media item'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-card text-center text-gray-400">
            Select a team member to manage works and media from the gallery section.
          </div>
        )}
      </div>
    </section>
  );
}
