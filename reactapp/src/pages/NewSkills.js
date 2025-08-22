import React, { useMemo, useState, useEffect } from "react";
import "../styles/components.css";
import { authService } from "../services/authService";

const DEFAULT_SKILLS = [
  { id: 1, name: "JavaScript", category: "Programming", description: "Versatile language for web development (frontend and backend)." },
  { id: 2, name: "TypeScript", category: "Programming", description: "Typed superset of JavaScript for scalable apps." },
  { id: 3, name: "React", category: "Frontend", description: "Library for building UI with components and hooks." },
  { id: 4, name: "Redux", category: "Frontend", description: "State management for complex React apps." },
  { id: 5, name: "Next.js", category: "Frontend", description: "React framework with SSR/SSG and routing." },
  { id: 6, name: "Node.js", category: "Backend", description: "JavaScript runtime for building fast backend services." },
  { id: 7, name: "Express", category: "Backend", description: "Minimalist Node.js web framework." },
  { id: 8, name: "NestJS", category: "Backend", description: "Structured Node.js framework with TypeScript." },
  { id: 9, name: "Java", category: "Backend", description: "General-purpose language for enterprise apps." },
  { id: 10, name: "Spring Boot", category: "Backend", description: "Rapid Java-based backend development." },
  { id: 11, name: "Hibernate", category: "Backend", description: "ORM framework for Java persistence." },
  { id: 12, name: "Python", category: "Programming", description: "High-level language for scripting and data science." },
  { id: 13, name: "Django", category: "Backend", description: "Python web framework for rapid development." },
  { id: 14, name: "Flask", category: "Backend", description: "Lightweight Python web framework." },
  { id: 15, name: "FastAPI", category: "Backend", description: "High-performance Python API framework." },
  { id: 16, name: "C#", category: "Programming", description: "Language for .NET applications." },
  { id: 17, name: ".NET Core", category: "Backend", description: "Cross-platform framework for building services." },
  { id: 18, name: "Go", category: "Backend", description: "Compiled language for concurrent services." },
  { id: 19, name: "Rust", category: "Programming", description: "Memory-safe systems programming language." },
  { id: 20, name: "PHP", category: "Backend", description: "Scripting language for server-side apps." },
  { id: 21, name: "Laravel", category: "Backend", description: "Elegant PHP web framework." },
  { id: 22, name: "MySQL", category: "Database", description: "Relational database widely used in web apps." },
  { id: 23, name: "PostgreSQL", category: "Database", description: "Advanced open-source relational database." },
  { id: 24, name: "MongoDB", category: "Database", description: "NoSQL document database for flexible schemas." },
  { id: 25, name: "Redis", category: "Database", description: "In-memory data store for caching and queues." },
  { id: 26, name: "Kafka", category: "Messaging", description: "Distributed event streaming platform." },
  { id: 27, name: "RabbitMQ", category: "Messaging", description: "Message broker for reliable queues." },
  { id: 28, name: "Docker", category: "DevOps", description: "Containerization for consistent deployments." },
  { id: 29, name: "Kubernetes", category: "DevOps", description: "Orchestrates containers at scale." },
  { id: 30, name: "Terraform", category: "DevOps", description: "Infrastructure as Code for cloud resources." },
  { id: 31, name: "AWS", category: "Cloud", description: "Amazon cloud services." },
  { id: 32, name: "Azure", category: "Cloud", description: "Microsoft cloud platform." },
  { id: 33, name: "GCP", category: "Cloud", description: "Google Cloud Platform." },
  { id: 34, name: "CI/CD", category: "DevOps", description: "Automate builds, tests, and deployments." },
  { id: 35, name: "Git", category: "Tools", description: "Version control for code collaboration." },
  { id: 36, name: "GitHub Actions", category: "DevOps", description: "CI/CD workflows in GitHub." },
  { id: 37, name: "Jenkins", category: "DevOps", description: "Automation server for CI/CD." },
  { id: 38, name: "Nginx", category: "Infrastructure", description: "Web server and reverse proxy." },
  { id: 39, name: "Apache", category: "Infrastructure", description: "HTTP server for web apps." },
  { id: 40, name: "GraphQL", category: "API", description: "Query language for flexible APIs." },
  { id: 41, name: "REST", category: "API", description: "Standard for HTTP-based APIs." },
  { id: 42, name: "WebSockets", category: "API", description: "Real-time bidirectional communication." },
  { id: 43, name: "HTML5", category: "Frontend", description: "Markup standard for web content." },
  { id: 44, name: "CSS3", category: "Frontend", description: "Styling language for web pages." },
  { id: 45, name: "Sass", category: "Frontend", description: "CSS preprocessor for maintainable styles." },
  { id: 46, name: "Tailwind CSS", category: "Frontend", description: "Utility-first CSS framework." },
  { id: 47, name: "Bootstrap", category: "Frontend", description: "UI toolkit for responsive design." },
  { id: 48, name: "Framer Motion", category: "Frontend", description: "Animation library for React." },
  { id: 49, name: "Three.js", category: "Frontend", description: "3D graphics in the browser." },
  { id: 50, name: "Expo", category: "Mobile", description: "React Native toolchain for mobile apps." },
  { id: 51, name: "React Native", category: "Mobile", description: "Build native apps with React." },
  { id: 52, name: "Swift", category: "Mobile", description: "Language for iOS development." },
  { id: 53, name: "Kotlin", category: "Mobile", description: "Language for Android development." },
  { id: 54, name: "Flutter", category: "Mobile", description: "Cross-platform UI toolkit by Google." },
  { id: 55, name: "Unity", category: "Game Dev", description: "Game engine for 2D/3D games." },
  { id: 56, name: "Unreal Engine", category: "Game Dev", description: "AAA game engine by Epic." },
  { id: 57, name: "Figma", category: "Design", description: "Collaborative UI design tool." },
  { id: 58, name: "Adobe XD", category: "Design", description: "UI/UX design and prototyping." },
  { id: 59, name: "SEO", category: "Marketing", description: "Optimize websites for search engines." },
  { id: 60, name: "Analytics", category: "Marketing", description: "Interpret web and product data." },
  { id: 61, name: "A/B Testing", category: "Product", description: "Experimentation to improve outcomes." },
  { id: 62, name: "Product Management", category: "Product", description: "Plan and execute product strategy." },
  { id: 63, name: "Agile", category: "Process", description: "Iterative development methodology." },
  { id: 64, name: "Scrum", category: "Process", description: "Framework for Agile teams." },
  { id: 65, name: "Jira", category: "Tools", description: "Issue tracking and project management." },
  { id: 66, name: "Confluence", category: "Tools", description: "Documentation and collaboration." },
  { id: 67, name: "Microservices", category: "Architecture", description: "Distributed service-based architecture." },
  { id: 68, name: "Monorepo", category: "Architecture", description: "Single repo for multiple projects." },
  { id: 69, name: "Event Sourcing", category: "Architecture", description: "Persist events as source of truth." },
  { id: 70, name: "CQRS", category: "Architecture", description: "Separate commands from queries." },
  { id: 71, name: "Observability", category: "DevOps", description: "Logs, metrics, traces for insight." },
  { id: 72, name: "Prometheus", category: "DevOps", description: "Metrics monitoring system." },
  { id: 73, name: "Grafana", category: "DevOps", description: "Visualization for metrics." },
  { id: 74, name: "ELK Stack", category: "DevOps", description: "Elasticsearch, Logstash, Kibana." },
  { id: 75, name: "Sentry", category: "DevOps", description: "Error tracking and performance." },
  { id: 76, name: "Cypress", category: "Testing", description: "End-to-end testing for web." },
  { id: 77, name: "Jest", category: "Testing", description: "JavaScript testing framework." },
  { id: 78, name: "Playwright", category: "Testing", description: "Cross-browser automation/testing." },
  { id: 79, name: "Storybook", category: "Frontend", description: "UI component development environment." },
  { id: 80, name: "Web Accessibility", category: "Frontend", description: "Build inclusive, accessible web apps." },
  { id: 81, name: "Localization", category: "Frontend", description: "Internationalize apps for regions." },
  { id: 82, name: "Performance Tuning", category: "General", description: "Optimize speed and resource usage." },
  { id: 83, name: "Security Basics", category: "General", description: "Secure coding and practices." },
  { id: 84, name: "OAuth 2.0", category: "Security", description: "Authorization framework for APIs." },
  { id: 85, name: "OpenID Connect", category: "Security", description: "Identity layer on top of OAuth 2.0." },
  { id: 86, name: "JWT", category: "Security", description: "Token-based authentication." },
  { id: 87, name: "Data Modeling", category: "Database", description: "Design schemas for data." },
  { id: 88, name: "ETL", category: "Data", description: "Extract, Transform, Load pipelines." },
  { id: 89, name: "Pandas", category: "Data", description: "Python data analysis library." },
  { id: 90, name: "NumPy", category: "Data", description: "Numerical computing with arrays." },
  { id: 91, name: "Matplotlib", category: "Data", description: "Data visualization in Python." },
  { id: 92, name: "TensorFlow", category: "ML", description: "Deep learning framework by Google." },
  { id: 93, name: "PyTorch", category: "ML", description: "Deep learning framework by Meta." },
  { id: 94, name: "scikit-learn", category: "ML", description: "Machine learning in Python." },
  { id: 95, name: "LlamaIndex", category: "AI", description: "LLM data framework." },
  { id: 96, name: "LangChain", category: "AI", description: "LLM application framework." },
  { id: 97, name: "RAG", category: "AI", description: "Retrieval-Augmented Generation." },
  { id: 98, name: "Prompt Engineering", category: "AI", description: "Design prompts for LLMs." },
  { id: 99, name: "MLOps", category: "AI", description: "Deploy and operate ML systems." },
  { id: 100, name: "Data Engineering", category: "Data", description: "Build data pipelines and warehouses." },
];

function loadSkills() {
  try {
    const raw = localStorage.getItem('catalogSkills');
    return raw ? JSON.parse(raw) : DEFAULT_SKILLS;
  } catch { return DEFAULT_SKILLS; }
}
function saveSkills(list) {
  localStorage.setItem('catalogSkills', JSON.stringify(list));
}

function addToLocalSets(key, item, uniqueKey = 'id') {
  const raw = localStorage.getItem(key);
  const arr = raw ? JSON.parse(raw) : [];
  if (!arr.some(x => x[uniqueKey] === item[uniqueKey])) {
    arr.push(item);
    localStorage.setItem(key, JSON.stringify(arr));
  }
  return arr;
}

export default function NewSkills() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [skills, setSkills] = useState(DEFAULT_SKILLS);

  const isAdmin = authService.isAdmin();

  useEffect(() => {
    setSkills(loadSkills());
  }, []);

  const categories = useMemo(() => {
    const set = new Set(["All", ...skills.map(s => s.category)]);
    return Array.from(set);
  }, [skills]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter(s => {
      const okCategory = category === "All" || s.category === category;
      const okQuery = !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      return okCategory && okQuery;
    });
  }, [query, category, skills]);

  const handleAdd = (skill) => {
    addToLocalSets('mySkills', { id: skill.id, name: skill.name });
    addToLocalSets('ongoingSkills', { 
      id: skill.id,
      name: skill.name,
      progress: Math.floor(Math.random() * 40) + 10,
      tasks: [
        { id: 1, title: `Read intro to ${skill.name}`, done: Math.random() > 0.5 },
        { id: 2, title: `Finish a tutorial on ${skill.name}`, done: Math.random() > 0.5 },
        { id: 3, title: `Build a mini project with ${skill.name}`, done: false },
      ]
    });
    alert(`${skill.name} added to your skills and ongoing list!`);
  };

  const [newSkill, setNewSkill] = useState({ name: "", category: "Programming", description: "" });
  const handleAdminAdd = (e) => {
    e.preventDefault();
    const nextId = Math.max(...skills.map(s => s.id)) + 1;
    const created = { id: nextId, ...newSkill };
    const next = [...skills, created];
    setSkills(next);
    saveSkills(next);
    setNewSkill({ name: "", category: newSkill.category, description: "" });
  };

  return (
    <div className="page glass">
      <div className="alt-header">
        <h1 className="alt-title">Explore New Skills</h1>
      </div>

      {isAdmin && (
        <div className="alt-card" style={{ marginBottom: 16 }}>
          <h3 className="icon-title">Add a new catalog skill (Admin)</h3>
          <form className="glass-form" onSubmit={handleAdminAdd}>
            <input className="form-input" placeholder="Name" value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} required />
            <select className="themed-select" value={newSkill.category} onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}>
              {Array.from(new Set(["Programming","Frontend","Backend","Database","DevOps","Cloud","API","Mobile","Game Dev","Design","Marketing","Product","Process","Tools","Architecture","Data","ML","AI"]))
                .map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input className="form-input" placeholder="Short description" value={newSkill.description} onChange={e => setNewSkill({ ...newSkill, description: e.target.value })} required />
            <button className="glass-btn" type="submit">Add Skill</button>
          </form>
        </div>
      )}

      <div className="glass-form" style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-input"
          style={{ flex: 1 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="themed-select">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="alt-grid">
        {filtered.map(s => (
          <div key={s.id} className="alt-card hover-lift">
            <h3>{s.name}</h3>
            <p><em>{s.category}</em></p>
            <p>{s.description}</p>
            <button className="glass-btn" onClick={() => handleAdd(s)}>
              Add to My Skills
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
