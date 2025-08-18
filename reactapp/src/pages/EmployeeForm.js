import React, { useState, useEffect } from "react";
import "../styles/components.css";
import { createEmployee, updateEmployee } from "../services/employeeService";
import { FaUser, FaBuilding, FaTools, FaUserTie, FaSave, FaTimes } from "react-icons/fa";

export default function EmployeeForm({ onSuccess, editingEmployee, setEditingEmployee }) {
  const [formData, setFormData] = useState({
    user: { id: "" },
    manager: { id: "" },
    department: { id: "" },
    skills: []
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        user: { id: editingEmployee.userId || "" },
        manager: { id: editingEmployee.managerId || "" },
        department: { id: editingEmployee.departmentId || "" },
        skills: editingEmployee.skillIds?.map(id => ({ id })) || []
      });
    } else {
      setFormData({
        user: { id: "" },
        manager: { id: "" },
        department: { id: "" },
        skills: []
      });
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "userId") {
      setFormData({ ...formData, user: { id: value } });
    } else if (name === "managerId") {
      setFormData({ ...formData, manager: { id: value } });
    } else if (name === "departmentId") {
      setFormData({ ...formData, department: { id: value } });
    }
  };

  const handleSkillsChange = (e) => {
    const skillIds = e.target.value
      .split(",")
      .map(id => ({ id: parseInt(id.trim()) }))
      .filter(skill => !isNaN(skill.id));
    setFormData({ ...formData, skills: skillIds });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editingEmployee
      ? updateEmployee(editingEmployee.id, formData)
      : createEmployee(formData);

    action
      .then(() => {
        onSuccess();
        setEditingEmployee(null);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="modal-overlay fixed-overlay">
      <div className="modal glass centered-modal">
        <div className="modal-header">
          <h2>
            <FaUser /> {editingEmployee ? "Edit Employee" : "Add Employee"}
          </h2>
          <button 
            className="close-btn" 
            onClick={() => setEditingEmployee(null)}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="userId">
              <FaUser /> User ID
            </label>
            <input
              id="userId"
              type="number"
              name="userId"
              placeholder="Enter user ID"
              value={formData.user.id}
              onChange={handleChange}
              required
              min="1"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="managerId">
              <FaUserTie /> Manager ID
            </label>
            <input
              id="managerId"
              type="number"
              name="managerId"
              placeholder="Enter manager's user ID"
              value={formData.manager.id}
              onChange={handleChange}
              min="0"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="departmentId">
              <FaBuilding /> Department ID
            </label>
            <input
              id="departmentId"
              type="number"
              name="departmentId"
              placeholder="Enter department ID"
              value={formData.department.id}
              onChange={handleChange}
              required
              min="1"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">
              <FaTools /> Skill IDs
            </label>
            <input
              id="skills"
              type="text"
              name="skills"
              placeholder="e.g., 1, 2, 3"
              value={formData.skills.map(s => s.id).join(", ")}
              onChange={handleSkillsChange}
              className="form-input"
            />
            <small className="skill-hint">
              Enter comma-separated skill IDs
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="glass-btn secondary"
              onClick={() => setEditingEmployee(null)}
            >
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="glass-btn primary">
              <FaSave /> {editingEmployee ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}