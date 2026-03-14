import { motion } from "framer-motion";
import type { ModuleId } from "@shared/contracts";

interface Props {
  data?: unknown;
  isLoading: boolean;
  onLaunch: (moduleId?: ModuleId) => void;
}

const TICKER_MODULES = [
  "KPI Engine",
  "Risk Matrix",
  "Sprint Planner",
  "Claude AI",
  "Prompt Lab",
  "Pricing Calc",
  "Decision Matrix",
  "Status Report",
  "Estimation",
  "AI Arsenal",
];

const STATS = [
  { value: "11", label: "Tool Modules" },
  { value: "9", label: "KPI Engines" },
  { value: "AI", label: "Claude Powered" },
  { value: "v2", label: "Bloomberg Mode" },
];

const FEATURES = [
  {
    icon: "📊",
    name: "9 KPI Calculators",
    description:
      "Utilization, margin, velocity, CPI, SLA, SPI, CFR, attrition — live formulas with industry benchmarks",
  },
  {
    icon: "◆",
    name: "Claude AI Terminal",
    description:
      "Streaming claude-opus-4-5 calibrated with AKB1's delivery system prompt. Real answers, zero fluff",
  },
  {
    icon: "⚠",
    name: "Risk Heat Map",
    description:
      "Interactive 5×5 probability × impact matrix. Add, track, and export your live risk register",
  },
  {
    icon: "💡",
    name: "Prompt Builder",
    description:
      "Assemble precision prompts from role → task → format → cheat codes. Copy-paste ready",
  },
  {
    icon: "📅",
    name: "Sprint & PI Planner",
    description:
      "SAFe-aligned PI capacity calculator with team parameters, velocity, and innovation buffer",
  },
  {
    icon: "💰",
    name: "Pricing Calculator",
    description:
      "Bill rate derivation, T&M vs fixed price comparison, and full team cost modelling",
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function HomePage({ onLaunch }: Props) {
  const tickerText = TICKER_MODULES.join(" · ");

  return (
    <div className="landing-page">
      <div className="landing-ambient" aria-hidden="true" />

      {/* ── Hero ── */}
      <section className="landing-hero">
        <motion.div
          className="landing-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="status-dot green" />
          AKB1 Command Center · Bloomberg Mode · v2.0
        </motion.div>

        <motion.h1
          className="landing-headline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.5 }}
        >
          The Operating System
          <br />
          for Elite Delivery Leaders
        </motion.h1>

        <motion.p
          className="landing-subheadline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
        >
          Bloomberg-style command center with 11 live calculators, real-time Claude AI, and a
          curated prompt toolkit — built for Senior PMs, RTEs, and CTOs who operate at enterprise
          scale.
        </motion.p>

        <motion.div
          className="landing-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5 }}
        >
          <button
            className="landing-btn-primary"
            onClick={() => onLaunch("brief")}
            data-testid="hero-launch"
          >
            ▶ Launch Terminal
          </button>
          <a href="#terminal-preview" className="landing-btn-ghost">
            ◎ See it live
          </a>
        </motion.div>

        <motion.div
          className="landing-stats"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {STATS.map((stat) => (
            <motion.div key={stat.label} className="landing-stat-card" variants={fadeUp}>
              <span className="landing-stat-value">{stat.value}</span>
              <span className="landing-stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Ticker ── */}
      <div className="landing-ticker" aria-label="Module names scrolling">
        <div className="landing-ticker-track">
          <span>{tickerText} · {tickerText} · {tickerText} · </span>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="landing-section">
        <motion.div
          className="landing-section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="landing-eyebrow">What&apos;s inside</span>
          <h2 className="landing-section-title">Every tool you actually need</h2>
          <p className="landing-section-sub">
            Not a generic PM dashboard. Purpose-built for delivery leadership — each module is tuned
            to enterprise delivery, SAFe at scale, and AI-augmented operations.
          </p>
        </motion.div>

        <motion.div
          className="landing-features-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {FEATURES.map((feature) => (
            <motion.article key={feature.name} className="landing-feature-card" variants={fadeUp}>
              <span className="landing-feature-icon">{feature.icon}</span>
              <h3 className="landing-feature-name">{feature.name}</h3>
              <p className="landing-feature-desc">{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ── Terminal Preview ── */}
      <section className="landing-section" id="terminal-preview">
        <motion.div
          className="landing-section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="landing-eyebrow">The Interface</span>
          <h2 className="landing-section-title">Bloomberg-grade command experience</h2>
          <p className="landing-section-sub">
            Dark terminal aesthetic. Sidebar navigation. Live Claude AI panel. Command palette.
            Every module a keystroke away.
          </p>
        </motion.div>

        <motion.div
          className="landing-preview-window"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="preview-titlebar">
            <div className="preview-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="preview-titlebar-text">AKB1 Command Center — KPI Engine</span>
          </div>
          <div className="preview-body">
            <div className="preview-sidebar">
              <div className="preview-sidebar-label">MODULES</div>
              {["Brief", "KPI", "Risk", "Sprint", "Claude AI", "Prompt", "Pricing"].map(
                (name, i) => (
                  <div key={name} className={`preview-sidebar-item${i === 1 ? " active" : ""}`}>
                    {name}
                  </div>
                ),
              )}
            </div>
            <div className="preview-main">
              <div className="preview-header-row">
                <span className="preview-module-title">KPI Engine</span>
                <span className="preview-pill">9 calculators</span>
              </div>
              <div className="preview-kpi-grid">
                {[
                  { label: "Utilization", value: "87.3%", trend: "↑" },
                  { label: "Velocity", value: "42 pts", trend: "→" },
                  { label: "CPI", value: "1.08", trend: "↑" },
                  { label: "SPI", value: "0.96", trend: "↓" },
                  { label: "CFR", value: "2.1%", trend: "↑" },
                  { label: "Margin", value: "34.2%", trend: "→" },
                ].map((kpi) => (
                  <div key={kpi.label} className="preview-kpi-cell">
                    <span className="preview-kpi-label">{kpi.label}</span>
                    <span className="preview-kpi-value">
                      {kpi.value} <span className="preview-kpi-trend">{kpi.trend}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="preview-claude-panel">
              <div className="preview-claude-header">Claude AI</div>
              <div className="preview-claude-msg assistant">Based on your current CPI of 1.08 and SPI of 0.96, the project is under budget but slightly behind schedule...</div>
              <div className="preview-claude-msg user">What&apos;s the recovery plan?</div>
              <div className="preview-claude-input">Ask Claude anything...</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="landing-footer-cta">
        <motion.h2
          className="landing-footer-headline"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          Ready to operate at Bloomberg speed?
        </motion.h2>
        <motion.p
          className="landing-footer-sub"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.06, duration: 0.5 }}
        >
          11 modules. One interface. Zero wasted clicks.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.12, duration: 0.5 }}
        >
          <button
            className="landing-btn-primary"
            onClick={() => onLaunch("brief")}
          >
            Open Terminal →
          </button>
        </motion.div>
      </section>
    </div>
  );
}
