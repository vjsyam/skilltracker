import React, { useEffect, useState } from "react";
import "../styles/pages.css";
import "../styles/components.css";
import { getEmployees, deleteEmployee } from "../services/employeeService";
import EmployeeForm from "../pages/EmployeeForm";
import { FaUserEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const loadEmployees = () => {
    getEmployees()
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id).then(() => loadEmployees());
    }
  };

  return (
    <div className="page glass">
      <div className="page-header">
        <h1>Employee Management</h1>
        <button 
          className="glass-btn" 
          onClick={() => setEditingEmployee({})}
        >
          <FaPlus /> Add Employee
        </button>
      </div>
      
      <div className="table-wrap">
        <table className="glass-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Department</th>
              <th>Manager</th>
              <th>Skills</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.userName}</td>
                  <td>{emp.departmentName}</td>
                  <td>{emp.managerName || 'None'}</td>
                  <td>{emp.skillNames?.join(", ") || 'None'}</td>
                  <td>
                    <button 
                      className="glass-btn" 
                      onClick={() => setEditingEmployee(emp)}
                    >
                      <FaUserEdit /> Edit
                    </button>
                    <button 
                      className="glass-btn delete" 
                      onClick={() => handleDelete(emp.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingEmployee && (
        <EmployeeForm
          onSuccess={loadEmployees}
          editingEmployee={editingEmployee}
          setEditingEmployee={setEditingEmployee}
        />
      )}
    </div>
  );
}