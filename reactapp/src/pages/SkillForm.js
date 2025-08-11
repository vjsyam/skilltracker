import React, { useState, useEffect } from "react";
import "../styles/components.css";
import { createSkill, updateSkill } from "../services/skillService";

export default function SkillForm({ existingData, onClose, onSave }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (existingData) setName(existingData.name || "");
  }, [existingData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name };

    if (existingData) {
      updateSkill(existingData.id, payload)
        .then(() => { onSave(); onClose(); })
        .catch((err) => console.error(err));
    } else {
      createSkill(payload)
        .then(() => { onSave(); onClose(); })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="modal glass">
      <h2>{existingData ? "Edit Skill" : "Add Skill"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Skill Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <div className="form-actions">
          <button className="glass-btn" type="submit">Save</button>
          <button className="glass-btn" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
