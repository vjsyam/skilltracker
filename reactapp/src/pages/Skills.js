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
            {skills.length > 0 ? (
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