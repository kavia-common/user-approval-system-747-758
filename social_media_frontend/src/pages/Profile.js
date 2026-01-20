import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './pages.css';

/**
 * Profile management page.
 * Loads current user profile, shows form to update display name, bio, and website.
 */

// PUBLIC_INTERFACE
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let alive = true;
    api.getProfile()
      .then(res => { if (alive) setProfile(res); })
      .catch(e => { if (alive) setError(e.message || 'Failed to load profile'); })
      .finally(() => { if (alive) setPending(false); });
    return () => { alive = false; };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...(p || {}), [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const payload = {
        display_name: profile?.display_name || '',
        bio: profile?.bio || '',
        website: profile?.website || '',
      };
      const updated = await api.updateProfile(payload);
      setProfile(updated);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (pending) return <div className="page"><div className="loading">Loading profile…</div></div>;
  if (error) return <div className="page"><div className="error">{error}</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Profile</h1>
        <p className="subtitle">Manage your personal information</p>
      </div>
      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <form className="card form" onSubmit={onSubmit}>
        <div className="form-row">
          <label htmlFor="display_name">Display Name</label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            value={profile?.display_name || ''}
            onChange={onChange}
            placeholder="Your display name"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            value={profile?.bio || ''}
            onChange={onChange}
            placeholder="Tell others about you"
          />
        </div>
        <div className="form-row">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="url"
            value={profile?.website || ''}
            onChange={onChange}
            placeholder="https://example.com"
          />
        </div>
        <div className="actions">
          <button className="btn primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
