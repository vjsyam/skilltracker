import React, { useEffect, useState, useMemo } from "react";
import "../styles/components.css";
import { getUsers, updateUser, deleteUser } from "../services/userService";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getUsers();
        const list = res?.data || res?.content || res || [];
        setUsers(Array.isArray(list) ? list : []);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to load users");
      } finally { setLoading(false); }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q));
  }, [users, search]);

  function startEdit(u) {
    setEditing(u);
    setForm({ name: u.name || "", email: u.email || "", role: u.role || "" });
  }
  function closeEdit() { setEditing(null); }

  async function saveEdit() {
    try {
      const updated = await updateUser(editing.id, { ...editing, ...form });
      setUsers(prev => prev.map(x => x.id === editing.id ? { ...x, ...form } : x));
      setEditing(null);
    } catch (e) {
      alert("Failed to update user");
    }
  }

  async function doDelete(id) {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(x => x.id !== id));
      setConfirmDelete(null);
    } catch (e) {
      alert("Failed to delete user");
    }
  }

  if (loading) return <div className="page glass"><div className="loading-indicator">Loading...</div></div>;
  if (error) return <div className="page glass"><div className="error-message">{error}</div></div>;

  return (
    <div className="page glass">
      <div className="page-header">
        <div>
          <h1 className="heading-gradient">Users</h1>
          <p className="page-subtitle">Accounts available to link employees</p>
        </div>
      </div>

      <div className="glass-form" style={{ marginTop: 8 }}>
        <input className="form-input" placeholder="Search users by name/email/role" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="alt-card hover-lift" style={{ marginTop: 12 }}>
        <div className="soft-divider" />
        <div className="table-wrap">
          <table className="glass-table">
            <thead>
              <tr>
                <th>ID</th>
                <th><FaUser /> Name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button className="glass-btn" onClick={() => startEdit(u)} style={{ marginRight: 8 }} title="Edit"><FaEdit /></button>
                    <button className="glass-btn" onClick={() => setConfirmDelete(u)} title="Delete" style={{ background: '#d45a5a', color: 'white' }}><FaTrash /></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="text-center">No users</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="alt-card" style={{ maxWidth: 520, width: '92%', padding: 20 }}>
            <h3 className="icon-title">Edit User #{editing.id}</h3>
            <div className="glass-form">
              <input className="form-input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input className="form-input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <select className="themed-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="ADMIN">ADMIN</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button className="glass-btn" onClick={closeEdit}>Cancel</button>
              <button className="glass-btn" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="alt-card" style={{ maxWidth: 420, width: '92%', padding: 20, textAlign: 'center' }}>
            <h3>Delete User #{confirmDelete.id}?</h3>
            <p>This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
              <button className="glass-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="glass-btn" style={{ background: '#d45a5a', color: 'white' }} onClick={() => doDelete(confirmDelete.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
