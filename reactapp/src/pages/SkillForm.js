import React, { useState, useEffect } from "react";
import "../styles/components.css";
import { createSkill, updateSkill } from "../services/skillService";
import { FaSave, FaTimes, FaTag, FaInfoCircle } from "react-icons/fa";

export default function SkillForm({ existingData, onClose, onSave, isViewOnly = false }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (existingData) {
      setName(existingData.name || "");
      setDescription(existingData.description || "");
    }
  }, [existingData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, description };

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
    <div className="modal-overlay fixed-overlay">
      <div className="modal glass centered-modal form-modal">
        <div className="modal-header">
          <h2 className="heading-gradient">
            <FaTag /> {isViewOnly ? "View Skill" : existingData ? "Edit Skill" : "Add Skill"}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>
              <FaTag /> Skill Name
            </label>
            <input
              type="text"
              placeholder="Enter skill name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isViewOnly}
            />
          </div>

          <div className="form-group">
            <label>
              <FaInfoCircle /> Description
            </label>
            <textarea
              placeholder="Enter skill description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isViewOnly}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              <FaTimes /> {isViewOnly ? "Close" : "Cancel"}
            </button>
            {!isViewOnly && (
              <button type="submit" className="glass-btn primary">
                <FaSave /> {existingData ? "Update" : "Save"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}