import React, { useEffect, useState } from "react";
import "../styles/pages.css";
import "../styles/components.css";
import { getSkills, deleteSkill } from "../services/skillService";
import SkillForm from "./SkillForm";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchSkills = () => {
    getSkills()
      .then((res) => setSkills(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Delete this skill?")) {
      deleteSkill(id)
        .then(() => fetchSkills())
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="page glass">
      <h1>Skills</h1>
      <button className="glass-btn" onClick={() => { setEditData(null); setShowForm(true); }}>
        ➕ Add Skill
      </button>

      <table className="glass-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Skill Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.length > 0 ? (
            skills.map((skill) => (
              <tr key={skill.id}>
                <td>{skill.id}</td>
                <td>{skill.name}</td>
                <td>
                  <button className="glass-btn" onClick={() => { setEditData(skill); setShowForm(true); }}>✏ Edit</button>
                  <button className="glass-btn delete" onClick={() => handleDelete(skill.id)}>🗑 Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3">No skills found</td></tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <SkillForm
          existingData={editData}
          onClose={() => setShowForm(false)}
          onSave={fetchSkills}
        />
      )}
    </div>
  );
}
