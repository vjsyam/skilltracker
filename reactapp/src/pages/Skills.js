import React, { useEffect, useState, useMemo } from "react";
import "../styles/pages.css";
import "../styles/components.css";
import { getSkills, deleteSkill } from "../services/skillService";
import SkillForm from "./SkillForm";
import { AdminOnly } from "../components/RoleBasedAccess";
import { authService } from "../services/authService";
import { FaEdit, FaTrash, FaPlus, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import FloatingParticles from "../components/FloatingParticles";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ sortBy: "id", sortDir: "asc" });

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await getSkills(0, 1000);
      let skillData = [];
      if (response && response.content) skillData = response.content; else if (response && response.data) skillData = response.data; else if (Array.isArray(response)) skillData = response; else skillData = [];
      setSkills(skillData);
      setError(null);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setError("Failed to load skills");
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(s => `${s.name} ${s.description || ""}`.toLowerCase().includes(q) || String(s.id).includes(q));
  }, [skills, search]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    const { sortBy, sortDir } = sorting;
    list.sort((a, b) => {
      const av = a?.[sortBy] ?? "";
      const bv = b?.[sortBy] ?? "";
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [filtered, sorting]);

  const handleSort = (column) => {
    const newDir = sorting.sortBy === column && sorting.sortDir === "asc" ? "desc" : "asc";
    setSorting({ sortBy: column, sortDir: newDir });
  };

  const getSortIcon = (column) => {
    if (sorting.sortBy !== column) return <FaSort />;
    return sorting.sortDir === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this skill?")) {
      try {
        await deleteSkill(id);
        fetchSkills();
      } catch (err) {
        console.error("Failed to delete skill:", err);
        setError("Failed to delete skill");
      }
    }
  };

  return (
    <div className="page glass">
      <FloatingParticles />
      <div className="page-header">
        <div>
          <h1 className="heading-gradient">Skill Tracking</h1>
          <p className="page-subtitle">Manage the organization skill catalog</p>
        </div>
        <AdminOnly>
          <button 
            className="glass-btn" 
            onClick={() => { setEditData(null); setShowForm(true); }}
          >
            <FaPlus /> Add Skill
          </button>
        </AdminOnly>
      </div>

      <div className="glass-form" style={{ marginTop: 8 }}>
        <input
          type="text"
          placeholder="Search skills by name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ flex: 1 }}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-indicator">Loading...</div>}

      <div className="alt-card hover-lift" style={{ marginTop: 12 }}>
        <div className="soft-divider" />
        <div className="table-wrap">
          <table className="glass-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")} className="sortable-header">ID {getSortIcon("id")}</th>
                <th onClick={() => handleSort("name")} className="sortable-header">Skill Name {getSortIcon("name")}</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted && sorted.length > 0 ? (
                sorted.map((skill) => (
                  <tr key={skill.id}>
                    <td>{skill.id}</td>
                    <td>{skill.name}</td>
                    <td className="description-cell">{skill.description || 'No description'}</td>
                    <td>
                      <AdminOnly>
                        <button 
                          className="glass-btn" 
                          onClick={() => { setEditData(skill); setShowForm(true); }}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button 
                          className="glass-btn delete" 
                          onClick={() => handleDelete(skill.id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </AdminOnly>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center">No skills found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <SkillForm
          existingData={editData}
          onClose={() => setShowForm(false)}
          onSave={fetchSkills}
          isViewOnly={!authService.isAdmin()}
        />
      )}
    </div>
  );
}