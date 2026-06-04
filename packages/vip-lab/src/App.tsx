import { useState } from "react";
import Editor from "@monaco-editor/react";
import { ProjectExplorer } from "./components/ProjectExplorer";
import { LAB_STEPS } from "./steps";
import "./App.css";

type LabMode = "practice" | "explore";

function getApiBase(): string {
  if (import.meta.env.VITE_API_BASE) {
    return String(import.meta.env.VITE_API_BASE).replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    const port = window.location.port;
    if (port === "5173" || port === "5174") {
      return "http://localhost:3000";
    }
  }
  return "";
}

const API_BASE = getApiBase();

export default function App() {
  const [mode, setMode] = useState<LabMode>("practice");
  const [step, setStep] = useState(1);
  const [code, setCode] = useState(LAB_STEPS[0].starterCode);
  const [pk, setPk] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [failCount, setFailCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const current = LAB_STEPS[step - 1];

  function goToStep(n: number) {
    setStep(n);
    setCode(LAB_STEPS[n - 1].starterCode);
    setMessage(null);
  }

  function goToLabStepFromExplorer(n: number) {
    setMode("practice");
    goToStep(n);
  }

  async function verify() {
    setLoading(true);
    setMessage(null);
    const payload = step === 1 ? { publishableKey: pk } : { code };

    try {
      const res = await fetch(`${API_BASE}/api/lab/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ step, payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Lỗi xác minh — đăng nhập Vip trên app :3000 trước");
        setFailCount((c) => c + 1);
        return;
      }
      if (data.passed) {
        setMessage(data.message);
        setFailCount(0);
        if (step === 5) {
          setCompleted(true);
        } else {
          goToStep(step + 1);
        }
      } else {
        setFailCount((c) => c + 1);
        setMessage(data.hint ?? "Chưa đạt — thử lại");
      }
    } catch {
      setMessage(
        `Không gọi được API tại ${API_BASE || "(cùng origin)"}. Kiểm tra Next.js :3000 và CORS.`
      );
      setFailCount((c) => c + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`lab${mode === "explore" ? " lab-wide" : ""}`}>
      <header className="lab-header">
        <h1>VIP Lab</h1>
        {mode === "practice" && (
          <>
            <span className="badge">Bước {step}/5</span>
            {completed && <span className="badge success">Stripe test mode OK</span>}
          </>
        )}
        {API_BASE && (
          <span className="badge badge-api">API → {API_BASE}</span>
        )}
      </header>

      <nav className="lab-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "practice"}
          className={`lab-tab${mode === "practice" ? " active" : ""}`}
          onClick={() => setMode("practice")}
        >
          Thực hành 5 bước
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "explore"}
          className={`lab-tab${mode === "explore" ? " active" : ""}`}
          onClick={() => setMode("explore")}
        >
          Khám phá dự án
        </button>
      </nav>

      {mode === "explore" ? (
        <>
          <p className="desc">
            Bấm vào thư mục hoặc file để xem vai trò trong monorepo web + Stripe TEST.
          </p>
          <ProjectExplorer onGoToLabStep={goToLabStepFromExplorer} />
        </>
      ) : (
        <>
          <h2>{current.title}</h2>
          <p className="desc">{current.description}</p>

          {step === 1 && (
            <div className="pk-form">
              <label>
                Publishable Key (pk_test_...)
                <input
                  value={pk}
                  onChange={(e) => setPk(e.target.value)}
                  placeholder="pk_test_..."
                />
              </label>
            </div>
          )}

          <div className="editor-wrap">
            <Editor
              height="280px"
              defaultLanguage="typescript"
              value={code}
              onChange={(v) => setCode(v ?? "")}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 13 }}
            />
          </div>

          <div className="actions">
            <button type="button" onClick={verify} disabled={loading} className="primary">
              {loading ? "Đang kiểm tra..." : "Xác minh bước"}
            </button>
            {failCount >= 2 && (
              <button
                type="button"
                className="secondary"
                onClick={() => setMessage(`Gợi ý: ${current.hint}`)}
              >
                Gợi ý
              </button>
            )}
            {failCount >= 3 && (
              <button
                type="button"
                className="secondary"
                onClick={() => setCode(current.starterCode)}
              >
                Xem mẫu
              </button>
            )}
          </div>

          {message && <p className="msg">{message}</p>}

          <nav className="steps-nav">
            {LAB_STEPS.map((s) => (
              <button
                key={s.step}
                type="button"
                className={s.step === step ? "active" : ""}
                onClick={() => goToStep(s.step)}
              >
                {s.step}
              </button>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
