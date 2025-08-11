import React, { useEffect, useState } from "react";
import "../styles/pages.css";
import "../styles/components.css";
import { getDepartments, deleteDepartment } from "../services/departmentService";
import DepartmentForm from "./DepartmentForm";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchDepartments = () => {
    getDepartments()
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Delete this department?")) {
      deleteDepartment(id)
        .then(() => fetchDepartments())
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="page glass">
      <h1>Departments</h1>
      <button className="glass-btn" onClick={() => { setEditData(null); setShowForm(true); }}>
        ➕ Add Department
      </button>

      <table className="glass-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.length > 0 ? (
            departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
                <td>
                  <button className="glass-btn" onClick={() => { setEditData(dept); setShowForm(true); }}>✏ Edit</button>
                  <button className="glass-btn delete" onClick={() => handleDelete(dept.id)}>🗑 Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3">No departments found</td></tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <DepartmentForm
          existingData={editData}
          onClose={() => setShowForm(false)}
          onSave={fetchDepartments}
        />
      )}
    </div>
  );
}
