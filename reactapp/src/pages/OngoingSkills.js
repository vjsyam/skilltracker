import React, { useEffect, useMemo, useState } from "react";
import "../styles/components.css";
import { getEmployees } from "../services/employeeService";
import { authService } from "../services/authService";
import { promoteSkillToProfile, fetchEmployeeSkillsByEmployee } from "../services/employeeSkillLinkService";
import { getTasksForEmployeeSkill, updateTaskStatus } from "../services/learningTaskService";
import { getCourseContent } from "../services/courseContentService";

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
  const currentUser = authService.getCurrentUser();
  const [employeeId, setEmployeeId] = useState(null);
  const [contentBySkill, setContentBySkill] = useState({});
  const [showCongrats, setShowCongrats] = useState(false);
  const [completedSkill, setCompletedSkill] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [hintsSkill, setHintsSkill] = useState(null);
  const [hintsData, setHintsData] = useState({ hints: [], notes: [], resources: [] });

  useEffect(() => {
    setItems(getOngoing());
  }, []);

  useEffect(() => {
    async function resolveEmployeeId() {
      try {
        const res = await getEmployees(0, 500);
        const list = res?.content || res?.data || res || [];
        const me = Array.isArray(list) ? list.find(e => e.userId === (currentUser?.id || currentUser?.userId)) : null;
        setEmployeeId(me?.id || null);
      } catch (e) {
        setEmployeeId(null);
      }
    }
    if (currentUser) resolveEmployeeId();
  }, [currentUser]);

  useEffect(() => {
    async function fetchContent() {
      const map = {};
      for (const s of items) {
        try {
          const id = s.backendSkillId || s.id;
          const data = await getCourseContent(id);
          map[s.id] = data;
        } catch {}
      }
      setContentBySkill(map);
    }
    if (items.length > 0) fetchContent();
  }, [items]);

  const toggleTask = async (skillId, taskId) => {
    const next = items.map(s => s.id === skillId ? {
      ...s,
      tasks: s.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t),
      progress: Math.min(100, Math.round((s.tasks.filter(t => (t.id === taskId ? !t.done : t.done)).length / s.tasks.length) * 100))
    } : s);
    setItems(next);
    localStorage.setItem('ongoingSkills', JSON.stringify(next));

    // Best-effort server update: if there is a persisted employeeSkill with tasks, try map by name and update
    try {
      const local = next.find(s => s.id === skillId);
      if (employeeId && local?.employeeSkillId) {
        const matched = { id: local.employeeSkillId, skill: { id: local.backendSkillId || local.id } };
        if (matched?.id) {
          const tasks = await getTasksForEmployeeSkill(matched.id);
          // try to update the first not-completed task to mirror toggle
          const first = Array.isArray(tasks) ? tasks.find(t => t.status !== 'COMPLETED') : null;
          if (first?.id) {
            const shouldComplete = next.find(s => s.id === skillId)?.tasks?.find(t => t.id === taskId)?.done;
            await updateTaskStatus(first.id, shouldComplete ? 'COMPLETED' : 'PENDING');
          }
        }
      }
    } catch {}

    // If this skill's tasks are now all done, promote it server-side and move to profile
    const updated = next.find(s => s.id === skillId);
    const allDone = updated?.tasks?.length > 0 && updated.tasks.every(t => t.done);
    if (allDone) {
      // Promote if possible
      if (employeeId) {
        const backendSkillId = updated.backendSkillId || updated.id;
        promoteSkillToProfile(employeeId, backendSkillId)
          .then(() => {
            // ensure local mySkills has the correct name
          })
          .catch(() => {});
      }
      // Move to profile list locally
      try {
        const profileRaw = localStorage.getItem('mySkills');
        const profile = profileRaw ? JSON.parse(profileRaw) : [];
        if (!profile.some(p => p.id === updated.id)) {
          profile.push({ id: updated.id, name: updated.name });
          localStorage.setItem('mySkills', JSON.stringify(profile));
        }
      } catch {}
      // Remove from ongoing
      const remaining = next.filter(s => s.id !== skillId);
      setItems(remaining);
      localStorage.setItem('ongoingSkills', JSON.stringify(remaining));
      // Show congrats modal
      setCompletedSkill(updated);
      setShowCongrats(true);
    }
  };

  function openHintsModal(skill) {
    const content = contentBySkill[skill.id] || { hints: [], notes: [], resources: [] };
    const sample = (arr, min, max) => {
      if (!Array.isArray(arr) || arr.length === 0) return [];
      const count = Math.min(arr.length, Math.floor(Math.random() * (max - min + 1)) + min);
      const shuffled = [...arr].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    };
    const fallbackHints = [
      "Try a smaller subproblem first",
      "Google the exact error message",
      "Check examples in the official docs",
      "Draw a quick diagram of the flow",
      "Write a failing test and fix it",
    ];
    const fallbackNotes = [
      "Focus on fundamentals before advanced patterns",
      "Keep snippets of reusable code",
      "Document what you learn in your own words",
    ];
    const hints = sample(content.hints?.length ? content.hints : fallbackHints, 2, 3);
    const notes = sample(content.notes?.length ? content.notes : fallbackNotes, 2, 3);
    const resources = sample(content.resources || [], 1, 2);
    setHintsData({ hints, notes, resources });
    setHintsSkill(skill);
    setShowHints(true);
  }

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
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="muted">Mark tasks complete to update progress</span>
              <button className="glass-btn" onClick={() => openHintsModal(s)}>Hints & Notes</button>
            </div>
          </div>
        ))}
      </div>

      {showCongrats && completedSkill && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div className="alt-card" style={{
            maxWidth: 500, padding: 32, textAlign: 'center',
            background: 'linear-gradient(135deg, #456882 0%, #1b3c53 100%)',
            color: 'white', borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ margin: '0 0 16px 0', color: 'white' }}>Congratulations!</h2>
            <p style={{ fontSize: 18, margin: '0 0 24px 0', opacity: 0.9 }}>
              You've successfully completed <strong>{completedSkill.name}</strong>!
            </p>
            <p style={{ margin: '0 0 32px 0', opacity: 0.8 }}>
              This skill has been added to your profile. Keep up the great work!
            </p>
            <button
              className="glass-btn"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
              onClick={() => setShowCongrats(false)}
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      {showHints && hintsSkill && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div className="alt-card" style={{
            maxWidth: 560, padding: 24, background: 'white', borderRadius: 12
          }}>
            <h3 className="icon-title" style={{ marginTop: 0 }}>Hints & Notes — {hintsSkill.name}</h3>
            {hintsData.hints?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <h4 style={{ margin: '8px 0' }}>Hints</h4>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {hintsData.hints.map((h, idx) => <li key={idx}>{h}</li>)}
                </ul>
              </div>
            )}
            {hintsData.notes?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <h4 style={{ margin: '8px 0' }}>Notes</h4>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {hintsData.notes.map((n, idx) => <li key={idx}>{n}</li>)}
                </ul>
              </div>
            )}
            {hintsData.resources?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <h4 style={{ margin: '8px 0' }}>Resources</h4>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {hintsData.resources.map((r, idx) => <li key={idx}>{r}</li>)}
                </ul>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="glass-btn" onClick={() => setShowHints(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
