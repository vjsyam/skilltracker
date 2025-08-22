import React, { useState, useEffect, useMemo } from "react";
import "../styles/components.css";
import { createEmployee, updateEmployee } from "../services/employeeService";
import { getUsers } from "../services/userService";
import { getDepartments } from "../services/departmentService";
import { getSkills } from "../services/skillService";
import { FaUser, FaBuilding, FaTools, FaUserTie, FaSave, FaTimes } from "react-icons/fa";

export default function EmployeeForm({ onSuccess, editingEmployee, setEditingEmployee, isViewOnly = false }) {
  const [formData, setFormData] = useState({
    user: { id: "" },
    manager: { id: "" },
    department: { id: "" },
    skills: []
  });

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [skills, setSkillsList] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [managerSearch, setManagerSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [u, d, s] = await Promise.all([
          getUsers().catch(() => []),
          getDepartments().catch(() => []),
          getSkills().catch(() => [])
        ]);
        const uList = u?.data || u?.content || u || [];
        const dList = d?.data || d?.content || d || [];
        const sList = s?.data || s?.content || s || [];
        setUsers(Array.isArray(uList) ? uList : []);
        setDepartments(Array.isArray(dList) ? dList : []);
        setSkillsList(Array.isArray(sList) ? sList : []);
      } catch (e) {
        // non-fatal for UI
      }
    })();
  }, []);

  useEffect(() => {
    if (editingEmployee && editingEmployee.id) {
      setFormData({
        user: { id: editingEmployee.userId || "" },
        manager: { id: editingEmployee.managerId || "" },
        department: { id: editingEmployee.departmentId || "" },
        skills: editingEmployee.skillIds?.map(id => ({ id })) || []
      });
    } else {
      setFormData({ user: { id: "" }, manager: { id: "" }, department: { id: "" }, skills: [] });
    }
  }, [editingEmployee]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    const list = users;
    if (!q) return list;
    return list.filter(u => `${u.name} ${u.email}`.toLowerCase().includes(q));
  }, [users, userSearch]);

  const filteredManagers = useMemo(() => {
    const q = managerSearch.trim().toLowerCase();
    // Only ADMIN users (case-insensitive) should be selectable as managers
    const list = users.filter(u => (String(u.role || "").toUpperCase() === "ADMIN"));
    if (!q) return list;
    return list.filter(u => `${u.name} ${u.email}`.toLowerCase().includes(q));
  }, [users, managerSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user.id || !formData.department.id) {
      alert("User and Department are required!");
      return;
    }
    const cleanData = {
      user: { id: parseInt(formData.user.id) },
      department: { id: parseInt(formData.department.id) },
      skills: formData.skills.filter(s => s.id > 0)
    };
    if (formData.manager.id && formData.manager.id > 0) {
      cleanData.manager = { id: parseInt(formData.manager.id) };
    }
    try {
      if (editingEmployee && editingEmployee.id) {
        await updateEmployee(editingEmployee.id, cleanData);
      } else {
        await createEmployee(cleanData);
      }
      onSuccess();
      setEditingEmployee(null);
    } catch (err) {
      console.error("Error saving employee:", err);
      alert(err?.message || "Failed to save employee");
    }
  };

  const toggleSkill = (skillId) => {
    setFormData(prev => {
      const exists = prev.skills.some(s => s.id === skillId);
      return {
        ...prev,
        skills: exists ? prev.skills.filter(s => s.id !== skillId) : [...prev.skills, { id: skillId }]
      };
    });
  };

  return (
    <div className="modal-overlay fixed-overlay">
      <div className="modal glass centered-modal employee-form-modal form-modal">
        <div className="modal-header">
          <div>
            <h2 className="heading-gradient">
              <FaUser /> {isViewOnly ? "View Employee" : editingEmployee && editingEmployee.id ? "Edit Employee" : "Add Employee"}
            </h2>
            <div className="form-header-badge">Need an account? <a href="/users" className="link-inline">View users</a></div>
            <p className="section-subtitle-soft">Link an existing user, assign department and optional manager/skills</p>
          </div>
          <button className="close-btn" onClick={() => setEditingEmployee(null)} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body form-modern">
          <div className="form-group">
            <label className="icon-title"><FaUser /> User *</label>
            <div className="glass-form" style={{ margin: 0 }}>
              <span className="form-input" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                <input type="text" className="form-input" placeholder="Search users" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} disabled={isViewOnly} />
              </span>
              <select className="themed-select" value={formData.user.id || ""} onChange={(e) => setFormData({ ...formData, user: { id: parseInt(e.target.value) || "" } })} disabled={isViewOnly}>
                <option value="">Select user...</option>
                {filteredUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="icon-title"><FaUserTie /> Manager (Admins only)</label>
            <div className="glass-form" style={{ margin: 0 }}>
              <span className="form-input" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                <input type="text" className="form-input" placeholder="Search managers" value={managerSearch} onChange={(e) => setManagerSearch(e.target.value)} disabled={isViewOnly} />
              </span>
              <select className="themed-select" value={formData.manager.id || ""} onChange={(e) => setFormData({ ...formData, manager: { id: parseInt(e.target.value) || "" } })} disabled={isViewOnly}>
                <option value="">No manager</option>
                {filteredManagers.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="soft-divider" />

          <div className="form-group">
            <label className="icon-title"><FaBuilding /> Department *</label>
            <select className="themed-select" value={formData.department.id || ""} onChange={(e) => setFormData({ ...formData, department: { id: parseInt(e.target.value) || "" } })} disabled={isViewOnly} required>
              <option value="">Select department...</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="icon-title"><FaTools /> Skills (Optional)</label>
            <div className="subtle-bg" style={{ maxHeight: 200, overflowY: 'auto' }}>
              {skills.map(s => {
                const active = formData.skills.some(x => x.id === s.id);
                return (
                  <span key={s.id} className={`chip-toggle ${active ? 'active' : ''}`} onClick={() => toggleSkill(s.id)}>
                    {s.name}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setEditingEmployee(null)}>
              <FaTimes /> {isViewOnly ? "Close" : "Cancel"}
            </button>
            {!isViewOnly && (
              <button type="submit" className="glass-btn primary">
                <FaSave /> {editingEmployee && editingEmployee.id ? "Update" : "Save"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}