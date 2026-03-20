import { useState } from "react";

// For local dev: Vite proxy routes /predict → http://localhost:5000/predict
// For production: replace "/predict" with your full Render URL
// e.g. "https://abalone-app-xyz.onrender.com/predict"
const API_URL = "/predict";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #020d18;
    color: #c8e6f0;
    font-family: 'Lato', sans-serif;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    background:
      radial-gradient(ellipse at 20% 0%,  #0a2a3d 0%, #020d18 60%),
      radial-gradient(ellipse at 80% 100%, #041a2b 0%, #020d18 60%);
    padding: 40px 20px;
    position: relative;
    overflow: hidden;
  }

  .app::before {
    content: '';
    position: fixed;
    top: -30%; left: -10%;
    width: 60%; height: 80%;
    background: radial-gradient(ellipse, rgba(0,180,180,0.06) 0%, transparent 70%);
    pointer-events: none;
    border-radius: 50%;
  }

  .app::after {
    content: '';
    position: fixed;
    bottom: -20%; right: -10%;
    width: 50%; height: 70%;
    background: radial-gradient(ellipse, rgba(0,120,160,0.05) 0%, transparent 70%);
    pointer-events: none;
    border-radius: 50%;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .header { text-align: center; margin-bottom: 48px; }

  .shell-icon {
    font-size: 52px;
    margin-bottom: 8px;
    display: block;
    filter: drop-shadow(0 0 20px rgba(0,200,200,0.5));
    animation: float 4s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }

  .title {
    font-family: 'Cinzel', serif;
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 700;
    letter-spacing: 0.08em;
    background: linear-gradient(135deg, #a0d8ef 0%, #00c8c8 50%, #4dd0e1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 10px;
  }

  .subtitle {
    font-family: 'Lato', sans-serif;
    font-weight: 300;
    font-size: 15px;
    color: #5a8fa3;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .divider {
    width: 80px; height: 1px;
    background: linear-gradient(90deg, transparent, #00c8c8, transparent);
    margin: 20px auto;
  }

  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(0,200,200,0.12);
    border-radius: 20px;
    backdrop-filter: blur(12px);
    padding: 36px;
    margin-bottom: 24px;
    transition: border-color 0.3s;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
  }
  .card:hover { border-color: rgba(0,200,200,0.22); }

  .section-label {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #00c8c8;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-label::after {
    content: '';
    flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(0,200,200,0.3), transparent);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }

  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-group.full-width { grid-column: 1 / -1; }

  label {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5a8fa3;
    font-weight: 700;
  }

  .range-hint {
    font-size: 10px;
    color: #2a5a6d;
    letter-spacing: 0.05em;
    margin-top: -4px;
  }

  input {
    background: rgba(0,200,200,0.04);
    border: 1px solid rgba(0,200,200,0.15);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 15px;
    color: #c8e6f0;
    font-family: 'Lato', sans-serif;
    transition: all 0.25s;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
  }
  input:focus {
    border-color: rgba(0,200,200,0.5);
    background: rgba(0,200,200,0.08);
    box-shadow: 0 0 0 3px rgba(0,200,200,0.08);
  }
  input::placeholder { color: #2a5a6d; }

  .sex-selector { display: flex; gap: 8px; }

  .sex-btn {
    flex: 1;
    padding: 12px 8px;
    border-radius: 10px;
    border: 1px solid rgba(0,200,200,0.15);
    background: rgba(0,200,200,0.04);
    color: #5a8fa3;
    font-family: 'Lato', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.2s;
  }
  .sex-btn:hover { border-color: rgba(0,200,200,0.35); color: #c8e6f0; }
  .sex-btn.active {
    background: rgba(0,200,200,0.15);
    border-color: #00c8c8;
    color: #00c8c8;
    box-shadow: 0 0 12px rgba(0,200,200,0.15);
  }

  .predict-btn {
    width: 100%;
    padding: 18px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #006e7a 0%, #00a8b8 50%, #00c8c8 100%);
    color: #fff;
    font-family: 'Cinzel', serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 24px rgba(0,200,200,0.25);
    position: relative;
    overflow: hidden;
  }
  .predict-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s;
  }
  .predict-btn:hover::before { left: 100%; }
  .predict-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,200,200,0.35); }
  .predict-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .result-card {
    background: rgba(0,200,200,0.05);
    border: 1px solid rgba(0,200,200,0.25);
    border-radius: 20px;
    padding: 40px 36px;
    text-align: center;
    box-shadow: 0 0 40px rgba(0,200,200,0.08), inset 0 1px 0 rgba(0,200,200,0.1);
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .result-label {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 0.25em;
    color: #5a8fa3;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .result-rings {
    font-family: 'Cinzel', serif;
    font-size: clamp(56px, 10vw, 80px);
    font-weight: 700;
    background: linear-gradient(135deg, #a0d8ef, #00c8c8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin-bottom: 8px;
    filter: drop-shadow(0 0 20px rgba(0,200,200,0.4));
  }

  .result-age { font-size: 14px; color: #5a8fa3; letter-spacing: 0.1em; margin-bottom: 24px; }

  .age-badge {
    display: inline-block;
    background: rgba(0,200,200,0.12);
    border: 1px solid rgba(0,200,200,0.3);
    border-radius: 30px;
    padding: 8px 24px;
    font-family: 'Cinzel', serif;
    font-size: 13px;
    color: #00c8c8;
    letter-spacing: 0.1em;
  }

  .info-row {
    display: flex; flex-wrap: wrap; gap: 12px;
    margin-top: 28px; justify-content: center;
  }

  .info-chip {
    background: rgba(0,200,200,0.06);
    border: 1px solid rgba(0,200,200,0.12);
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 11px;
    color: #3a7080;
    letter-spacing: 0.08em;
  }
  .info-chip span { color: #00a8b8; font-weight: 700; }

  .loading-dots { display: flex; justify-content: center; gap: 8px; padding: 20px; }

  .dot {
    width: 10px; height: 10px;
    background: #00c8c8;
    border-radius: 50%;
    animation: bounce 1.4s ease-in-out infinite;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40%           { transform: translateY(-12px); opacity: 1; }
  }

  .error-msg {
    background: rgba(200,50,50,0.08);
    border: 1px solid rgba(200,50,50,0.25);
    border-radius: 12px;
    padding: 16px 20px;
    color: #e07070;
    font-size: 13px;
    text-align: center;
    animation: fadeIn 0.3s ease;
  }

  @media (max-width: 600px) {
    .card { padding: 24px 20px; }
    .form-grid { grid-template-columns: 1fr 1fr; }
  }
`;

const FIELD_CONFIG = [
  { key: "length",         label: "Length",        unit: "mm", hint: "0.075 – 0.815", placeholder: "e.g. 0.455" },
  { key: "diameter",       label: "Diameter",       unit: "mm", hint: "0.055 – 0.650", placeholder: "e.g. 0.365" },
  { key: "height",         label: "Height",         unit: "mm", hint: "0.000 – 1.130", placeholder: "e.g. 0.095" },
  { key: "whole_weight",   label: "Whole Weight",   unit: "g",  hint: "0.002 – 2.826", placeholder: "e.g. 0.514" },
  { key: "shucked_weight", label: "Shucked Weight", unit: "g",  hint: "0.001 – 1.488", placeholder: "e.g. 0.225" },
  { key: "viscera_weight", label: "Viscera Weight", unit: "g",  hint: "0.001 – 0.760", placeholder: "e.g. 0.101" },
  { key: "shell_weight",   label: "Shell Weight",   unit: "g",  hint: "0.002 – 1.005", placeholder: "e.g. 0.150" },
];

const SEX_OPTIONS = [
  { value: "0", label: "♂ Male" },
  { value: "1", label: "♀ Female" },
  { value: "2", label: "⊙ Infant" },
];

export default function App() {
  const [sex, setSex]       = useState("0");
  const [fields, setFields] = useState({
    length: "", diameter: "", height: "", whole_weight: "",
    shucked_weight: "", viscera_weight: "", shell_weight: ""
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleChange = (key, val) => {
    setFields(prev => ({ ...prev, [key]: val }));
    setResult(null); setError(null);
  };

  const allFilled = Object.values(fields).every(v => v !== "");

  const handlePredict = async () => {
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sex:             parseInt(sex),
          length:          parseFloat(fields.length),
          diameter:        parseFloat(fields.diameter),
          height:          parseFloat(fields.height),
          whole_weight:    parseFloat(fields.whole_weight),
          shucked_weight:  parseFloat(fields.shucked_weight),
          viscera_weight:  parseFloat(fields.viscera_weight),
          shell_weight:    parseFloat(fields.shell_weight),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Server error ${res.status}`);
      }
      const data = await res.json();
      setResult({ rings: data.rings, age: data.age });
    } catch (e) {
      setError(e.message || "Prediction failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="container">

          {/* Header */}
          <div className="header">
            <span className="shell-icon">🐚</span>
            <h1 className="title">Abalone Age Oracle</h1>
            <p className="subtitle">Decision Tree · Ring Count Prediction</p>
            <div className="divider" />
            <p style={{ fontSize: 13, color: "#3a7080", maxWidth: 500, margin: "0 auto" }}>
              Enter the physical measurements of an abalone to predict its age.
              &nbsp;Age (years) ≈ Rings + 1.5
            </p>
          </div>

          {/* Input Card */}
          <div className="card">
            <div className="section-label">Physical Measurements</div>
            <div className="form-grid">

              {/* Sex */}
              <div className="form-group full-width">
                <label>Sex</label>
                <div className="sex-selector">
                  {SEX_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      className={`sex-btn ${sex === opt.value ? "active" : ""}`}
                      onClick={() => { setSex(opt.value); setResult(null); setError(null); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Numeric fields */}
              {FIELD_CONFIG.map(field => (
                <div className="form-group" key={field.key}>
                  <label>
                    {field.label}&nbsp;
                    <span style={{ color: "#2a5a6d", fontWeight: 300 }}>({field.unit})</span>
                  </label>
                  <p className="range-hint">Range: {field.hint}</p>
                  <input
                    type="number"
                    step="0.001"
                    placeholder={field.placeholder}
                    value={fields[field.key]}
                    onChange={e => handleChange(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32 }}>
              <button
                className="predict-btn"
                onClick={handlePredict}
                disabled={!allFilled || loading}
              >
                {loading ? "Analyzing…" : "Predict Ring Count"}
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="card" style={{ textAlign: "center" }}>
              <p style={{ fontSize: 12, letterSpacing: "0.15em", color: "#3a7080", textTransform: "uppercase", marginBottom: 12 }}>
                Processing measurements
              </p>
              <div className="loading-dots">
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            </div>
          )}

          {/* Error */}
          {error && <div className="error-msg">⚠ {error}</div>}

          {/* Result */}
          {result && !loading && (
            <div className="result-card">
              <p className="result-label">Predicted Ring Count</p>
              <div className="result-rings">{result.rings}</div>
              <p className="result-age">rings detected</p>
              <div className="age-badge">Estimated Age: {result.age} years</div>
              <div className="info-row">
                <div className="info-chip">Model: <span>Decision Tree</span></div>
                <div className="info-chip">Dataset: <span>Abalone (n=4177)</span></div>
                <div className="info-chip">Formula: <span>Rings + 1.5 = Age</span></div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
