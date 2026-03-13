import { useState } from "react";

interface Props {
  showToast: (msg: string) => void;
}

function sdiv(a: number, b: number) {
  if (!b || !isFinite(b)) return NaN;
  const r = a / b;
  return isFinite(r) ? r : NaN;
}
function fmt$(n: number) {
  return "$" + Math.round(n).toLocaleString();
}
function fmtN(n: number, d = 1) {
  return n.toFixed(d);
}

const KPIS = [
  {
    id: "util",
    group: "Core Delivery",
    name: "Utilization Rate",
    formula: "Utilization = (Billable Hours / Available Hours) × 100",
    fields: [
      { id: "billable", label: "Billable Hours", ph: "e.g. 1200" },
      { id: "available", label: "Available Hours", ph: "e.g. 1600" },
    ],
    targets: { green: "≥ 80%", alert: "< 70%" },
    ex1: "Team 10: 1,200 / 1,600 = 75% — 40 hrs below target per person per quarter",
    ex2: "Solo: 140 / 176 = 79.5% — 1 billable day closes the gap",
    calc: (v: any) => {
      const r = sdiv(v.billable, v.available) * 100;
      const st = r >= 80 ? "green" : r >= 70 ? "gold" : "red";
      const note =
        r >= 80
          ? "✓ On target."
          : r >= 70
            ? `⚠ Below 80%. ~${Math.round((0.8 - r / 100) * v.available)} hrs gap.`
            : `✗ Critical. ${Math.round((0.8 - r / 100) * v.available)} hrs below target.`;
      return { value: fmtN(r), unit: "%", status: st, note };
    },
  },
  {
    id: "margin",
    group: "Core Delivery",
    name: "Delivery Margin",
    formula: "Margin = ((Revenue − Cost) / Revenue) × 100",
    fields: [
      { id: "revenue", label: "Revenue ($)", ph: "e.g. 1000000" },
      { id: "cost", label: "Cost ($)", ph: "e.g. 720000" },
    ],
    targets: { green: "≥ 28%", alert: "< 18%" },
    ex1: "$1M revenue, $720K cost = 28% — at floor; no headroom for overruns",
    ex2: "$5M revenue, $4.2M cost = 16% — $600K shortfall to 28% target",
    calc: (v: any) => {
      const r = sdiv(v.revenue - v.cost, v.revenue) * 100;
      const st = r >= 28 ? "green" : r >= 18 ? "gold" : "red";
      const gap = Math.round((0.28 - r / 100) * v.revenue);
      const note =
        r >= 28 ? "✓ Healthy margin." : `⚠ ${fmt$(gap)} gap to 28% floor.`;
      return { value: fmtN(r), unit: "%", status: st, note };
    },
  },
  {
    id: "velocity",
    group: "Core Delivery",
    name: "Sprint Velocity Index",
    formula: "Velocity Index = (Completed Points / Committed Points) × 100",
    fields: [
      { id: "completed", label: "Completed Story Points", ph: "e.g. 82" },
      { id: "committed", label: "Committed Story Points", ph: "e.g. 90" },
    ],
    targets: { green: "≥ 90%", alert: "< 75%" },
    ex1: "82 / 90 = 91.1% — healthy, within normal variance",
    ex2: "55 / 90 = 61.1% — delivery risk; root cause analysis required",
    calc: (v: any) => {
      const r = sdiv(v.completed, v.committed) * 100;
      const st = r >= 90 ? "green" : r >= 75 ? "gold" : "red";
      return {
        value: fmtN(r),
        unit: "%",
        status: st,
        note:
          r >= 90
            ? "✓ High predictability."
            : `⚠ ${fmtN(100 - r, 0)}% slippage.`,
      };
    },
  },
  {
    id: "cpi",
    group: "Core Delivery",
    name: "Cost Performance Index",
    formula: "CPI = Earned Value (EV) / Actual Cost (AC)",
    fields: [
      { id: "ev", label: "Earned Value ($)", ph: "e.g. 450000" },
      { id: "ac", label: "Actual Cost ($)", ph: "e.g. 500000" },
    ],
    targets: { green: "≥ 1.0", alert: "< 0.85" },
    ex1: "EV $450K / AC $500K = CPI 0.90 — for $2M project, EAC = $2.22M",
    ex2: "EV $1.2M / AC $1.1M = CPI 1.09 — under budget",
    calc: (v: any) => {
      const r = sdiv(v.ev, v.ac);
      const st = r >= 1.0 ? "green" : r >= 0.9 ? "gold" : "red";
      return {
        value: fmtN(r, 2),
        unit: "index",
        status: st,
        note:
          r >= 1.0
            ? "✓ On/under budget."
            : `⚠ Cost overrun ${fmtN((1 - r) * 100, 1)}%.`,
      };
    },
  },
  {
    id: "sla",
    group: "Core Delivery",
    name: "SLA Compliance Rate",
    formula: "SLA Compliance = (Met SLAs / Total SLAs) × 100",
    fields: [
      { id: "met", label: "SLAs Met", ph: "e.g. 94" },
      { id: "total", label: "Total SLAs", ph: "e.g. 100" },
    ],
    targets: { green: "≥ 98%", alert: "< 95%" },
    ex1: "94 / 100 = 94% — 6 breaches; review if systemic or random",
    ex2: "99 / 100 = 99% — 1 breach; document root cause",
    calc: (v: any) => {
      const r = sdiv(v.met, v.total) * 100;
      const st = r >= 98 ? "green" : r >= 95 ? "gold" : "red";
      return {
        value: fmtN(r),
        unit: "%",
        status: st,
        note:
          r >= 98 ? "✓ SLA targets met." : `⚠ ${v.total - v.met} SLA breaches.`,
      };
    },
  },
  {
    id: "spi",
    group: "Earned Value",
    name: "Schedule Performance Index",
    formula: "SPI = Earned Value (EV) / Planned Value (PV)",
    fields: [
      { id: "ev", label: "Earned Value — EV ($)", ph: "e.g. 420000" },
      { id: "pv", label: "Planned Value — PV ($)", ph: "e.g. 500000" },
    ],
    targets: { green: "≥ 1.0", alert: "< 0.85" },
    ex1: "EV $420K / PV $500K = SPI 0.84 — 16% behind",
    ex2: "EV $1.05M / PV $1M = SPI 1.05 — 5% ahead",
    calc: (v: any) => {
      const r = sdiv(v.ev, v.pv);
      const st = r >= 1.0 ? "green" : r >= 0.9 ? "gold" : "red";
      return {
        value: fmtN(r, 2),
        unit: "index",
        status: st,
        note:
          r >= 1.0
            ? "✓ On/ahead of schedule."
            : `⚠ ${fmtN((1 - r) * 100, 1)}% behind.`,
      };
    },
  },
  {
    id: "cfr",
    group: "Quality",
    name: "Change Failure Rate (DORA)",
    formula: "CFR = (Failed Deployments / Total Deployments) × 100",
    fields: [
      { id: "failed", label: "Failed / Rolled-back Deployments", ph: "e.g. 4" },
      { id: "total", label: "Total Deployments", ph: "e.g. 40" },
    ],
    targets: { green: "≤ 5% (DORA Elite)", alert: "> 15% (DORA Low)" },
    ex1: "4 rollbacks / 40 deployments = 10% CFR — High DORA band",
    ex2: "2 / 80 = 2.5% CFR — Elite DORA band",
    calc: (v: any) => {
      const r = sdiv(v.failed, v.total) * 100;
      const band =
        r <= 5 ? "Elite" : r <= 10 ? "High" : r <= 15 ? "Medium" : "Low";
      const st = r <= 5 ? "green" : r <= 15 ? "gold" : "red";
      return {
        value: `${fmtN(r)} · ${band}`,
        unit: "(DORA band)",
        status: st,
        note:
          r <= 5
            ? "✓ Elite performer."
            : `⚠ ${band} band. ${v.failed} rollbacks.`,
      };
    },
  },
  {
    id: "attrition",
    group: "Team Health",
    name: "Team Attrition Rate",
    formula: "Attrition = (Voluntary Leavers / Avg Headcount) × 100",
    fields: [
      { id: "leavers", label: "Voluntary Leavers", ph: "e.g. 5" },
      { id: "hc", label: "Average Headcount", ph: "e.g. 80" },
      { id: "months", label: "Period (months)", ph: "e.g. 6" },
    ],
    targets: { green: "≤ 15% annualised", alert: "> 25%" },
    ex1: "5 leavers / 80 HC over 6 months = 12.5% annualised",
    ex2: "8 / 40 over 3 months = 80% annualised — crisis",
    calc: (v: any) => {
      const ann = ((sdiv(v.leavers, v.hc) * 100) / v.months) * 12;
      const st = ann <= 15 ? "green" : ann <= 25 ? "gold" : "red";
      return {
        value: fmtN(ann),
        unit: "% annualised",
        status: st,
        note:
          ann <= 15
            ? `✓ ${fmtN(ann)}% annualised — healthy.`
            : `⚠ ${fmtN(ann)}% — above benchmark.`,
      };
    },
  },
  {
    id: "pi_pred",
    group: "Agile Flow",
    name: "PI Predictability",
    formula: "PI Predictability = (Actual PI Points / Planned PI Points) × 100",
    fields: [
      { id: "actual", label: "Actual PI Points Delivered", ph: "e.g. 85" },
      { id: "planned", label: "Planned PI Points", ph: "e.g. 100" },
    ],
    targets: { green: "≥ 80% (SAFe)", alert: "< 60%" },
    ex1: "85 actual / 100 planned = 85% — meets SAFe target",
    ex2: "55 / 100 = 55% — below threshold",
    calc: (v: any) => {
      const r = sdiv(v.actual, v.planned) * 100;
      const st = r >= 80 ? "green" : r >= 60 ? "gold" : "red";
      return {
        value: fmtN(r, 0),
        unit: "%",
        status: st,
        note:
          r >= 80
            ? `✓ PI Predictability ${fmtN(r, 0)}% — meets SAFe target.`
            : `⚠ ${fmtN(r, 0)}% — below 80% SAFe target.`,
      };
    },
  },
];

type KpiResult = {
  value: string;
  unit: string;
  status: string;
  note: string;
} | null;

export default function KpiTab({ showToast }: Props) {
  const [activeKpi, setActiveKpi] = useState("util");
  const [inputs, setInputs] = useState<Record<string, Record<string, string>>>(
    {},
  );
  const [results, setResults] = useState<Record<string, KpiResult>>({});

  const setInput = (kpiId: string, fieldId: string, val: string) => {
    setInputs((prev) => ({
      ...prev,
      [kpiId]: { ...(prev[kpiId] || {}), [fieldId]: val },
    }));
  };

  const calc = (kpiId: string) => {
    const kpi = KPIS.find((k) => k.id === kpiId);
    if (!kpi) return;
    const vals: Record<string, number> = {};
    for (const f of kpi.fields) {
      const raw = (inputs[kpiId] || {})[f.id];
      if (!raw && raw !== "0") {
        showToast("Fill in all fields");
        return;
      }
      const v = parseFloat(raw);
      if (isNaN(v) || v < 0) {
        showToast("Enter valid numeric values");
        return;
      }
      vals[f.id] = v;
    }
    try {
      const r = kpi.calc(vals);
      setResults((prev) => ({ ...prev, [kpiId]: r }));
    } catch {
      showToast("Calculation error");
    }
  };

  const active = KPIS.find((k) => k.id === activeKpi)!;
  const colMap: Record<string, string> = {
    green: "var(--green)",
    gold: "var(--gold)",
    red: "var(--red)",
  };

  let lastGroup = "";
  return (
    <div>
      <div className="tab-intro">
        <h2>📊 KPI Engine</h2>
        <p>
          9 interactive calculators. Enter actuals → get result +
          interpretation.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginBottom: "16px",
        }}
      >
        {KPIS.map((k) => {
          const showG = k.group !== lastGroup;
          if (showG) lastGroup = k.group;
          return (
            <span key={k.id}>
              {showG && (
                <span
                  style={{
                    width: "100%",
                    display: "block",
                    fontSize: "9px",
                    color: "var(--sub)",
                    textTransform: "uppercase",
                    letterSpacing: ".7px",
                    fontWeight: 600,
                    margin: "6px 0 3px",
                    paddingTop: "4px",
                    borderTop: "1px solid var(--border-c)",
                  }}
                >
                  {k.group}
                </span>
              )}
              <button
                className={`chip${activeKpi === k.id ? " sel" : ""}`}
                onClick={() => setActiveKpi(k.id)}
                style={{ fontSize: "11px" }}
                data-testid={`kpi-btn-${k.id}`}
              >
                {k.name}
              </button>
            </span>
          );
        })}
      </div>

      <div className="g2">
        <div className="ak-card">
          <div className="ak-card-title">🧮 Calculator</div>
          <div className="formula-chip">{active.formula}</div>
          {active.fields.map((f) => (
            <div key={f.id} className="ak-field">
              <div className="ak-label">{f.label}</div>
              <input
                className="ak-inp"
                type="number"
                placeholder={f.ph}
                value={(inputs[activeKpi] || {})[f.id] || ""}
                onChange={(e) => setInput(activeKpi, f.id, e.target.value)}
                inputMode="decimal"
                data-testid={`kpi-inp-${activeKpi}-${f.id}`}
              />
            </div>
          ))}
          <button
            className="ak-btn-primary"
            style={{ marginTop: "4px" }}
            onClick={() => calc(activeKpi)}
            data-testid={`kpi-calc-${activeKpi}`}
          >
            Calculate →
          </button>
          {results[activeKpi] && (
            <div
              className="result-box"
              style={{
                borderColor:
                  colMap[results[activeKpi]!.status] || "var(--blue)",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: colMap[results[activeKpi]!.status] || "var(--blue)",
                }}
              >
                {results[activeKpi]!.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--sub)",
                  marginTop: "2px",
                }}
              >
                {results[activeKpi]!.unit}
              </div>
              <div
                style={{ marginTop: "8px", fontSize: "12px", lineHeight: 1.6 }}
              >
                {results[activeKpi]!.note}
              </div>
            </div>
          )}
        </div>
        <div className="ak-card">
          <div className="ak-card-title">📚 Benchmarks & Examples</div>
          <table className="ak-table">
            <thead>
              <tr>
                <th>Threshold</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Target (Green)</td>
                <td style={{ color: "var(--green)" }}>
                  {active.targets.green}
                </td>
                <td style={{ color: "var(--green)" }}>✓ On track</td>
              </tr>
              <tr>
                <td>Alert (Red)</td>
                <td style={{ color: "var(--red)" }}>{active.targets.alert}</td>
                <td style={{ color: "var(--red)" }}>✗ Escalate</td>
              </tr>
            </tbody>
          </table>
          <div className="ex-box" style={{ marginTop: "10px" }}>
            <strong>Ex 1:</strong> {active.ex1}
            <br />
            <strong>Ex 2:</strong> {active.ex2}
          </div>
        </div>
      </div>
    </div>
  );
}
