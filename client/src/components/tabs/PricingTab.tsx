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
export default function PricingTab({ showToast }: Props) {
  const [tab, setTab] = useState("billrate");
  const [br, setBr] = useState({
    cost: "",
    days: "22",
    hrs: "8",
    oh: "20",
    margin: "28",
  });
  const [brResult, setBrResult] = useState<any>(null);
  const [tm, setTm] = useState({
    days: "",
    rate: "",
    margin: "28",
    buf: "15",
    variance: "20",
  });
  const [tmResult, setTmResult] = useState<any>(null);
  const [tc, setTc] = useState({
    sr: "3",
    src: "9000",
    mid: "6",
    midc: "5500",
    jr: "6",
    jrc: "3000",
    oh: "20",
    margin: "28",
  });
  const [tcResult, setTcResult] = useState<any>(null);
  const calcBR = () => {
    const cost = parseFloat(br.cost) || 0;
    const days = parseFloat(br.days) || 22;
    const hrs = parseFloat(br.hrs) || 8;
    const oh = parseFloat(br.oh) || 20;
    const margin = parseFloat(br.margin) || 28;
    if (!cost) {
      showToast("Enter monthly cost");
      return;
    }
    if (margin >= 100) {
      showToast("Margin must be below 100%");
      return;
    }
    const totalCost = cost * (1 + oh / 100);
    const dayRate = totalCost / days / (1 - margin / 100);
    const hrRate = dayRate / hrs;
    setBrResult({ cost, totalCost, dayRate, hrRate, oh, margin, days });
  };
  const calcTM = () => {
    const eDays = parseFloat(tm.days) || 0;
    const rate = parseFloat(tm.rate) || 0;
    const margin = parseFloat(tm.margin) || 28;
    const buf = parseFloat(tm.buf) || 15;
    const variance = parseFloat(tm.variance) || 20;
    if (!eDays || !rate) {
      showToast("Enter effort and day rate");
      return;
    }
    if (margin >= 100) {
      showToast("Margin must be below 100%");
      return;
    }
    const tmRev = eDays * rate;
    const estCost = tmRev * (1 - margin / 100);
    const fpBase = estCost / (1 - margin / 100);
    const fpWithBuf = fpBase * (1 + buf / 100);
    const fpMargin = ((fpWithBuf - estCost) / fpWithBuf) * 100;
    setTmResult({
      tmRev,
      estCost,
      fpWithBuf,
      fpMargin,
      buf,
      margin,
      eDays,
      rate,
      variance,
      tmBest: tmRev * (1 - variance / 100),
      tmWorst: tmRev * (1 + variance / 100),
    });
  };
  const calcTC = () => {
    const sr = parseInt(tc.sr) || 0;
    const src = parseFloat(tc.src) || 0;
    const mid = parseInt(tc.mid) || 0;
    const midc = parseFloat(tc.midc) || 0;
    const jr = parseInt(tc.jr) || 0;
    const jrc = parseFloat(tc.jrc) || 0;
    const oh = parseFloat(tc.oh) || 20;
    const tgtMargin = parseFloat(tc.margin) || 28;
    const totalHC = sr + mid + jr;
    if (!totalHC) {
      showToast("Enter at least one team level");
      return;
    }
    if (tgtMargin >= 100) {
      showToast("Margin must be below 100%");
      return;
    }
    const peopleCost = sr * src + mid * midc + jr * jrc;
    const totalCost = peopleCost * (1 + oh / 100);
    const reqRevMonth = totalCost / (1 - tgtMargin / 100);
    const reqRevYear = reqRevMonth * 12;
    const rphActual = reqRevYear / totalHC;
    const blendedRate = peopleCost / totalHC;
    const leverage = sr > 0 ? (mid + jr) / sr : 0;
    setTcResult({
      totalHC,
      sr,
      mid,
      jr,
      peopleCost,
      totalCost,
      reqRevMonth,
      reqRevYear,
      rphActual,
      blendedRate,
      leverage,
      oh,
      tgtMargin,
    });
  };
  const TABS = [
    ["billrate", "Bill Rate"],
    ["tm", "T&M vs Fixed Price"],
    ["teamcost", "Team Cost"],
  ];
  return (
    <div>
      <div className="tab-intro">
        <h2>💰 Pricing Calculator</h2>
        <p>
          Bill rate derivation, T&M vs Fixed Price comparison, and team cost
          modelling.
        </p>
      </div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`chip${tab === id ? " sel" : ""}`}
            style={{
              fontSize: "12px",
              borderColor: tab === id ? "var(--gold)" : undefined,
              color: tab === id ? "var(--gold)" : undefined,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "billrate" && (
        <div className="g2">
          <div className="ak-card">
            <div className="ak-card-title">💰 Bill Rate Calculator</div>
            <div className="formula-chip">
              Bill Rate = (Cost × (1 + Overhead%)) / (1 − Target Margin%)
            </div>
            {[
              [
                "Monthly Cost per Person ($)",
                br.cost,
                (v: string) => setBr((p) => ({ ...p, cost: v })),
                "e.g. 6000",
              ],
              [
                "Working Days / Month",
                br.days,
                (v: string) => setBr((p) => ({ ...p, days: v })),
                "22",
              ],
              [
                "Working Hours / Day",
                br.hrs,
                (v: string) => setBr((p) => ({ ...p, hrs: v })),
                "8",
              ],
              [
                "Overhead %",
                br.oh,
                (v: string) => setBr((p) => ({ ...p, oh: v })),
                "20",
              ],
              [
                "Target Delivery Margin %",
                br.margin,
                (v: string) => setBr((p) => ({ ...p, margin: v })),
                "28",
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
              onClick={calcBR}
              data-testid="button-calc-billrate"
            >
              Calculate →
            </button>
            {brResult && (
              <div
                className="result-box"
                style={{ borderColor: "var(--gold)" }}
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
                      Day Rate
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "var(--gold)",
                      }}
                    >
                      {fmt$(brResult.dayRate)}
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
                      Hour Rate
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "var(--gold)",
                      }}
                    >
                      {fmt$(brResult.hrRate)}
                    </div>
                  </div>
                </div>
                <table className="ak-table">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Monthly Cost</td>
                      <td>{fmt$(brResult.cost)}</td>
                    </tr>
                    <tr>
                      <td>Overhead ({brResult.oh}%)</td>
                      <td>{fmt$((brResult.cost * brResult.oh) / 100)}</td>
                    </tr>
                    <tr>
                      <td>Total Loaded Cost</td>
                      <td style={{ color: "var(--gold)" }}>
                        {fmt$(brResult.totalCost)}
                      </td>
                    </tr>
                    <tr>
                      <td>Target Margin</td>
                      <td style={{ color: "var(--green)" }}>
                        {brResult.margin}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="ak-card">
            <div className="ak-card-title">📚 Bill Rate Benchmarks</div>
            <table className="ak-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>India ($/hr)</th>
                  <th>US ($/hr)</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Junior Dev", "$25–$40", "$80–$110", "30–40%"],
                  ["Mid Dev / BA", "$40–$65", "$110–$140", "25–35%"],
                  ["Senior / Lead", "$65–$100", "$140–$180", "20–30%"],
                  ["Architect", "$90–$130", "$170–$220", "18–28%"],
                  ["PM / Scrum Master", "$55–$90", "$130–$170", "22–32%"],
                ].map(([r, i, u, m]) => (
                  <tr key={r as string}>
                    <td>{r}</td>
                    <td style={{ color: "var(--cyan)" }}>{i}</td>
                    <td style={{ color: "var(--gold)" }}>{u}</td>
                    <td style={{ color: "var(--sub)", fontSize: "11px" }}>
                      {m}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === "tm" && (
        <div className="g2">
          <div className="ak-card">
            <div className="ak-card-title">⚖ T&M vs Fixed Price Comparison</div>
            {[
              [
                "Estimated Effort (person-days)",
                tm.days,
                (v: string) => setTm((p) => ({ ...p, days: v })),
                "e.g. 500",
              ],
              [
                "Blended Day Rate ($/day)",
                tm.rate,
                (v: string) => setTm((p) => ({ ...p, rate: v })),
                "e.g. 600",
              ],
              [
                "Target Margin % (Fixed Price)",
                tm.margin,
                (v: string) => setTm((p) => ({ ...p, margin: v })),
                "28",
              ],
              [
                "Risk Buffer % (Fixed Price)",
                tm.buf,
                (v: string) => setTm((p) => ({ ...p, buf: v })),
                "15",
              ],
              [
                "Likely Scope Variance % (±)",
                tm.variance,
                (v: string) => setTm((p) => ({ ...p, variance: v })),
                "20",
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
              onClick={calcTM}
              data-testid="button-calc-tm"
            >
              Compare Models →
            </button>
            {tmResult && (
              <div
                className="result-box"
                style={{ borderColor: "var(--blue)" }}
              >
                <table className="ak-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>T&M</th>
                      <th>Fixed Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Quoted Price</td>
                      <td>{fmt$(tmResult.tmRev)} (est)</td>
                      <td style={{ color: "var(--gold)" }}>
                        {fmt$(tmResult.fpWithBuf)}
                      </td>
                    </tr>
                    <tr>
                      <td>Gross Margin</td>
                      <td style={{ color: "var(--green)" }}>
                        {tmResult.margin}% (locked)
                      </td>
                      <td style={{ color: "var(--gold)" }}>
                        {fmtN(tmResult.fpMargin)}% (w/ buffer)
                      </td>
                    </tr>
                    <tr>
                      <td>Risk Scenario</td>
                      <td style={{ color: "var(--red)" }}>
                        {fmt$(tmResult.tmBest)} – {fmt$(tmResult.tmWorst)}
                      </td>
                      <td style={{ color: "var(--green)" }}>
                        Capped at {fmt$(tmResult.fpWithBuf)}
                      </td>
                    </tr>
                    <tr>
                      <td>Buffer</td>
                      <td style={{ color: "var(--red)" }}>
                        None — client adjusts
                      </td>
                      <td style={{ color: "var(--green)" }}>
                        {tmResult.buf}% risk buffer
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="ex-box" style={{ marginTop: "10px" }}>
                  Difference:{" "}
                  <strong>{fmt$(tmResult.fpWithBuf - tmResult.tmRev)}</strong>{" "}
                  (~{fmtN((tmResult.fpWithBuf / tmResult.tmRev - 1) * 100, 0)}%
                  premium for certainty)
                </div>
              </div>
            )}
          </div>
          <div className="ak-card">
            <div className="ak-card-title">📚 Model Selection Guide</div>
            <table className="ak-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>T&M</th>
                  <th>Fixed Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Scope clarity", "Low → High", "Must be high"],
                  ["Client risk", "Client bears", "Vendor bears"],
                  ["Vendor margin", "Predictable", "Variable"],
                  ["Change requests", "Easy to absorb", "Require CCR"],
                  ["Best for", "Discovery, Agile", "Defined outcomes"],
                ].map(([f, t, fp]) => (
                  <tr key={f as string}>
                    <td>{f}</td>
                    <td style={{ color: "var(--green)", fontSize: "11px" }}>
                      {t}
                    </td>
                    <td style={{ color: "var(--gold)", fontSize: "11px" }}>
                      {fp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ex-box" style={{ marginTop: "10px" }}>
              <strong>Infosys rule:</strong> Fixed-price bids add 15% risk
              buffer on top of target margin. Contracts over $5M require board
              sign-off on buffer adequacy.
            </div>
          </div>
        </div>
      )}
      {tab === "teamcost" && (
        <div className="g2">
          <div className="ak-card">
            <div className="ak-card-title">👥 Team Cost & Revenue Model</div>
            {[
              [
                "Senior / Lead FTEs",
                tc.sr,
                (v: string) => setTc((p) => ({ ...p, sr: v })),
              ],
              [
                "Senior Monthly Cost/FTE ($)",
                tc.src,
                (v: string) => setTc((p) => ({ ...p, src: v })),
              ],
              [
                "Mid-level FTEs",
                tc.mid,
                (v: string) => setTc((p) => ({ ...p, mid: v })),
              ],
              [
                "Mid Monthly Cost/FTE ($)",
                tc.midc,
                (v: string) => setTc((p) => ({ ...p, midc: v })),
              ],
              [
                "Junior FTEs",
                tc.jr,
                (v: string) => setTc((p) => ({ ...p, jr: v })),
              ],
              [
                "Junior Monthly Cost/FTE ($)",
                tc.jrc,
                (v: string) => setTc((p) => ({ ...p, jrc: v })),
              ],
              [
                "Overhead %",
                tc.oh,
                (v: string) => setTc((p) => ({ ...p, oh: v })),
              ],
              [
                "Target Margin %",
                tc.margin,
                (v: string) => setTc((p) => ({ ...p, margin: v })),
              ],
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
              onClick={calcTC}
              data-testid="button-calc-teamcost"
            >
              Model Team Economics →
            </button>
            {tcResult && (
              <div
                className="result-box"
                style={{ borderColor: "var(--green)" }}
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
                      Monthly Burn
                    </div>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "var(--red)",
                      }}
                    >
                      {fmt$(tcResult.totalCost)}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--sub)" }}>
                      loaded cost (+{tcResult.oh}% OH)
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
                      Required Revenue
                    </div>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "var(--green)",
                      }}
                    >
                      {fmt$(tcResult.reqRevMonth)}/mo
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--sub)" }}>
                      for {tcResult.tgtMargin}% margin
                    </div>
                  </div>
                </div>
                <table className="ak-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Value</th>
                      <th>Benchmark</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Headcount</td>
                      <td>{tcResult.totalHC} FTEs</td>
                      <td style={{ color: "var(--sub)", fontSize: "10px" }}>
                        Sr:{tcResult.sr} / Mid:{tcResult.mid} / Jr:{tcResult.jr}
                      </td>
                    </tr>
                    <tr>
                      <td>Revenue/FTE/Year</td>
                      <td
                        style={{
                          color:
                            tcResult.rphActual >= 150000
                              ? "var(--green)"
                              : tcResult.rphActual >= 100000
                                ? "var(--gold)"
                                : "var(--red)",
                        }}
                      >
                        {fmt$(tcResult.rphActual)}
                      </td>
                      <td style={{ color: "var(--green)", fontSize: "11px" }}>
                        ≥ $150K benchmark
                      </td>
                    </tr>
                    <tr>
                      <td>Pyramid Leverage</td>
                      <td
                        style={{
                          color:
                            tcResult.leverage >= 3
                              ? "var(--green)"
                              : tcResult.leverage >= 2
                                ? "var(--gold)"
                                : "var(--red)",
                        }}
                      >
                        {fmtN(tcResult.leverage, 1)}:1
                      </td>
                      <td style={{ color: "var(--green)", fontSize: "11px" }}>
                        ≥ 3:1 target
                      </td>
                    </tr>
                    <tr>
                      <td>Blended Cost/FTE/Mo</td>
                      <td>{fmt$(tcResult.blendedRate)}</td>
                      <td>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="ak-card">
            <div className="ak-card-title">📚 IT Services Benchmarks</div>
            <table className="ak-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Target</th>
                  <th>Alert</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Revenue / FTE / yr", "≥ $150K", "< $100K"],
                  ["People cost % of revenue", "55–65%", "> 72%"],
                  ["Pyramid leverage", "≥ 3:1 (Jr:Sr)", "< 2:1"],
                  ["Bench %", "≤ 5%", "> 10%"],
                  ["Overhead % of revenue", "≤ 12%", "> 18%"],
                ].map(([m, t, a]) => (
                  <tr key={m as string}>
                    <td>{m}</td>
                    <td style={{ color: "var(--green)" }}>{t}</td>
                    <td style={{ color: "var(--red)" }}>{a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
