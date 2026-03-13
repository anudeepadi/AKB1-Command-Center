import { useEffect, useRef, useState } from "react";
import { useToolDraft } from "@/hooks/use-tool-draft";
interface Props {
  showToast: (msg: string) => void;
}
interface StatusDraft {
  name: string;
  period: string;
  rag: string;
  done: string;
  next: string;
  risks: string;
  metrics: string;
  decisions: string;
  output: string;
}
export default function StatusTab({ showToast }: Props) {
  const hydrated = useRef(false);
  const { draft, isReady, saveDraft } = useToolDraft<StatusDraft>("status", {
    name: "",
    period: "",
    rag: "a",
    done: "",
    next: "",
    risks: "",
    metrics: "",
    decisions: "",
    output: "",
  });
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("");
  const [rag, setRag] = useState("a");
  const [done, setDone] = useState("");
  const [next, setNext] = useState("");
  const [risks, setRisks] = useState("");
  const [metrics, setMetrics] = useState("");
  const [decisions, setDecisions] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!isReady || hydrated.current) return;

    setName(draft.name ?? "");
    setPeriod(draft.period ?? "");
    setRag(draft.rag ?? "a");
    setDone(draft.done ?? "");
    setNext(draft.next ?? "");
    setRisks(draft.risks ?? "");
    setMetrics(draft.metrics ?? "");
    setDecisions(draft.decisions ?? "");
    setOutput(draft.output ?? "");
    hydrated.current = true;
  }, [draft, isReady]);

  useEffect(() => {
    if (!hydrated.current) return;

    const timer = window.setTimeout(() => {
      saveDraft({
        name,
        period,
        rag,
        done,
        next,
        risks,
        metrics,
        decisions,
        output,
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [
    decisions,
    done,
    metrics,
    name,
    next,
    output,
    period,
    rag,
    risks,
    saveDraft,
  ]);

  const gen = () => {
    const ragE = {
      r: "🔴 RED — Immediate Attention Required",
      a: "🟡 AMBER — Monitor Closely",
      g: "🟢 GREEN — On Track",
    }[rag];
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const lines = (txt: string) =>
      txt
        .split(/[,;\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => "▸ " + s)
        .join("\n");
    const out =
      "━".repeat(52) +
      "\nDELIVERY STATUS REPORT\n" +
      (name || "[Program Name]") +
      "\nPeriod: " +
      (period || "[Period]") +
      "  |  Generated: " +
      today +
      "\n" +
      "━".repeat(52) +
      "\n\nOVERALL STATUS: " +
      ragE +
      "\n\n" +
      "─".repeat(40) +
      "\nACCOMPLISHED THIS PERIOD\n" +
      "─".repeat(40) +
      "\n" +
      lines(done || "No updates.") +
      "\n\n" +
      "─".repeat(40) +
      "\nIN PROGRESS / NEXT PERIOD\n" +
      "─".repeat(40) +
      "\n" +
      lines(next || "No updates.") +
      "\n\n" +
      "─".repeat(40) +
      "\nRISKS & BLOCKERS\n" +
      "─".repeat(40) +
      "\n" +
      lines(risks || "None identified.") +
      "\n\n" +
      (metrics
        ? "─".repeat(40) +
          "\nKEY METRICS\n" +
          "─".repeat(40) +
          "\n" +
          metrics
            .split(",")
            .map((s) => "📊 " + s.trim())
            .join("\n") +
          "\n\n"
        : "") +
      "─".repeat(40) +
      "\nDECISIONS REQUIRED\n" +
      "─".repeat(40) +
      "\n" +
      lines(decisions || "None required.") +
      "\n\n" +
      "━".repeat(52) +
      "\nPrepared by: Adi Kompalli  |  " +
      today +
      "\n" +
      "━".repeat(52);
    setOutput(out);
  };
  const copy = () => {
    try {
      navigator.clipboard.writeText(output);
    } catch {}
    showToast("✓ Status report copied");
  };
  const ragCfg = {
    r: {
      lbl: "🔴 RED",
      cls: "active-r",
      baseCol: "rgba(248,81,73,.15)",
      active: "var(--red)",
    },
    a: {
      lbl: "🟡 AMBER",
      cls: "active-a",
      baseCol: "rgba(227,179,65,.15)",
      active: "var(--gold)",
    },
    g: {
      lbl: "🟢 GREEN",
      cls: "active-g",
      baseCol: "rgba(63,185,80,.15)",
      active: "var(--green)",
    },
  };
  return (
    <div>
      <div className="tab-intro">
        <h2>📋 Status Report</h2>
        <p>One-click executive delivery status report generator.</p>
      </div>
      <div className="g2">
        <div className="ak-card">
          <div className="ak-card-title">✏ Inputs</div>
          {[
            [
              "Program / Project Name",
              name,
              setName,
              "e.g. AI Platform Migration Phase 2",
            ],
            [
              "Reporting Period",
              period,
              setPeriod,
              "e.g. Sprint 14 · Mar 10–24, 2026",
            ],
            [
              "Key Metrics",
              metrics,
              setMetrics,
              "e.g. Velocity: 88pts, Utilization: 82%, SLA: 99%",
            ],
            [
              "Decisions Required",
              decisions,
              setDecisions,
              "e.g. Approve go/no-go for prod deployment by Mar 17",
            ],
          ].map(([l, v, s, ph]) => (
            <div key={l as string} className="ak-field">
              <div className="ak-label">{l as string}</div>
              <input
                className="ak-inp"
                value={v as string}
                onChange={(e) => (s as any)(e.target.value)}
                placeholder={ph as string}
              />
            </div>
          ))}
          <div className="ak-field">
            <div className="ak-label">Overall RAG Status</div>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["r", "a", "g"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setRag(k)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "5px",
                    border: `2px solid ${rag === k ? ragCfg[k].active : "transparent"}`,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: ragCfg[k].baseCol,
                    color: ragCfg[k].active,
                  }}
                >
                  {ragCfg[k].lbl}
                </button>
              ))}
            </div>
          </div>
          {[
            [
              "Accomplished This Period",
              done,
              setDone,
              "e.g. API gateway deployed; UAT signoff received",
            ],
            [
              "In Progress / Next Period",
              next,
              setNext,
              "e.g. Data pipeline migration; Performance testing",
            ],
            [
              "Risks & Blockers",
              risks,
              setRisks,
              "e.g. Infra provisioning delayed 1 week",
            ],
          ].map(([l, v, s, ph]) => (
            <div key={l as string} className="ak-field">
              <div className="ak-label">{l as string}</div>
              <textarea
                className="ak-ta"
                value={v as string}
                onChange={(e) => (s as any)(e.target.value)}
                placeholder={ph as string}
              />
            </div>
          ))}
          <button
            className="ak-btn-primary"
            onClick={gen}
            data-testid="button-gen-status"
          >
            Generate Report →
          </button>
        </div>
        <div className="ak-card" style={{ margin: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div className="ak-card-title" style={{ margin: 0 }}>
              📄 Generated Report
            </div>
            {output && (
              <button className="ak-btn-secondary" onClick={copy}>
                Copy
              </button>
            )}
          </div>
          {!output && (
            <div
              style={{
                color: "var(--sub)",
                fontSize: "12px",
                padding: "20px 0",
                textAlign: "center",
              }}
            >
              Report will appear here...
            </div>
          )}
          {output && (
            <pre
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border-c)",
                borderRadius: "6px",
                padding: "14px",
                fontSize: "11px",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                color: "var(--text)",
                overflowX: "auto",
              }}
            >
              {output}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
