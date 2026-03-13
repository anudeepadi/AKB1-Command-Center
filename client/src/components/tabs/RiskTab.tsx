import React, { useEffect, useRef, useState } from "react";
import { useToolDraft } from "@/hooks/use-tool-draft";
interface Props {
  showToast: (msg: string) => void;
}
interface Risk {
  id: number;
  desc: string;
  prob: number;
  impact: number;
  score: number;
  owner: string;
  mitig: string;
  col: { bg: string; tx: string; label: string };
}
interface RiskDraft {
  risks: Risk[];
  desc: string;
  prob: string;
  impact: string;
  owner: string;
  mitig: string;
}
function riskCol(s: number) {
  if (s >= 20) return { bg: "#8b0000", tx: "#ff9999", label: "CRITICAL" };
  if (s >= 12) return { bg: "rgba(248,81,73,.75)", tx: "#fff", label: "HIGH" };
  if (s >= 6)
    return { bg: "rgba(227,179,65,.75)", tx: "#000", label: "MEDIUM" };
  return { bg: "rgba(63,185,80,.6)", tx: "#fff", label: "LOW" };
}
export default function RiskTab({ showToast }: Props) {
  const hydrated = useRef(false);
  const { draft, isReady, saveDraft } = useToolDraft<RiskDraft>("risk", {
    risks: [],
    desc: "",
    prob: "3",
    impact: "3",
    owner: "",
    mitig: "",
  });
  const [risks, setRisks] = useState<Risk[]>([]);
  const [desc, setDesc] = useState("");
  const [prob, setProb] = useState("3");
  const [impact, setImpact] = useState("3");
  const [owner, setOwner] = useState("");
  const [mitig, setMitig] = useState("");

  useEffect(() => {
    if (!isReady || hydrated.current) return;

    setRisks(draft.risks ?? []);
    setDesc(draft.desc ?? "");
    setProb(draft.prob ?? "3");
    setImpact(draft.impact ?? "3");
    setOwner(draft.owner ?? "");
    setMitig(draft.mitig ?? "");
    hydrated.current = true;
  }, [draft, isReady]);

  useEffect(() => {
    if (!hydrated.current) return;

    const timer = window.setTimeout(() => {
      saveDraft({ risks, desc, prob, impact, owner, mitig });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [desc, impact, mitig, owner, prob, risks, saveDraft]);

  const addRisk = () => {
    if (!desc.trim()) {
      showToast("Enter risk description");
      return;
    }
    const p = parseInt(prob);
    const i = parseInt(impact);
    if (p < 1 || p > 5 || i < 1 || i > 5) {
      showToast("Probability and Impact must be 1–5");
      return;
    }
    const score = p * i;
    setRisks((prev) => [
      ...prev,
      {
        id: Date.now(),
        desc,
        prob: p,
        impact: i,
        score,
        owner: owner || "Unassigned",
        mitig: mitig || "TBD",
        col: riskCol(score),
      },
    ]);
    setDesc("");
    setOwner("");
    setMitig("");
    showToast(`✓ Risk added (score: ${score})`);
  };
  const removeRisk = (id: number) =>
    setRisks((prev) => prev.filter((r) => r.id !== id));
  const exportRisks = () => {
    if (!risks.length) {
      showToast("No risks to export");
      return;
    }
    const sorted = [...risks].sort((a, b) => b.score - a.score);
    const txt =
      "RISK REGISTER\n" +
      "=".repeat(60) +
      "\n" +
      sorted
        .map(
          (r, i) =>
            `${i + 1}. [${r.col.label} · ${r.score}] ${r.desc}\n   P:${r.prob} x I:${r.impact} | Owner: ${r.owner} | Mitigation: ${r.mitig}`,
        )
        .join("\n\n");
    try {
      navigator.clipboard.writeText(txt);
    } catch {}
    showToast("✓ Risk register copied");
  };
  const impL = ["1-Minor", "2-Mod", "3-Signif", "4-Major", "5-Critical"];
  const probL = ["1-Rare", "2-Unlikely", "3-Possible", "4-Likely", "5-Certain"];
  return (
    <div>
      <div className="tab-intro">
        <h2>⚠ Risk Matrix</h2>
        <p>5×5 probability × impact heat map + risk register.</p>
      </div>
      <div className="g2">
        <div className="ak-card">
          <div className="ak-card-title">
            🗺 Heat Map — click cell to pre-fill
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "var(--sub)",
              marginBottom: "6px",
            }}
          >
            Y: Probability (5=Almost Certain) · X: Impact (5=Critical)
          </div>
          <div className="rgrid">
            <div className="rlbl" />
            {impL.map((l) => (
              <div key={l} className="rlbl" style={{ fontSize: "8px" }}>
                {l}
              </div>
            ))}
            {[5, 4, 3, 2, 1].map((p) => (
              <React.Fragment key={`row-${p}`}>
                <div className="raxis">{probL[p - 1]}</div>
                {[1, 2, 3, 4, 5].map((i) => {
                  const score = p * i;
                  const c = riskCol(score);
                  const cnt = risks.filter(
                    (r) => r.prob === p && r.impact === i,
                  ).length;
                  return (
                    <div
                      key={`${p}-${i}`}
                      className="rc"
                      style={{ background: c.bg, color: c.tx }}
                      onClick={() => {
                        setProb(String(p));
                        setImpact(String(i));
                      }}
                      title={`P:${p} x I:${i} = ${score} (${c.label})`}
                    >
                      <div style={{ textAlign: "center", lineHeight: 1.2 }}>
                        <div style={{ fontSize: "10px", fontWeight: 600 }}>
                          {score}
                        </div>
                        {cnt > 0 && (
                          <div style={{ fontSize: "9px" }}>
                            {"●".repeat(Math.min(cnt, 3))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "8px",
            }}
          >
            {[
              ["#3fb950", "Low"],
              ["#e3b341", "Medium"],
              ["rgba(248,81,73,.75)", "High"],
              ["#8b0000", "Critical"],
            ].map(([bg, label]) => (
              <span
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "10px",
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 2,
                    background: bg,
                    display: "inline-block",
                  }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="ak-card">
          <div className="ak-card-title">➕ Add Risk</div>
          {[
            [
              "Risk Description",
              desc,
              setDesc,
              "e.g. Key architect leaving mid-PI",
            ],
            ["Owner", owner, setOwner, "e.g. Delivery Lead"],
            ["Mitigation", mitig, setMitig, "e.g. Backup resource identified"],
          ].map(([l, v, s, ph]) => (
            <div key={l as string} className="ak-field">
              <div className="ak-label">{l as string}</div>
              <input
                className="ak-inp"
                value={v as string}
                onChange={(e) => (s as any)(e.target.value)}
                placeholder={ph as string}
                data-testid={`risk-${(l as string).toLowerCase().replace(/ /g, "-")}`}
              />
            </div>
          ))}
          <div className="g2" style={{ gap: "8px" }}>
            {[
              ["Probability (1–5)", prob, setProb],
              ["Impact (1–5)", impact, setImpact],
            ].map(([l, v, s]) => (
              <div key={l as string} className="ak-field">
                <div className="ak-label">{l as string}</div>
                <input
                  className="ak-inp"
                  type="number"
                  min="1"
                  max="5"
                  value={v as string}
                  onChange={(e) => (s as any)(e.target.value)}
                  inputMode="numeric"
                />
              </div>
            ))}
          </div>
          <button
            className="ak-btn-primary"
            onClick={addRisk}
            data-testid="button-add-risk"
          >
            Add to Register →
          </button>
        </div>
      </div>
      <div className="ak-card" style={{ marginTop: "14px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div className="ak-card-title" style={{ margin: 0 }}>
            📋 Risk Register{" "}
            <span style={{ color: "var(--sub)", fontWeight: 400 }}>
              ({risks.length})
            </span>
          </div>
          <button className="ak-btn-secondary" onClick={exportRisks}>
            Copy as Text
          </button>
        </div>
        {risks.length === 0 && (
          <p style={{ color: "var(--sub)", fontSize: "12px" }}>No risks yet.</p>
        )}
        {[...risks]
          .sort((a, b) => b.score - a.score)
          .map((r) => (
            <div
              key={r.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                padding: "8px 0",
                borderBottom: "1px solid var(--border-c)",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "2px",
                  }}
                >
                  <span
                    style={{
                      background: r.col.bg,
                      color: r.col.tx,
                      padding: "1px 6px",
                      borderRadius: "3px",
                      fontSize: "9px",
                      fontWeight: 700,
                    }}
                  >
                    {r.col.label} · {r.score}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 500 }}>
                    {r.desc}
                  </span>
                </div>
                <div style={{ fontSize: "10px", color: "var(--sub)" }}>
                  P:{r.prob} × I:{r.impact} · Owner: {r.owner} · Mitigation:{" "}
                  {r.mitig}
                </div>
              </div>
              <button
                onClick={() => removeRisk(r.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--red)",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "0 3px",
                }}
              >
                ×
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
