const PROFILES = [
  {
    name: "Gemini 2.5 Flash",
    prov: "Default runtime",
    col: "var(--blue)",
    traits: [
      ["Reasoning depth", 92],
      ["Response speed", 90],
      ["Structured output", 91],
      ["Cost control", 95],
    ],
  },
  {
    name: "Gemini 2.0 Flash-Lite",
    prov: "Low-cost fallback",
    col: "var(--cyan)",
    traits: [
      ["Response speed", 96],
      ["Summarization", 84],
      ["Cost control", 99],
      ["Batch drafting", 88],
    ],
  },
  {
    name: "SQLite Session Memory",
    prov: "Local persistence",
    col: "var(--green)",
    traits: [
      ["Refresh resilience", 99],
      ["Draft retention", 97],
      ["Auditability", 90],
      ["Offline durability", 93],
    ],
  },
  {
    name: "Supabase Migration Path",
    prov: "Later phase",
    col: "var(--gold)",
    traits: [
      ["Realtime sync", 88],
      ["Auth handoff", 91],
      ["Collaboration scale", 89],
      ["Ops overhead", 70],
    ],
  },
];

const ROUTING = [
  [
    "Daily delivery chat",
    "Gemini 2.5 Flash",
    "Gemini 2.0 Flash-Lite",
    "Balanced reasoning with fast interactive replies",
  ],
  [
    "Executive status drafting",
    "Gemini 2.5 Flash",
    "SQLite Session Memory",
    "Structured markdown plus local history retention",
  ],
  [
    "Risk register refreshes",
    "SQLite Session Memory",
    "Gemini 2.5 Flash",
    "Persist data first, then refine with the model",
  ],
  [
    "Fast follow-up prompts",
    "Gemini 2.0 Flash-Lite",
    "Gemini 2.5 Flash",
    "Lower-cost burst handling for shorter prompts",
  ],
  [
    "Future auth + sync",
    "Supabase Migration Path",
    "SQLite Session Memory",
    "Keep local-first today and migrate once contracts settle",
  ],
];

export default function ArsenalTab() {
  return (
    <div>
      <div className="tab-intro">
        <h2>🤖 Gemini Stack</h2>
        <p>Gemini-first runtime profiles and local platform routing guide.</p>
      </div>
      <div className="g2" style={{ marginBottom: "14px" }}>
        {PROFILES.map((profile) => (
          <div
            key={profile.name}
            className="ak-card"
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: profile.col,
                }}
              >
                {profile.name}
              </div>
              <div style={{ fontSize: "10px", color: "var(--sub)" }}>
                {profile.prov}
              </div>
            </div>
            {(profile.traits as [string, number][]).map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "11px",
                  color: "var(--sub)",
                }}
              >
                <span style={{ minWidth: "140px" }}>{label}</span>
                <div
                  style={{
                    flex: 1,
                    height: "5px",
                    background: "var(--border-c)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "3px",
                      width: value + "%",
                      background: profile.col,
                    }}
                  />
                </div>
                <span
                  style={{
                    minWidth: "24px",
                    textAlign: "right",
                    fontSize: "11px",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="ak-card">
        <div className="ak-card-title">🎯 Runtime Routing Guide</div>
        <table className="ak-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Primary</th>
              <th>Secondary</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            {ROUTING.map(([task, primary, secondary, reason]) => (
              <tr key={task}>
                <td>{task}</td>
                <td style={{ color: "var(--blue)", fontWeight: 600 }}>
                  {primary}
                </td>
                <td style={{ color: "var(--sub)" }}>{secondary}</td>
                <td style={{ color: "var(--sub)", fontSize: "11px" }}>
                  {reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
