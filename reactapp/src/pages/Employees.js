import React, { useEffect, useState } from "react";
import "../styles/pages.css";
import { getEmployees, deleteEmployee } from "../services/employeeService";
import EmployeeForm from "../pages/EmployeeForm";

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
      <h1>Employees</h1>
      <EmployeeForm
        onSuccess={loadEmployees}
        editingEmployee={editingEmployee}
        setEditingEmployee={setEditingEmployee}
      />
      <table className="glass-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Department</th>
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
                <td>{emp.skillNames?.join(", ")}</td>
                <td>
                  <button onClick={() => setEditingEmployee(emp)}>Edit</button>
                  <button onClick={() => handleDelete(emp.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
