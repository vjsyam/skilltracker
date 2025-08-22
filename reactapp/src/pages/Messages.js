import React, { useEffect, useState } from "react";
import "../styles/pages.css";
import "../styles/components.css";
import { getMessages } from "../services/messageService";
import { FaEnvelope, FaClock, FaChevronLeft, FaChevronRight, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
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
    sortBy: "createdAt",
    sortDir: "desc"
  });

  const loadMessages = async (page = 0, size = 10, sortBy = "createdAt", sortDir = "desc") => {
    setLoading(true);
    try {
      const response = await getMessages(page, size, sortBy, sortDir);
      
      // Handle different response structures
      let messageData = [];
      if (response && response.content) {
        messageData = response.content;
      } else if (response && response.data) {
        messageData = response.data;
      } else if (Array.isArray(response)) {
        messageData = response;
      } else {
        messageData = [];
      }
      
      setMessages(messageData);
      
      // Set pagination data if available
      if (response) {
        setPagination({
          page: response.page || 0,
          size: response.size || 10,
          totalElements: response.totalElements || messageData.length,
          totalPages: response.totalPages || 1,
          hasNext: response.hasNext || false,
          hasPrevious: response.hasPrevious || false
        });
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSort = (column) => {
    const newSortDir = sorting.sortBy === column && sorting.sortDir === "asc" ? "desc" : "asc";
    setSorting({ sortBy: column, sortDir: newSortDir });
    loadMessages(0, pagination.size, column, newSortDir);
  };

  const handlePageChange = (newPage) => {
    loadMessages(newPage, pagination.size, sorting.sortBy, sorting.sortDir);
  };

  const getSortIcon = (column) => {
    if (sorting.sortBy !== column) return <FaSort />;
    return sorting.sortDir === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  if (loading) return (
    <div className="page glass">
      <p className="text-center">Loading messages...</p>
    </div>
  );

  return (
    <div className="page glass">
      <div className="page-header">
        <div>
          <h1><FaEnvelope /> Admin Messages</h1>
          <p className="page-subtitle">Incoming messages from users</p>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {messages && messages.length === 0 ? (
        <div className="alert info">
          No messages found in the system.
        </div>
      ) : (
        <div className="alt-card hover-lift" style={{ marginTop: 12 }}>
          <div className="soft-divider" />
          <div className="table-wrap">
            <table className="glass-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")} className="sortable-header">
                    Name {getSortIcon("name")}
                  </th>
                  <th onClick={() => handleSort("email")} className="sortable-header">
                    Email {getSortIcon("email")}
                  </th>
                  <th>Message</th>
                  <th onClick={() => handleSort("createdAt")} className="sortable-header">
                    <FaClock /> Date {getSortIcon("createdAt")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {messages && messages.map((msg) => (
                  <tr key={msg.id}>
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.content}</td>
                    <td>{new Date(msg.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="alt-card" style={{ marginTop: 12 }}>
          <div className="pagination-controls">
            <div className="pagination-info">
              Showing {pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} messages
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
        </div>
      )}
    </div>
  );
}