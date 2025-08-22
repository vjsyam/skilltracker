import React, { useEffect, useState, useMemo } from "react";
import "../styles/components.css";
import { authService } from "../services/authService";
import { getEmployees } from "../services/employeeService";
import { getSkills } from "../services/skillService";
import { FaUser, FaBuilding, FaUserTie, FaStar, FaBolt } from "react-icons/fa";
import FloatingParticles from "../components/FloatingParticles";

function readOngoing() {
  try {
    const raw = localStorage.getItem('ongoingSkills');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function ProgressCircle({ value }) {
  const size = 54;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} style={{ flex: '0 0 auto' }}>
      <circle cx={size/2} cy={size/2} r={radius} stroke="#d2c1b6" strokeWidth={stroke} fill="none" />
      <circle cx={size/2} cy={size/2} r={radius} stroke="#456882" strokeWidth={stroke} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#1b3c53" fontSize="12">{value}%</text>
    </svg>
  );
}

export default function EmployeePortal() {
  const [profile, setProfile] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    let isCancelled = false;
    async function load() {
      setLoading(true);
      try {
        const employeesResponse = await getEmployees(0, 500);
        const employees = employeesResponse?.content || employeesResponse?.data || employeesResponse || [];
        const myEmp = Array.isArray(employees)
          ? employees.find(e => e.userId === (currentUser?.id || currentUser?.userId))
          : null;
        setProfile(myEmp || null);

        const skills = await getSkills(0, 500);
        const normalizedSkills = skills?.content || skills?.data || skills || [];
        setAllSkills(Array.isArray(normalizedSkills) ? normalizedSkills : []);

        setOngoing(readOngoing());
        setError(null);
      } catch (e) {
        console.error("Failed to load profile:", e);
        setError("Failed to load your profile");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    load();
    return () => { isCancelled = true; };
  }, [currentUser?.id, currentUser?.userId]);

  const currentSkillIds = useMemo(() => new Set(profile?.skillIds || []), [profile]);
  const suggestedSkills = useMemo(() =>
    allSkills.filter(s => !currentSkillIds.has(s.id)),
    [allSkills, currentSkillIds]
  );

  if (loading) return <div className="page glass"><div className="loading-indicator">Loading...</div></div>;
  if (error) return <div className="page glass"><div className="error-message">{error}</div></div>;

  const initials = (profile?.userName || currentUser?.name || "?")
    .split(" ")
    .map(s => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="page glass">
      <FloatingParticles />
      <div className="alt-header fade-in">
        <div>
          <h1 className="alt-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaStar /> My Profile
          </h1>
          <p className="section-subtitle-soft">Overview of your role, current skills and learning progress</p>
        </div>
      </div>

      {!profile ? (
        <div className="alt-card hover-lift slide-up">Profile not found. Please contact your administrator.</div>
      ) : (
        <div className="alt-grid">
          <div className="alt-card hover-lift profile-card slide-up" style={{ gridColumn: '1 / -1' }}>
            <div className="profile-avatar"><FaBolt style={{ marginRight: 6 }} />{initials}</div>
            <div className="profile-meta">
              <h3 className="icon-title"><FaUser /> {profile.userName || currentUser?.name}</h3>
              <p>{profile.userEmail || currentUser?.email}</p>
              <div className="soft-divider" />
              <div className="stat-row">
                <span className="stat-pill"><span className="stat-dot" /> Skills: {profile.skillNames?.length || 0}</span>
                <span className="stat-pill"><span className="stat-dot" /> Ongoing: {ongoing?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="alt-card hover-lift slide-up subtle-bg">
            <h3 className="icon-title"><FaBuilding /> Department</h3>
            <p>{profile.departmentName || "Not assigned"}</p>
            <div className="card-footer">
              <span className="muted">Your current team placement</span>
            </div>
          </div>

          <div className="alt-card hover-lift slide-up subtle-bg">
            <h3 className="icon-title"><FaUserTie /> Manager</h3>
            <p>{profile.managerName || "None"}</p>
            <div className="card-footer">
              <span className="muted">Reporting manager</span>
            </div>
          </div>

          <div className="alt-card hover-lift slide-up">
            <h3 className="icon-title"><FaStar /> My Skills</h3>
            {profile.skillNames && profile.skillNames.length > 0 ? (
              <div className="chip-list" style={{ marginTop: 6 }}>
                {profile.skillNames.map(n => (
                  <span key={n} className="chip">{n}</span>
                ))}
              </div>
            ) : (
              <p>No skills added yet</p>
            )}
            <div className="card-footer">
              <span className="muted">Skills linked to your employee profile</span>
            </div>
          </div>

          <div className="alt-card hover-lift slide-up" style={{ gridColumn: '1 / -1' }}>
            <h3 className="icon-title"><FaStar /> Ongoing Skills</h3>
            {ongoing && ongoing.length > 0 ? (
              <div className="alt-grid" style={{ marginTop: 6 }}>
                {ongoing.map(s => (
                  <div key={s.id} className="alt-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <ProgressCircle value={s.progress ?? 20} />
                    <div>
                      <h3 style={{ margin: 0 }}>{s.name}</h3>
                      <p className="muted" style={{ margin: '4px 0' }}>Tasks: {s.tasks?.filter(t => t.done).length || 0}/{s.tasks?.length || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No ongoing skills yet. Add from New Skills.</p>
            )}
          </div>

          <div className="alt-card hover-lift slide-up">
            <h3 className="icon-title"><FaStar /> Suggested Skills</h3>
            {suggestedSkills.length > 0 ? (
              <div className="chip-list" style={{ marginTop: 6 }}>
                {suggestedSkills.slice(0, 12).map(s => (
                  <span key={s.id} className="chip">{s.name}</span>
                ))}
              </div>
            ) : (
              <p>Great! You're already associated with all available skills.</p>
            )}
            <div className="card-footer">
              <span className="muted">Recommendations based on available catalog</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
