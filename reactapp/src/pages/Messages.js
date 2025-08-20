import React, { useEffect, useState } from "react";
import "../styles/pages.css";
import "../styles/components.css";
import { AdminOnly } from "../components/RoleBasedAccess";
import { FaEnvelope, FaClock } from "react-icons/fa";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/messages")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="page glass">
      <p className="text-center">Loading messages...</p>
    </div>
  );

  return (
    <AdminOnly>
      <div className="page glass">
        <div className="page-header">
          <h1><FaEnvelope /> Admin Messages</h1>
        </div>
        
        {messages.length === 0 ? (
          <div className="alert info">
            No messages found in the system.
          </div>
        ) : (
          <div className="table-wrap">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th><FaClock /> Date</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
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
        )}
      </div>
    </AdminOnly>
  );
}