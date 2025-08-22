import React, { useEffect, useState, useMemo } from "react";
import "../styles/pages.css";
import "../styles/components.css";
import { getDepartments, deleteDepartment } from "../services/departmentService";
import DepartmentForm from "./DepartmentForm";
import { AdminOnly } from "../components/RoleBasedAccess";
import { authService } from "../services/authService";
import { FaEdit, FaTrash, FaPlus, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ sortBy: "id", sortDir: "asc" });

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await getDepartments(0, 1000);
      let deptData = [];
      if (response && response.content) deptData = response.content; else if (response && response.data) deptData = response.data; else if (Array.isArray(response)) deptData = response; else deptData = [];
      setDepartments(deptData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setError("Failed to load departments");
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter(d => {
      const employeeCount = Array.isArray(d.employees) ? d.employees.length : 0;
      return (d.name || "").toLowerCase().includes(q) || String(d.id).includes(q) || String(employeeCount).includes(q);
    });
  }, [departments, search]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    const { sortBy, sortDir } = sorting;
    list.sort((a, b) => {
      const av = sortBy === "employees" ? (Array.isArray(a.employees) ? a.employees.length : 0) : (a?.[sortBy] ?? "");
      const bv = sortBy === "employees" ? (Array.isArray(b.employees) ? b.employees.length : 0) : (b?.[sortBy] ?? "");
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [filtered, sorting]);

  const handleSort = (column) => {
    const newDir = sorting.sortBy === column && sorting.sortDir === "asc" ? "desc" : "asc";
    setSorting({ sortBy: column, sortDir: newDir });
  };

  const getSortIcon = (column) => {
    if (sorting.sortBy !== column) return <FaSort />;
    return sorting.sortDir === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

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
        <div>
          <h1 className="heading-gradient">Departments</h1>
          <p className="page-subtitle">Organize teams and manage assignments</p>
        </div>
        <AdminOnly>
          <button
            className="glass-btn"
            onClick={() => { setEditData(null); setShowForm(true); }}
          >
            <FaPlus /> Add Department
          </button>
        </AdminOnly>
      </div>

      <div className="glass-form" style={{ marginTop: 8 }}>
        <input
          type="text"
          placeholder="Search departments by name or employee count"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ flex: 1 }}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-indicator">Loading...</div>}

      <div className="alt-card hover-lift" style={{ marginTop: 12 }}>
        <div className="soft-divider" />
        <div className="table-wrap">
          <table className="glass-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")} className="sortable-header">ID {getSortIcon("id")}</th>
                <th onClick={() => handleSort("name")} className="sortable-header">Department Name {getSortIcon("name")}</th>
                <th onClick={() => handleSort("employees")} className="sortable-header">Employees {getSortIcon("employees")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted && sorted.length > 0 ? (
                sorted.map((dept) => (
                  <tr key={dept.id}>
                    <td>{dept.id}</td>
                    <td>{dept.name}</td>
                    <td>
                      {dept.employees && Array.isArray(dept.employees) && dept.employees.length > 0
                        ? `${dept.employees.length} employee${dept.employees.length > 1 ? "s" : ""}`
                        : <em>No employees</em>}
                    </td>
                    <td>
                      <AdminOnly>
                        <button className="glass-btn" onClick={() => { setEditData(dept); setShowForm(true); }}><FaEdit /> Edit</button>
                        <button className="glass-btn delete" onClick={() => handleDelete(dept.id)}><FaTrash /> Delete</button>
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