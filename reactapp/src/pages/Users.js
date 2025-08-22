import React, { useEffect, useState, useMemo } from "react";
import "../styles/components.css";
import { getUsers } from "../services/userService";
import { FaUser } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

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
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="text-center">No users</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
