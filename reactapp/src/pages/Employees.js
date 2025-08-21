import React, { useEffect, useState } from "react";
import "../styles/pages.css";
import "../styles/components.css";
import { getEmployees, deleteEmployee } from "../services/employeeService";
import EmployeeForm from "../pages/EmployeeForm";
import { AdminOnly, ViewOnly } from "../components/RoleBasedAccess";
import { authService } from "../services/authService";
import { FaUserEdit, FaTrash, FaPlus, FaEye, FaChevronLeft, FaChevronRight, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  });
  const [sorting, setSorting] = useState({
    sortBy: "id",
    sortDir: "asc"
  });

  const loadEmployees = async (page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
    setLoading(true);
    try {
      const response = await getEmployees(page, size, sortBy, sortDir);
      
      // Handle different response structures
      let employeeData = [];
      if (response && response.content) {
        employeeData = response.content;
      } else if (response && response.data) {
        employeeData = response.data;
      } else if (Array.isArray(response)) {
        employeeData = response;
      } else {
        employeeData = [];
      }
      
      setEmployees(employeeData);
      
      // Set pagination data if available
      if (response) {
        setPagination({
          page: response.page || 0,
          size: response.size || 10,
          totalElements: response.totalElements || employeeData.length,
          totalPages: response.totalPages || 1,
          hasNext: response.hasNext || false,
          hasPrevious: response.hasPrevious || false
        });
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        loadEmployees(pagination.page, pagination.size, sorting.sortBy, sorting.sortDir);
      } catch (err) {
        console.error("Failed to delete employee:", err);
        setError("Failed to delete employee");
      }
    }
  };

  const handleSort = (column) => {
    const newSortDir = sorting.sortBy === column && sorting.sortDir === "asc" ? "desc" : "asc";
    setSorting({ sortBy: column, sortDir: newSortDir });
    loadEmployees(0, pagination.size, column, newSortDir);
  };

  const handlePageChange = (newPage) => {
    loadEmployees(newPage, pagination.size, sorting.sortBy, sorting.sortDir);
  };

  const getSortIcon = (column) => {
    if (sorting.sortBy !== column) return <FaSort />;
    return sorting.sortDir === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div className="page glass">
      <div className="page-header">
        <h1 className="heading-gradient">Employee Management</h1>
        <AdminOnly>
          <button 
            className="glass-btn" 
            onClick={() => setEditingEmployee({})}
          >
            <FaPlus /> Add Employee
          </button>
        </AdminOnly>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-indicator">Loading...</div>}
      
      <div className="table-wrap">
        <table className="glass-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable-header">
                ID {getSortIcon("id")}
              </th>
              <th onClick={() => handleSort("userName")} className="sortable-header">
                User {getSortIcon("userName")}
              </th>
              <th onClick={() => handleSort("departmentName")} className="sortable-header">
                Department {getSortIcon("departmentName")}
              </th>
              <th onClick={() => handleSort("managerName")} className="sortable-header">
                Manager {getSortIcon("managerName")}
              </th>
              <th>Skills</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees && employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.userName}</td>
                  <td>{emp.departmentName}</td>
                  <td>{emp.managerName || 'None'}</td>
                  <td>{emp.skillNames && Array.isArray(emp.skillNames) ? emp.skillNames.join(", ") : 'None'}</td>
                  <td>
                    <ViewOnly>
                      <button 
                        className="glass-btn view" 
                        onClick={() => setEditingEmployee(emp)}
                      >
                        <FaEye /> View
                      </button>
                    </ViewOnly>
                    <AdminOnly>
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
                    </AdminOnly>
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

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing {pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} employees
          </div>
          <div className="pagination-buttons">
            <button 
              className="glass-btn" 
              onClick={() => handlePageChange(0)}
              disabled={!pagination.hasPrevious}
            >
              <FaChevronLeft /> First
            </button>
            <button 
              className="glass-btn" 
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevious}
            >
              <FaChevronLeft /> Previous
            </button>
            <span className="page-info">
              Page {pagination.page + 1} of {pagination.totalPages}
            </span>
            <button 
              className="glass-btn" 
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
            >
              Next <FaChevronRight />
            </button>
            <button 
              className="glass-btn" 
              onClick={() => handlePageChange(pagination.totalPages - 1)}
              disabled={!pagination.hasNext}
            >
              Last <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {editingEmployee && (
        <EmployeeForm
          onSuccess={loadEmployees}
          editingEmployee={editingEmployee}
          setEditingEmployee={setEditingEmployee}
          isViewOnly={!authService.isAdmin()}
        />
      )}
    </div>
  );
}