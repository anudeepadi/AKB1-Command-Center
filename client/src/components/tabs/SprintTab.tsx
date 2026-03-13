import { useState } from "react";
interface Props {
  showToast: (msg: string) => void;
}
function fmtN(n: number, d = 1) {
  return n.toFixed(d);
}
export default function SprintTab({ showToast }: Props) {
  const [team, setTeam] = useState("8");
  const [slen, setSlen] = useState("2");
  const [nspr, setNspr] = useState("5");
  const [cap, setCap] = useState("80");
  const [vel, setVel] = useState("6");
  const [buf, setBuf] = useState("10");
  const [result, setResult] = useState<any>(null);
  const calc = () => {
    const t = parseInt(team) || 0;
    const sl = parseInt(slen) || 2;
    const ns = parseInt(nspr) || 5;
    const c = parseFloat(cap) || 80;
    const v = parseFloat(vel) || 6;
    const b = parseFloat(buf) || 10;
    if (!t || !ns) {
      showToast("Enter team size and sprint count");
      return;
    }
    const ptsPerSpr = Math.round(t * v * (c / 100));
    const devSpr = ns - 1;
    const devPts = Math.round(ptsPerSpr * devSpr * (1 - b / 100));
    const ipPts = Math.round(ptsPerSpr * 0.5);
    const piWks = ns * sl;
    const hrsPerSpr = Math.round(t * sl * 5 * 8 * (c / 100));
    const sprints = Array.from({ length: ns }, (_, i) => {
      const isIP = i === ns - 1;
      return {
        name: isIP ? "IP Sprint" : `Sprint ${i + 1}`,
        pts: isIP ? ipPts : Math.round(ptsPerSpr * (1 - b / 100)),
        isIP,
      };
    });
    const maxPts = Math.max(...sprints.map((s) => s.pts));
    setResult({
      ptsPerSpr,
      devPts,
      ipPts,
      piWks,
      hrsPerSpr,
      sprints,
      maxPts,
      devSpr,
    });
  };
  return (
    <div>
      <div className="tab-intro">
        <h2>📅 Sprint Planner</h2>
        <p>
          PI capacity calculator + sprint distribution. SAFe-aligned benchmarks.
        </p>
      </div>
      <div className="g2">
        <div className="ak-card">
          <div className="ak-card-title">⚙ Team Parameters</div>
          {[
            ["Team Size (FTEs)", team, setTeam],
            ["Sprint Length (weeks)", slen, setSlen],
            ["Sprints per PI", nspr, setNspr],
            ["Capacity % (after leave)", cap, setCap],
            ["Avg Velocity (pts/person/sprint)", vel, setVel],
            ["Innovation Sprint Buffer %", buf, setBuf],
          ].map(([label, val, setter]) => (
            <div key={label as string} className="ak-field">
              <div className="ak-label">{label as string}</div>
              <input
                className="ak-inp"
                type="number"
                value={val as string}
                onChange={(e) => (setter as any)(e.target.value)}
                inputMode="decimal"
              />
            </div>
          ))}
          <button
            className="ak-btn-primary"
            onClick={calc}
            data-testid="button-calc-sprint"
          >
            Calculate PI Plan →
          </button>
        </div>
        <div className="ak-card">
          <div className="ak-card-title">📊 PI Breakdown</div>
          {!result && (
            <p style={{ color: "var(--sub)", fontSize: "12px" }}>
              Enter parameters and calculate.
            </p>
          )}
          {result && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginBottom: "14px",
                }}
              >
                {[
                  [
                    "PI Duration",
                    `${result.piWks}w`,
                    `${result.sprints.length} sprints`,
                    "var(--blue)",
                  ],
                  [
                    "Dev Capacity",
                    result.devPts,
                    "story points",
                    "var(--green)",
                  ],
                  [
                    "Per Sprint",
                    result.ptsPerSpr,
                    "committed pts",
                    "var(--cyan)",
                  ],
                  [
                    "Hrs / Sprint",
                    result.hrsPerSpr,
                    "available hrs",
                    "var(--gold)",
                  ],
                ].map(([l, v, s, c]) => (
                  <div
                    key={l as string}
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border-c)",
                      borderRadius: "6px",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        color: "var(--sub)",
                        textTransform: "uppercase",
                        letterSpacing: ".5px",
                        marginBottom: "4px",
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: c as string,
                      }}
                    >
                      {v}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--sub)",
                        marginTop: "2px",
                      }}
                    >
                      {s}
                    </div>
                  </div>
                ))}
              </div>
              {result.sprints.map((s: any) => (
                <div
                  key={s.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                    fontSize: "12px",
                  }}
                >
                  <div style={{ minWidth: "70px", color: "var(--sub)" }}>
                    {s.name}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: "16px",
                      background: "var(--surf2)",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "3px",
                        width: `${Math.round((s.pts / result.maxPts) * 100)}%`,
                        background: s.isIP ? "var(--purple)" : "var(--blue)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      minWidth: "50px",
                      textAlign: "right",
                      fontSize: "11px",
                      color: s.isIP ? "var(--purple)" : "var(--blue)",
                    }}
                  >
                    {s.pts} pts
                  </div>
                </div>
              ))}
              <div
                style={{
                  marginTop: "8px",
                  padding: "8px 10px",
                  background: "var(--bg)",
                  borderRadius: "5px",
                  borderLeft: "2px solid var(--green)",
                  fontSize: "11px",
                  color: "var(--sub)",
                }}
              >
                Recommended commit:{" "}
                <strong style={{ color: "var(--text)" }}>
                  {Math.round(result.devPts * 0.9)} pts
                </strong>{" "}
                (90% of dev capacity) · IP Sprint:{" "}
                <strong style={{ color: "var(--purple)" }}>
                  {result.ipPts} pts
                </strong>{" "}
                for innovation & tech debt
              </div>
            </>
          )}
        </div>
      </div>
      <div className="ak-card" style={{ marginTop: "14px" }}>
        <div className="ak-card-title">📚 SAFe PI Benchmarks</div>
        <table className="ak-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Formula</th>
              <th>Green</th>
              <th>Red</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "PI Predictability",
                "Actual / Planned PI Pts × 100",
                "≥ 80%",
                "< 60%",
              ],
              [
                "Capacity Utilization",
                "Committed / Available Pts",
                "85–95%",
                "> 95% (overcommit)",
              ],
              [
                "Innovation Sprint",
                "1 sprint / PI for IP & tech debt",
                "≥ 20% PI capacity",
                "< 10%",
              ],
              [
                "Velocity Stability",
                "Sprint-on-sprint variance",
                "≤ ±15%",
                "> 25% drop",
              ],
            ].map(([m, f, g, r]) => (
              <tr key={m as string}>
                <td>{m}</td>
                <td style={{ color: "var(--sub)", fontSize: "11px" }}>{f}</td>
                <td style={{ color: "var(--green)" }}>{g}</td>
                <td style={{ color: "var(--red)" }}>{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
