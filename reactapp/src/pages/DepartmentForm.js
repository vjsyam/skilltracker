import React, { useState, useEffect } from "react";
import "../styles/components.css";
import { createDepartment, updateDepartment } from "../services/departmentService";
import { FaSave, FaTimes, FaBuilding, FaUser } from "react-icons/fa";

export default function DepartmentForm({ existingData, onClose, onSave, isViewOnly = false }) {
  const [name, setName] = useState("");
  const [employeeIds, setEmployeeIds] = useState("");

  useEffect(() => {
    if (existingData) {
      setName(existingData.name || "");
      if (existingData.employees) {
        setEmployeeIds(existingData.employees.map(emp => emp.id).join(","));
      }
    }
  }, [existingData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { 
      name,
      employeeIds: employeeIds.split(",").map(id => id.trim()).filter(id => id)
    };

    if (existingData) {
      updateDepartment(existingData.id, payload)
        .then(() => { onSave(); onClose(); })
        .catch((err) => console.error(err));
    } else {
      createDepartment(payload)
        .then(() => { onSave(); onClose(); })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="modal-overlay fixed-overlay">
      <div className="modal glass centered-modal form-modal">
        <div className="modal-header">
          <h2 className="heading-gradient">
            <FaBuilding /> {isViewOnly ? "View Department" : existingData ? "Edit Department" : "Add Department"}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>
              <FaBuilding /> Department Name
            </label>
            <input
              type="text"
              placeholder="Enter department name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isViewOnly}
            />
          </div>

          <div className="form-group">
            <label>
              <FaUser /> Employee IDs (comma separated)
            </label>
            <input
              type="text"
              placeholder="Enter employee IDs (e.g., 1, 2, 3)"
              value={employeeIds}
              onChange={(e) => setEmployeeIds(e.target.value)}
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