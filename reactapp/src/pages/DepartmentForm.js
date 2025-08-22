import React, { useState, useEffect } from "react";
import "../styles/components.css";
import { createDepartment, updateDepartment } from "../services/departmentService";
import { getEmployees } from "../services/employeeService";
import { FaSave, FaTimes, FaBuilding, FaUser } from "react-icons/fa";

export default function DepartmentForm({ existingData, onClose, onSave, isViewOnly = false }) {
  const [name, setName] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getEmployees(0, 1000);
        const list = res?.data || res?.content || res || [];
        setAllEmployees(Array.isArray(list) ? list : []);
      } catch (e) { /* ignore */ }
    })();
  }, []);

  useEffect(() => {
    if (existingData) {
      setName(existingData.name || "");
      const ids = Array.isArray(existingData.employees) ? existingData.employees.map(emp => emp.id) : [];
      setSelectedEmployeeIds(ids);
    } else {
      setName("");
      setSelectedEmployeeIds([]);
    }
  }, [existingData]);

  const toggleEmployee = (id) => {
    setSelectedEmployeeIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const employees = selectedEmployeeIds.map(id => ({ id }));
    const payload = { name, employees };

    const action = existingData ? updateDepartment(existingData.id, payload) : createDepartment(payload);
    action
      .then(() => { onSave(); onClose(); })
      .catch((err) => console.error(err));
  };

  return (
    <div className="modal-overlay fixed-overlay">
      <div className="modal glass centered-modal form-modal">
        <div className="modal-header">
          <div>
            <h2 className="heading-gradient">
              <FaBuilding /> {isViewOnly ? "View Department" : existingData ? "Edit Department" : "Add Department"}
            </h2>
            <div className="form-header-badge">Tip: Assign employees below</div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body form-modern">
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
            <label className="icon-title"><FaUser /> Assign Employees</label>
            <div className="subtle-bg" style={{ maxHeight: 220, overflowY: 'auto' }}>
              {allEmployees.map(emp => {
                const active = selectedEmployeeIds.includes(emp.id);
                return (
                  <span
                    key={emp.id}
                    className={`chip-toggle ${active ? 'active' : ''}`}
                    onClick={() => !isViewOnly && toggleEmployee(emp.id)}
                  >
                    {emp.userName || `Employee #${emp.id}`}
                  </span>
                );
              })}
            </div>
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