import React, { useEffect, useState, useCallback, useMemo } from "react";
import "../styles/pages.css";
import "../styles/components.css";
import { getEmployees, deleteEmployee, createEmployee, updateEmployee } from "../services/employeeService";
import EmployeeForm from "../pages/EmployeeForm";
import { AdminOnly } from "../components/RoleBasedAccess";
import { authService } from "../services/authService";
import { FaUserEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight, FaSort, FaSortUp, FaSortDown, FaFileImport, FaFileExport } from "react-icons/fa";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [sorting, setSorting] = useState({ sortBy: "id", sortDir: "asc" });
  const [search, setSearch] = useState("");

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getEmployees(0, 1000);
      let employeeData = [];
      if (response && response.content) employeeData = response.content; else if (response && response.data) employeeData = response.data; else if (Array.isArray(response)) employeeData = response; else employeeData = [];
      setEmployees(employeeData);
      setError(null);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(e => {
      const hay = [e.userName, e.departmentName, e.managerName, ...(Array.isArray(e.skillNames) ? e.skillNames : [])].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q) || String(e.id).includes(q);
    });
  }, [employees, search]);

  const sortedEmployees = useMemo(() => {
    const list = [...filteredEmployees];
    const { sortBy, sortDir } = sorting;
    list.sort((a, b) => {
      const av = a?.[sortBy] ?? "";
      const bv = b?.[sortBy] ?? "";
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [filteredEmployees, sorting]);

  const pagedEmployees = useMemo(() => {
    const start = pagination.page * pagination.size;
    return sortedEmployees.slice(start, start + pagination.size);
  }, [sortedEmployees, pagination]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pagination.size));

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        loadEmployees();
      } catch (err) {
        console.error("Failed to delete employee:", err);
        setError("Failed to delete employee");
      }
    }
  };

  const handleSort = (column) => {
    const newDir = sorting.sortBy === column && sorting.sortDir === "asc" ? "desc" : "asc";
    setSorting({ sortBy: column, sortDir: newDir });
    setPagination(p => ({ ...p, page: 0 }));
  };

  const getSortIcon = (column) => {
    if (sorting.sortBy !== column) return <FaSort />;
    return sorting.sortDir === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // CSV utilities (client-side with optional backend persist)
  const exportCSV = () => {
    const headers = [
      "id","userId","userName","departmentId","departmentName","managerId","managerName","skillIds","skillNames"
    ];
    const rows = filteredEmployees.map(e => [
      e.id ?? "",
      e.userId ?? "",
      e.userName ?? "",
      e.departmentId ?? "",
      e.departmentName ?? "",
      e.managerId ?? "",
      e.managerName ?? "",
      Array.isArray(e.skillIds) ? e.skillIds.join(";") : "",
      Array.isArray(e.skillNames) ? e.skillNames.join(";") : ""
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) return;
      const header = lines[0].split(",").map(h => h.replace(/^"|"$/g, ""));
      const data = lines.slice(1).map(line => {
        const cols = line.match(/"([^"]|"")*"|[^,]+/g)?.map(c => c.replace(/^"|"$/g, "").replace(/""/g, '"')) || [];
        const obj = {};
        header.forEach((h, idx) => obj[h] = cols[idx]);
        if (obj.skillIds) obj.skillIds = obj.skillIds.split(";").filter(Boolean).map(x => parseInt(x)).filter(x => !isNaN(x));
        return obj;
      });

      // Merge client-side for immediate visibility
      setEmployees(prev => {
        const byId = new Map(prev.map(e => [String(e.id), e]));
        data.forEach(row => byId.set(String(row.id || row.userId || Math.random()), { ...byId.get(String(row.id || "")), ...row }));
        return Array.from(byId.values());
      });

      // Offer to persist to backend if we have the required IDs
      const canPersist = data.some(r => r.userId && r.departmentId);
      if (canPersist && window.confirm("CSV imported. Do you want to persist rows with IDs to backend now?")) {
        setLoading(true);
        try {
          for (const r of data) {
            if (!r.userId || !r.departmentId) continue;
            const payload = {
              user: { id: parseInt(r.userId) },
              department: { id: parseInt(r.departmentId) },
              skills: Array.isArray(r.skillIds) ? r.skillIds.map(id => ({ id })) : []
            };
            if (r.managerId) payload.manager = { id: parseInt(r.managerId) };
            if (r.id) {
              try { await updateEmployee(parseInt(r.id), payload); } catch {}
            } else {
              try { await createEmployee(payload); } catch {}
            }
          }
          await loadEmployees();
          alert("CSV persisted to backend for rows with required IDs.");
        } catch (err) {
          console.error(err);
          alert("Some rows may have failed to persist. See console for details.");
        } finally {
          setLoading(false);
        }
      } else {
        alert("CSV imported for display. Persisting to backend is skipped (missing IDs). Export template includes ID fields.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="page glass">
      <div className="page-header">
        <div>
          <h1 className="heading-gradient">Employee Management</h1>
          <p className="page-subtitle">Create, edit and view employee records</p>
        </div>
        <AdminOnly>
          <button className="glass-btn" onClick={() => setEditingEmployee({})}>
            <FaPlus /> Add Employee
          </button>
        </AdminOnly>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-indicator">Loading...</div>}

      <div className="glass-form" style={{ marginTop: 8 }}>
        <input
          type="text"
          placeholder="Search employees by name, department, manager or skills"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 0 })); }}
          className="form-input"
          style={{ flex: 1 }}
        />
        <select className="themed-select" value={pagination.size} onChange={(e) => setPagination({ page: 0, size: parseInt(e.target.value) || 10 })}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      <AdminOnly>
        <div className="alt-card" style={{ marginTop: 12 }}>
          <h3 className="icon-title"><FaFileExport /> Export / <FaFileImport /> Import</h3>
          <p className="muted" style={{ marginTop: 4 }}>Export includes ID fields for re-import and backend persistence</p>
          <div className="stat-row">
            <button className="glass-btn" onClick={exportCSV}><FaFileExport /> Export CSV</button>
            <label className="glass-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <FaFileImport /> Import CSV
              <input type="file" accept=".csv" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && importCSV(e.target.files[0])} />
            </label>
          </div>
        </div>
      </AdminOnly>

      <div className="alt-card hover-lift" style={{ marginTop: 12 }}>
        <div className="soft-divider" />
        <div className="table-wrap">
          <table className="glass-table" style={{ tableLayout: 'auto' }}>
            <thead>
              <tr>
                <th onClick={() => handleSort("id")} className="sortable-header" title="Sort by ID">ID {getSortIcon("id")}</th>
                <th onClick={() => handleSort("userName")} className="sortable-header" title="Sort by User">User {getSortIcon("userName")}</th>
                <th onClick={() => handleSort("departmentName")} className="sortable-header" title="Sort by Department">Department {getSortIcon("departmentName")}</th>
                <th onClick={() => handleSort("managerName")} className="sortable-header" title="Sort by Manager">Manager {getSortIcon("managerName")}</th>
                <th>Skills</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedEmployees && pagedEmployees.length > 0 ? (
                pagedEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.userName}</td>
                    <td>{emp.departmentName}</td>
                    <td>{emp.managerName || 'None'}</td>
                    <td>{emp.skillNames && Array.isArray(emp.skillNames) ? emp.skillNames.join(", ") : 'None'}</td>
                    <td>
                      <AdminOnly>
                        <button className="glass-btn" onClick={() => setEditingEmployee(emp)}><FaUserEdit /> Edit</button>
                        <button className="glass-btn delete" onClick={() => handleDelete(emp.id)}><FaTrash /> Delete</button>
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
      </div>

      {totalPages > 1 && (
        <div className="alt-card" style={{ marginTop: 12 }}>
          <div className="pagination-controls">
            <div className="pagination-info">
              Showing {pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, filteredEmployees.length)} of {filteredEmployees.length} employees
            </div>
            <div className="pagination-buttons">
              <button className="glass-btn" onClick={() => setPagination(p => ({ ...p, page: 0 }))} disabled={pagination.page === 0}><FaChevronLeft /> First</button>
              <button className="glass-btn" onClick={() => setPagination(p => ({ ...p, page: Math.max(0, p.page - 1) }))} disabled={pagination.page === 0}><FaChevronLeft /> Previous</button>
              <span className="page-info">Page {pagination.page + 1} of {totalPages}</span>
              <button className="glass-btn" onClick={() => setPagination(p => ({ ...p, page: Math.min(totalPages - 1, p.page + 1) }))} disabled={pagination.page >= totalPages - 1}>Next <FaChevronRight /></button>
              <button className="glass-btn" onClick={() => setPagination(p => ({ ...p, page: totalPages - 1 }))} disabled={pagination.page >= totalPages - 1}>Last <FaChevronRight /></button>
            </div>
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