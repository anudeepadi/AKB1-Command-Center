import { motion } from "framer-motion";
import type { BootstrapData, ModuleId, NavigationItem, RoadmapItem } from "@shared/contracts";

interface Props {
  data?: BootstrapData;
  isLoading: boolean;
  onLaunch: (moduleId?: ModuleId) => void;
}

function flattenModules(data?: BootstrapData): NavigationItem[] {
  return data?.sections.flatMap((section) => section.items) ?? [];
}

function roadmapClass(status: RoadmapItem["status"]) {
  if (status === "ready") return "tone-success";
  if (status === "next") return "tone-warning";
  return "tone-muted";
}

export default function HomePage({ data, isLoading, onLaunch }: Props) {
  const modules = flattenModules(data);

  return (
    <div className="dashboard-page">
      <div className="dashboard-ambient" aria-hidden="true" />

      <section className="dashboard-hero">
        <motion.div
          className="dashboard-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="status-dot blue" />
          Gemini API workspace · SQLite-backed persistence · Railway-ready packaging
        </motion.div>

        <motion.h1
          className="dashboard-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          Build the shell first.
          <br />
          Then let every tool inherit it cleanly.
        </motion.h1>

        <motion.p
          className="dashboard-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          The backend now owns navigation, dashboard framing, Gemini chat history, and local persistence. This page shows the current build surface and gives you a clean entry into the workbench.
        </motion.p>

        <motion.div
          className="dashboard-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <button className="dashboard-primary" onClick={() => onLaunch("brief")} data-testid="hero-launch">
            Open Workbench
          </button>
          <button className="dashboard-secondary" onClick={() => onLaunch("claude")}>
            Open Gemini Workspace
          </button>
        </motion.div>

        <div className="dashboard-inline-meta">
          <span>{data?.identity.provider || "Gemini API Key"}</span>
          <span>{data?.identity.environment || "SQLite + Gemini"}</span>
          <span>{isLoading ? "Loading workspace..." : `${modules.length} modules online`}</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-main-column">
          <div className="overview-card">
            <div className="overview-card-header">
              <div>
                <div className="overview-eyebrow">Workspace telemetry</div>
                <h2 className="overview-title">What is built right now</h2>
              </div>
              <div className="overview-meta">
                {data?.generatedAt ? `Updated ${new Date(data.generatedAt).toLocaleTimeString()}` : "Awaiting bootstrap"}
              </div>
            </div>

            <div className="stat-grid">
              {(data?.stats ?? []).map((stat) => (
                <div key={stat.label} className={`stat-card tone-${stat.tone}`}>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-detail">{stat.detail}</div>
                </div>
              ))}

              {isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={`loading-${index}`} className="stat-card is-loading" />
                ))}
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-card-header">
              <div>
                <div className="overview-eyebrow">Build focus</div>
                <h2 className="overview-title">What needs to be built and kept consistent</h2>
              </div>
            </div>

            <div className="priority-grid">
              {(data?.highlights ?? []).map((highlight) => (
                <article key={highlight.title} className={`priority-card tone-${highlight.tone}`}>
                  <div className="priority-title">{highlight.title}</div>
                  <p>{highlight.body}</p>
                  <span>{highlight.detail}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-card-header">
              <div>
                <div className="overview-eyebrow">Module surface</div>
                <h2 className="overview-title">Every tool now sits inside one UI system</h2>
              </div>
              <button className="dashboard-secondary" onClick={() => onLaunch("brief")}>
                Open all modules
              </button>
            </div>

            <div className="module-grid">
              {modules.map((module) => (
                <button
                  key={module.id}
                  className={`module-card tone-${module.accent}`}
                  onClick={() => onLaunch(module.id)}
                  data-testid={`launch-${module.id}`}
                >
                  <div className="module-card-top">
                    <span className="module-icon">{module.icon}</span>
                    <span className="module-status">{module.availability}</span>
                  </div>
                  <div className="module-name">{module.label}</div>
                  <p className="module-desc">{module.description}</p>
                  <span className="module-section">{module.section}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="dashboard-side-column">
          <div className="overview-card">
            <div className="overview-card-header">
              <div>
                <div className="overview-eyebrow">Recent activity</div>
                <h2 className="overview-title">Persisted chat sessions</h2>
              </div>
            </div>

            <div className="session-stack">
              {(data?.recentSessions ?? []).length === 0 && (
                <div className="session-empty">
                  No persisted chats yet. Open the assistant and the backend will store sessions in SQLite.
                </div>
              )}

              {(data?.recentSessions ?? []).map((session) => (
                <button key={session.id} className="session-card" onClick={() => onLaunch("claude")}>
                  <div className="session-card-top">
                    <span>{session.title}</span>
                    <span>{session.messageCount} msgs</span>
                  </div>
                  <p>{session.preview}</p>
                  <span>{new Date(session.updatedAt).toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-card-header">
              <div>
                <div className="overview-eyebrow">Migration runway</div>
                <h2 className="overview-title">What comes next</h2>
              </div>
            </div>

            <div className="roadmap-list">
              {(data?.roadmap ?? []).map((item) => (
                <article key={item.title} className={`roadmap-item ${roadmapClass(item.status)}`}>
                  <div className="roadmap-title-row">
                    <span className="roadmap-title">{item.title}</span>
                    <span className="roadmap-pill">{item.status}</span>
                  </div>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
