import React, { useEffect, useState } from "react";
import "../styles/components.css";

function getOngoing() {
  try {
    const raw = localStorage.getItem('ongoingSkills');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function ProgressCircle({ value }) {
  const size = 64;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={radius} stroke="#d2c1b6" strokeWidth={stroke} fill="none" />
      <circle cx={size/2} cy={size/2} r={radius} stroke="#456882" strokeWidth={stroke} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#1b3c53" fontSize="14">{value}%</text>
    </svg>
  );
}

export default function OngoingSkills() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getOngoing());
  }, []);

  const toggleTask = (skillId, taskId) => {
    const next = items.map(s => s.id === skillId ? {
      ...s,
      tasks: s.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t),
      progress: Math.min(100, Math.round((s.tasks.filter(t => (t.id === taskId ? !t.done : t.done)).length / s.tasks.length) * 100))
    } : s);
    setItems(next);
    localStorage.setItem('ongoingSkills', JSON.stringify(next));
  };

  return (
    <div className="page glass">
      <div className="alt-header">
        <div>
          <h1 className="alt-title">Ongoing Skills</h1>
          <p className="section-subtitle-soft">Track your progress across learning tasks</p>
        </div>
      </div>

      <div className="alt-grid">
        {items.length === 0 && (
          <div className="alt-card subtle-bg">No ongoing skills yet. Add some from New Skills.</div>
        )}
        {items.map(s => (
          <div key={s.id} className="alt-card hover-lift">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ProgressCircle value={s.progress ?? 20} />
              <div>
                <h3 style={{ margin: 0 }}>{s.name}</h3>
                <p className="muted" style={{ margin: '4px 0' }}>Tasks: {s.tasks?.filter(t => t.done).length || 0}/{s.tasks?.length || 0}</p>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              {s.tasks?.map(t => (
                <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <input type="checkbox" checked={!!t.done} onChange={() => toggleTask(s.id, t.id)} />
                  <span style={{ color: '#1b3c53' }}>{t.title}</span>
                </label>
              ))}
            </div>
            <div className="card-footer">
              <span className="muted">Mark tasks complete to update progress</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
