import React, { useState } from 'react';
import { createUser, createProfile } from '../services/api';

export default function Profile() {
  const [email, setEmail] = useState('demo@example.com');
  const [name, setName] = useState('Demo');
  const [bio, setBio] = useState('Hello there!');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [msg, setMsg] = useState('');

  const handleCreate = async () => {
    setMsg('');
    try {
      const u = await createUser({ email, name, password: 'password123' });
      setUser(u);
      const p = await createProfile({ user_id: u.id, bio });
      setProfile(p);
      setMsg('Created user and profile successfully.');
    } catch (e) {
      setMsg(String(e));
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Profile</h1>
      <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <label>Email <input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Name <input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>Bio <input value={bio} onChange={(e) => setBio(e.target.value)} /></label>
        <button className="btn" onClick={handleCreate}>Create User + Profile</button>
        {msg && <div>{msg}</div>}
        {user && <pre style={{ background: '#f3f4f6', padding: 8 }}>{JSON.stringify(user, null, 2)}</pre>}
        {profile && <pre style={{ background: '#f3f4f6', padding: 8 }}>{JSON.stringify(profile, null, 2)}</pre>}
      </div>
    </div>
  );
}
