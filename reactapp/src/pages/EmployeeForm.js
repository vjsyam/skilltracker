import React, { useState, useEffect } from "react";
import { createEmployee, updateEmployee } from "../services/employeeService";

export default function EmployeeForm({ onSuccess, editingEmployee, setEditingEmployee }) {
  const [formData, setFormData] = useState({
    user: { id: "" },
    department: { id: "" },
    skills: []
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        user: { id: editingEmployee.userId || "" },
        department: { id: editingEmployee.departmentId || "" },
        skills: editingEmployee.skillIds?.map(id => ({ id })) || []
      });
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "userId") {
      setFormData({ ...formData, user: { id: value } });
    } else if (name === "departmentId") {
      setFormData({ ...formData, department: { id: value } });
    } else if (name === "skills") {
      const skillIds = value.split(",").map(id => ({ id: parseInt(id.trim()) }));
      setFormData({ ...formData, skills: skillIds });
    }
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
        setFormData({ user: { id: "" }, department: { id: "" }, skills: [] });
      })
      .catch((err) => console.error(err));
  };

  return (
    <form className="glass-form" onSubmit={handleSubmit}>
      <input
        type="number"
        name="userId"
        placeholder="User ID"
        value={formData.user.id}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="departmentId"
        placeholder="Department ID"
        value={formData.department.id}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="skills"
        placeholder="Skill IDs (comma-separated)"
        value={formData.skills.map(s => s.id).join(", ")}
        onChange={handleChange}
      />
      <button type="submit">{editingEmployee ? "Update" : "Add"} Employee</button>
      {editingEmployee && (
        <button type="button" onClick={() => setEditingEmployee(null)}>Cancel</button>
      )}
    </form>
  );
}
