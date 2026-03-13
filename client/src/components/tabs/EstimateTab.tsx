import { useState } from "react";
interface Props {
  showToast: (msg: string) => void;
}
function fmtN(n: number, d = 1) {
  return n.toFixed(d);
}
function fmt$(n: number) {
  return "$" + Math.round(n).toLocaleString();
}
export default function EstimateTab({ showToast }: Props) {
  const [tab, setTab] = useState("pert");
  const [O, setO] = useState("");
  const [M, setM] = useState("");
  const [P, setP] = useState("");
  const [dpw, setDpw] = useState("5");
  const [pertResult, setPertResult] = useState<any>(null);
  const [tsVals, setTsVals] = useState({
    xs: "0",
    s: "0",
    m: "0",
    l: "0",
    xl: "0",
    xxl: "0",
    vel: "",
  });
  const [tsResult, setTsResult] = useState<any>(null);
  const [fc, setFc] = useState({
    pts: "",
    vel: "",
    slen: "2",
    team: "",
    cost: "",
  });
  const [fcResult, setFcResult] = useState<any>(null);
  const calcPERT = () => {
    const o = parseFloat(O);
    const m = parseFloat(M);
    const p = parseFloat(P);
    const d = parseFloat(dpw) || 5;
    if (isNaN(o) || isNaN(m) || isNaN(p) || o <= 0 || m <= 0 || p <= 0) {
      showToast("Enter all 3 duration values");
      return;
    }
    if (o > m || m > p) {
      showToast("Must be: Optimistic ≤ Most Likely ≤ Pessimistic");
      return;
    }
    const E = (o + 4 * m + p) / 6;
    const sigma = (p - o) / 6;
    const wks = (d2: number) => fmtN(d2 / d, 1);
    setPertResult({
      E,
      sigma,
      c80: E + 0.84 * sigma,
      c90: E + 1.28 * sigma,
      c95: E + 1.65 * sigma,
      wks,
      o,
      m,
      p,
    });
  };
  const calcTshirt = () => {
    const sizes = [
      ["xs", 1],
      ["s", 3],
      ["m", 5],
      ["l", 8],
      ["xl", 13],
      ["xxl", 21],
    ] as [string, number][];
    let totalPts = 0;
    let totalItems = 0;
    const breakdown: { id: string; cnt: number; pts: number; sub: number }[] =
      [];
    sizes.forEach(([id, pts]) => {
      const cnt = parseInt((tsVals as any)[id]) || 0;
      totalPts += cnt * pts;
      totalItems += cnt;
      if (cnt > 0)
        breakdown.push({ id: id.toUpperCase(), cnt, pts, sub: cnt * pts });
    });
    if (!totalItems) {
      showToast("Enter at least one item count");
      return;
    }
    const vel = parseInt(tsVals.vel) || 0;
    setTsResult({
      totalPts,
      totalItems,
      avgPts: fmtN(totalPts / totalItems, 1),
      sprints: vel ? fmtN(totalPts / vel, 1) : "N/A",
      vel,
      breakdown,
    });
  };
  const calcForecast = () => {
    const pts = parseInt(fc.pts) || 0;
    const vel = parseInt(fc.vel) || 0;
    const slen = parseInt(fc.slen) || 2;
    const team = parseInt(fc.team) || 0;
    const costFTE = parseFloat(fc.cost) || 0;
    if (!pts || !vel) {
      showToast("Enter backlog points and velocity");
      return;
    }
    const sprints = pts / vel;
    const weeks = sprints * slen;
    const months = weeks / 4.33;
    const cost = costFTE && team ? Math.round(team * costFTE * months) : null;
    setFcResult({
      sprints,
      weeks,
      months,
      cost,
      team,
      costFTE,
      vel,
      slen,
      pts,
    });
  };
  const TABS = [
    ["pert", "PERT 3-Point"],
    ["tshirt", "T-Shirt Sizing"],
    ["forecast", "Delivery Forecast"],
  ];
  return (
    <div>
      <div className="tab-intro">
        <h2>🧮 Estimation Engine</h2>
        <p>
          PERT 3-point estimation, T-shirt sizing, and delivery forecast
          calculator.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {TABS.map(([id, label]) => (
          <button
            key={id}
            className={`chip${tab === id ? " sel" : ""}`}
            onClick={() => setTab(id)}
            style={{ fontSize: "12px" }}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "pert" && (
        <div className="g2">
          <div className="ak-card">
            <div className="ak-card-title">🧮 PERT 3-Point Estimator</div>
            <div className="formula-chip">
              E = (O + 4M + P) / 6 &nbsp;&nbsp; σ = (P − O) / 6
            </div>
            {[
              ["Optimistic Duration (days)", O, setO],
              ["Most Likely Duration (days)", M, setM],
              ["Pessimistic Duration (days)", P, setP],
              ["Working Days per Week", dpw, setDpw],
            ].map(([l, v, s]) => (
              <div key={l as string} className="ak-field">
                <div className="ak-label">{l as string}</div>
                <input
                  className="ak-inp"
                  type="number"
                  value={v as string}
                  onChange={(e) => (s as any)(e.target.value)}
                  inputMode="decimal"
                />
              </div>
            ))}
            <button
              className="ak-btn-primary"
              onClick={calcPERT}
              data-testid="button-calc-pert"
            >
              Calculate PERT →
            </button>
            {pertResult && (
              <div
                className="result-box"
                style={{ borderColor: "var(--green)", marginTop: "12px" }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--sub)",
                        textTransform: "uppercase",
                      }}
                    >
                      PERT Expected
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "var(--green)",
                      }}
                    >
                      {fmtN(pertResult.E, 1)} days
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--sub)" }}>
                      {pertResult.wks(pertResult.E)} wks · σ ={" "}
                      {fmtN(pertResult.sigma, 1)}d
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--sub)",
                        textTransform: "uppercase",
                      }}
                    >
                      Std Range (68%)
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "var(--blue)",
                      }}
                    >
                      {fmtN(pertResult.E - pertResult.sigma, 1)} –{" "}
                      {fmtN(pertResult.E + pertResult.sigma, 1)} d
                    </div>
                  </div>
                </div>
                <table className="ak-table">
                  <thead>
                    <tr>
                      <th>Confidence</th>
                      <th>Days</th>
                      <th>Weeks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ color: "var(--green)" }}>80%</td>
                      <td>{fmtN(pertResult.c80, 1)}</td>
                      <td>{pertResult.wks(pertResult.c80)}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "var(--gold)" }}>90%</td>
                      <td>{fmtN(pertResult.c90, 1)}</td>
                      <td>{pertResult.wks(pertResult.c90)}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "var(--red)" }}>95%</td>
                      <td>{fmtN(pertResult.c95, 1)}</td>
                      <td>{pertResult.wks(pertResult.c95)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="ak-card">
            <div className="ak-card-title">📚 PERT Reference</div>
            <table className="ak-table">
              <thead>
                <tr>
                  <th>Confidence</th>
                  <th>Formula</th>
                  <th>Use For</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["68% (1σ)", "E ± σ", "Standard range"],
                  ["80%", "E + 0.84σ", "Internal planning"],
                  ["90%", "E + 1.28σ", "Client commitment"],
                  ["95%", "E + 1.65σ", "Fixed-price contract"],
                ].map(([c, f, u]) => (
                  <tr key={c as string}>
                    <td>{c}</td>
                    <td
                      style={{
                        color: "var(--cyan)",
                        fontFamily: "monospace",
                        fontSize: "11px",
                      }}
                    >
                      {f}
                    </td>
                    <td style={{ color: "var(--sub)", fontSize: "11px" }}>
                      {u}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ex-box" style={{ marginTop: "10px" }}>
              <strong>Enterprise use:</strong> Accenture uses PERT-based sizing
              on fixed-price bids to set contractual commitment at 90th
              percentile, protecting 15–20% margin from scope variance.
            </div>
          </div>
        </div>
      )}
      {tab === "tshirt" && (
        <div className="g2">
          <div className="ak-card">
            <div className="ak-card-title">👕 T-Shirt to Story Points</div>
            <div className="formula-chip">
              XS=1pt S=3pt M=5pt L=8pt XL=13pt XXL=21pt
            </div>
            <div className="g2" style={{ gap: "8px" }}>
              {[
                ["xs", "XS (1pt)"],
                ["s", "S (3pt)"],
                ["m", "M (5pt)"],
                ["l", "L (8pt)"],
                ["xl", "XL (13pt)"],
                ["xxl", "XXL (21pt)"],
              ].map(([id, label]) => (
                <div key={id} className="ak-field">
                  <div className="ak-label">{label}</div>
                  <input
                    className="ak-inp"
                    type="number"
                    value={(tsVals as any)[id]}
                    onChange={(e) =>
                      setTsVals((p) => ({ ...p, [id]: e.target.value }))
                    }
                    inputMode="numeric"
                  />
                </div>
              ))}
            </div>
            <div className="ak-field">
              <div className="ak-label">Team Sprint Velocity (pts/sprint)</div>
              <input
                className="ak-inp"
                type="number"
                value={tsVals.vel}
                onChange={(e) =>
                  setTsVals((p) => ({ ...p, vel: e.target.value }))
                }
                placeholder="e.g. 40"
                inputMode="numeric"
              />
            </div>
            <button
              className="ak-btn-primary"
              onClick={calcTshirt}
              data-testid="button-calc-tshirt"
            >
              Convert →
            </button>
            {tsResult && (
              <div className="result-box">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--sub)",
                        textTransform: "uppercase",
                      }}
                    >
                      Total Story Points
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "var(--blue)",
                      }}
                    >
                      {tsResult.totalPts}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--sub)" }}>
                      {tsResult.totalItems} items · avg {tsResult.avgPts} pts
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--sub)",
                        textTransform: "uppercase",
                      }}
                    >
                      Estimated Sprints
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "var(--cyan)",
                      }}
                    >
                      {tsResult.sprints}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--sub)" }}>
                      {tsResult.vel
                        ? `at ${tsResult.vel} pts/sprint`
                        : "enter velocity"}
                    </div>
                  </div>
                </div>
                <table className="ak-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Count</th>
                      <th>Points</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tsResult.breakdown.map((b: any) => (
                      <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.cnt}</td>
                        <td style={{ color: "var(--blue)" }}>{b.sub}</td>
                        <td style={{ color: "var(--sub)" }}>
                          {fmtN((b.sub / tsResult.totalPts) * 100, 0)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="ak-card">
            <div className="ak-card-title">📚 Sizing Reference</div>
            <table className="ak-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Pts</th>
                  <th>Effort Signal</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["XS", "1", "< 2 hrs", "Same day"],
                  ["S", "3", "Half-day", "1–2 days"],
                  ["M", "5", "1–2 days", "2–3 days"],
                  ["L", "8", "3–4 days", "3–5 days"],
                  ["XL", "13", "1 week", "5–7 days; split candidate"],
                  ["XXL", "21", "> 1 week", "Must split before sprint"],
                ].map(([sz, pts, e, d]) => (
                  <tr key={sz as string}>
                    <td>{sz}</td>
                    <td>{pts}</td>
                    <td style={{ color: "var(--sub)", fontSize: "11px" }}>
                      {e}
                    </td>
                    <td style={{ color: "var(--sub)", fontSize: "11px" }}>
                      {d}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === "forecast" && (
        <div className="g2">
          <div className="ak-card">
            <div className="ak-card-title">📈 Delivery Forecast</div>
            <div className="formula-chip">
              Sprints = Backlog Pts / Velocity &nbsp;&nbsp; Weeks = Sprints ×
              Sprint Length
            </div>
            {[
              [
                "Total Backlog Story Points",
                fc.pts,
                (v: string) => setFc((p) => ({ ...p, pts: v })),
                "e.g. 240",
              ],
              [
                "Team Sprint Velocity (pts/sprint)",
                fc.vel,
                (v: string) => setFc((p) => ({ ...p, vel: v })),
                "e.g. 40",
              ],
              [
                "Sprint Length (weeks)",
                fc.slen,
                (v: string) => setFc((p) => ({ ...p, slen: v })),
                "2",
              ],
              [
                "Team Size (FTEs)",
                fc.team,
                (v: string) => setFc((p) => ({ ...p, team: v })),
                "e.g. 8",
              ],
              [
                "Monthly Cost per FTE ($)",
                fc.cost,
                (v: string) => setFc((p) => ({ ...p, cost: v })),
                "e.g. 8000",
              ],
            ].map(([l, v, s, ph]) => (
              <div key={l as string} className="ak-field">
                <div className="ak-label">{l as string}</div>
                <input
                  className="ak-inp"
                  type="number"
                  value={v as string}
                  onChange={(e) => (s as any)(e.target.value)}
                  placeholder={ph as string}
                  inputMode="decimal"
                />
              </div>
            ))}
            <button
              className="ak-btn-primary"
              onClick={calcForecast}
              data-testid="button-calc-forecast"
            >
              Forecast →
            </button>
            {fcResult && (
              <div className="result-box">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--sub)",
                        textTransform: "uppercase",
                      }}
                    >
                      Duration
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "var(--green)",
                      }}
                    >
                      {fmtN(fcResult.weeks, 1)} wks
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--sub)" }}>
                      {fmtN(fcResult.sprints, 1)} sprints ·{" "}
                      {fmtN(fcResult.months, 1)} mo
                    </div>
                  </div>
                  {fcResult.cost && (
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "var(--sub)",
                          textTransform: "uppercase",
                        }}
                      >
                        Est. Team Cost
                      </div>
                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: 700,
                          color: "var(--gold)",
                        }}
                      >
                        {fmt$(fcResult.cost)}
                      </div>
                    </div>
                  )}
                </div>
                <table className="ak-table">
                  <thead>
                    <tr>
                      <th>Scenario</th>
                      <th>Sprints</th>
                      <th>Weeks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ color: "var(--green)" }}>
                        Optimistic (+10%)
                      </td>
                      <td>{fmtN(fcResult.pts / (fcResult.vel * 1.1), 1)}</td>
                      <td>
                        {fmtN(
                          (fcResult.pts / (fcResult.vel * 1.1)) * fcResult.slen,
                          1,
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ color: "var(--gold)" }}>Base</td>
                      <td>{fmtN(fcResult.sprints, 1)}</td>
                      <td>{fmtN(fcResult.weeks, 1)}</td>
                    </tr>
                    <tr>
                      <td style={{ color: "var(--red)" }}>
                        Conservative (−20%)
                      </td>
                      <td>{fmtN(fcResult.pts / (fcResult.vel * 0.8), 1)}</td>
                      <td>
                        {fmtN(
                          (fcResult.pts / (fcResult.vel * 0.8)) * fcResult.slen,
                          1,
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Fixed-price (+20%)</td>
                      <td>{fmtN(fcResult.sprints * 1.2, 1)}</td>
                      <td>{fmtN(fcResult.weeks * 1.2, 1)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="ak-card">
            <div className="ak-card-title">📚 Forecast Reference</div>
            <table className="ak-table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Adjustment</th>
                  <th>Use When</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Optimistic",
                    "Velocity × 1.1",
                    "Known team, stable scope",
                    "var(--green)",
                  ],
                  [
                    "Base",
                    "Velocity as-is",
                    "Standard planning",
                    "var(--gold)",
                  ],
                  [
                    "Conservative",
                    "Velocity × 0.8",
                    "New team or unclear reqs",
                    "var(--red)",
                  ],
                  [
                    "Fixed-price",
                    "Add 20% buffer",
                    "Contractual commitment",
                    "var(--text)",
                  ],
                ].map(([s, a, u, c]) => (
                  <tr key={s as string}>
                    <td style={{ color: c as string }}>{s}</td>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: "11px",
                        color: "var(--cyan)",
                      }}
                    >
                      {a}
                    </td>
                    <td style={{ color: "var(--sub)", fontSize: "11px" }}>
                      {u}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ex-box" style={{ marginTop: "10px" }}>
              <strong>TCS benchmark:</strong> 240-point backlog at 40pts/sprint
              = 6 sprints = 12 weeks at 8 FTEs. At $8K/FTE/month = $192K
              delivery cost.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
