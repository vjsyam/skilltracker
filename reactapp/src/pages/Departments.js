import React, { useEffect, useState } from "react";
import "../styles/pages.css";
import "../styles/components.css";
import { getDepartments, deleteDepartment } from "../services/departmentService";
import DepartmentForm from "./DepartmentForm";
import { AdminOnly, ViewOnly } from "../components/RoleBasedAccess";
import { authService } from "../services/authService";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await getDepartments();
      setDepartments(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        fetchDepartments(); 
      } catch (err) {
        console.error("Failed to delete department:", err);
        setError("Failed to delete department");
      }
    }
  };

  return (
    <div className="page glass">
      <div className="page-header">
        <h1 className="heading-gradient">Departments</h1>
        <AdminOnly>
          <button
            className="glass-btn"
            onClick={() => {
              setEditData(null);
              setShowForm(true);
            }}
          >
            <FaPlus /> Add Department
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
              <th>Department Name</th>
              <th>Employees</th>
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
                    {dept.employees && dept.employees.length > 0
                      ? `${dept.employees.length} employee${
                          dept.employees.length > 1 ? "s" : ""
                        }`
                      : <em>No employees</em>}
                  </td>
                                     <td>
                     <ViewOnly>
                       <button
                         className="glass-btn view"
                         onClick={() => {
                           setEditData(dept);
                           setShowForm(true);
                         }}
                       >
                         <FaEye /> View
                       </button>
                     </ViewOnly>
                     <AdminOnly>
                       <button
                         className="glass-btn"
                         onClick={() => {
                           setEditData(dept);
                           setShowForm(true);
                         }}
                       >
                         <FaEdit /> Edit
                       </button>
                       <button
                         className="glass-btn delete"
                         onClick={() => handleDelete(dept.id)}
                       >
                         <FaTrash /> Delete
                       </button>
                     </AdminOnly>
                   </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  {loading ? "Loading..." : "No departments found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

             {showForm && (
         <DepartmentForm
           existingData={editData}
           onClose={() => setShowForm(false)}
           onSave={fetchDepartments}
           isViewOnly={!authService.isAdmin()}
         />
       )}
    </div>
  );
}