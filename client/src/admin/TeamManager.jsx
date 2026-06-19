import { useEffect, useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const emptyMemberForm = {
  name: '',
  role: '',
  shortBio: '',
  fullBio: '',
  facebook: '',
  instagram: '',
  whatsapp: '',
  avatar: null,
};

function Field(props) {
  return <input className="input" {...props} />;
}

export default function TeamManager({ selectedMemberId }) {
  const navigate = useNavigate();
  const [team, setTeam] = useState([]);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [savingMember, setSavingMember] = useState(false);

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

  useEffect(() => {
    loadTeam();
  }, []);

  function resetMemberForm() {
    setEditingMemberId(null);
    setMemberForm(emptyMemberForm);
  }

  function fillMemberForm(member) {
    setEditingMemberId(member._id);
    setMemberForm({
      name: member.name || '',
      role: member.role || '',
      shortBio: member.shortBio || '',
      fullBio: member.fullBio || '',
      facebook: member.socialLinks?.facebook || '',
      instagram: member.socialLinks?.instagram || '',
      whatsapp: member.socialLinks?.whatsapp || '',
      avatar: null,
    });
  }

  async function saveMember(event) {
    event.preventDefault();
    setSavingMember(true);

    try {
      const formData = new FormData();
      Object.entries(memberForm).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      let response;
      if (editingMemberId) {
        response = await api.put(`/team/${editingMemberId}`, formData);
        toast.success('Team member updated');
      } else {
        response = await api.post('/team', formData);
        toast.success('Team member added');
      }

      resetMemberForm();
      await loadTeam();
      navigate(`/admin/team/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save member');
    } finally {
      setSavingMember(false);
    }
  }

  async function removeMember(memberId) {
    if (!confirm('Delete this team member and all media?')) {
      return;
    }

    try {
      await api.delete(`/team/${memberId}`);
      toast.success('Team member deleted');
      await loadTeam();
      resetMemberForm();
      if (selectedMemberId === memberId) {
        navigate('/admin/team');
      }
    } catch (error) {
      toast.error('Failed to delete member');
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={saveMember} className="admin-card space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{editingMemberId ? 'Edit Member' : 'Add Member'}</h2>
          {editingMemberId ? (
            <button type="button" className="text-sm text-gold" onClick={resetMemberForm}>
              Cancel
            </button>
          ) : null}
        </div>

        <Field
          placeholder="Name"
          value={memberForm.name}
          onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
          required
        />
        <Field
          placeholder="Role / Specialty"
          value={memberForm.role}
          onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
          required
        />
        <textarea
          className="input min-h-24"
          placeholder="Short bio"
          value={memberForm.shortBio}
          onChange={(e) => setMemberForm({ ...memberForm, shortBio: e.target.value })}
        />
        <textarea
          className="input min-h-32"
          placeholder="Full bio"
          value={memberForm.fullBio}
          onChange={(e) => setMemberForm({ ...memberForm, fullBio: e.target.value })}
        />
        <Field
          placeholder="Facebook link"
          value={memberForm.facebook}
          onChange={(e) => setMemberForm({ ...memberForm, facebook: e.target.value })}
        />
        <Field
          placeholder="Instagram link"
          value={memberForm.instagram}
          onChange={(e) => setMemberForm({ ...memberForm, instagram: e.target.value })}
        />
        <Field
          placeholder="WhatsApp number"
          value={memberForm.whatsapp}
          onChange={(e) => setMemberForm({ ...memberForm, whatsapp: e.target.value })}
        />
        <input
          className="input"
          type="file"
          accept="image/*"
          onChange={(e) => setMemberForm({ ...memberForm, avatar: e.target.files?.[0] || null })}
        />

        <button className="btn btn-gold w-full" disabled={savingMember}>
          <Plus className="mr-2" size={18} />
          {savingMember ? 'Saving member...' : editingMemberId ? 'Update Member' : 'Add Member'}
        </button>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Team Members</h2>
          <span className="text-sm text-gray-400">{team.length} members</span>
        </div>

        {loadingTeam ? (
          <div className="admin-card text-center text-gold">Loading team...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {team.map((member) => (
              <article
                key={member._id}
                className={`admin-card border ${
                  selectedMemberId === member._id ? 'border-gold/40' : 'border-transparent'
                }`}
              >
                <img
                  src={member.avatar || '/logo.png'}
                  alt={member.name}
                  className="h-52 w-full rounded-2xl object-cover"
                />
                <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
                <p className="mt-2 text-gold">{member.role}</p>
                <p className="mt-3 text-sm leading-6 text-gray-400">{member.shortBio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-gold"
                    onClick={() => navigate('/admin')}
                  >
                    Open Gallery Tools
                  </button>
                  <button
                    type="button"
                    className="btn border border-gold/30 text-gold"
                    onClick={() => fillMemberForm(member)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn border border-red-500/40 text-red-300"
                    onClick={() => removeMember(member._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
