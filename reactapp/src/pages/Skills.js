import React, { useEffect, useState } from "react";
import "../styles/pages.css";
import "../styles/components.css";
import { getSkills, deleteSkill } from "../services/skillService";
import SkillForm from "./SkillForm";
import { AdminOnly, ViewOnly } from "../components/RoleBasedAccess";
import { authService } from "../services/authService";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await getSkills();
      // Handle different response structures
      let skillData = [];
      if (response && response.content) {
        skillData = response.content;
      } else if (response && response.data) {
        skillData = response.data;
      } else if (Array.isArray(response)) {
        skillData = response;
      } else {
        skillData = [];
      }
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

  useEffect(() => {
    fetchSkills();
  }, []);

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
      <div className="page-header">
        <h1 className="heading-gradient">Skill Tracking</h1>
        <AdminOnly>
          <button 
            className="glass-btn" 
            onClick={() => { setEditData(null); setShowForm(true); }}
          >
            <FaPlus /> Add Skill
          </button>
        </AdminOnly>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-indicator">Loading...</div>}

      <div className="table-wrap">
        <table className="glass-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Skill Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills && skills.length > 0 ? (
              skills.map((skill) => (
                <tr key={skill.id}>
                  <td>{skill.id}</td>
                  <td>{skill.name}</td>
                  <td className="description-cell">{skill.description || 'No description'}</td>
                  <td>
                    <ViewOnly>
                      <button 
                        className="glass-btn view" 
                        onClick={() => { setEditData(skill); setShowForm(true); }}
                      >
                        <FaEye /> View
                      </button>
                    </ViewOnly>
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