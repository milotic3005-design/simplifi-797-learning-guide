import { useEffect, useRef, useState } from "react";

export default function AuthModal({ onClose, signIn, signUp, signInAnonymously }) {
  const [mode, setMode]       = useState("signin");
  const [email, setEmail]     = useState("");
  const [password, setPwd]    = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const emailRef = useRef(null);

  useEffect(() => { emailRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const switchMode = (m) => { setMode(m); setError(""); setSuccess(""); };

  // ── Anonymous guest ───────────────────────────────────────────
  const handleGuest = async () => {
    setError(""); setLoading(true);
    const err = await signInAnonymously();
    setLoading(false);
    if (err) setError(err.message);
    else onClose();
  };

  // ── Email / password ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (mode === "signup" && password !== confirm) {
      setError("Passwords don't match."); return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }

    setLoading(true);
    let err;
    if (mode === "signin") {
      err = await signIn(email, password);
      if (!err) { onClose(); return; }
    } else {
      err = await signUp(email, password);
      if (!err) {
        setSuccess("Check your email to confirm your account, then sign in.");
        switchMode("signin");
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    if (err) setError(err.message);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-strong w-full max-w-sm fade-up overflow-hidden"
        style={{ borderRadius: 22 }}
      >
        {/* ── header ── */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="eyebrow mb-1.5">First Air</div>
              <h2
                className="font-display text-[24px] font-semibold leading-tight"
                style={{ color: "var(--ink)" }}
              >
                {mode === "signin" ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-[13px] mt-1" style={{ color: "var(--ink-3)" }}>
                Sync your progress across every device.
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 rounded-full inline-flex items-center justify-center text-[16px] leading-none ml-4 mt-0.5 hairline transition-colors"
              style={{ background: "var(--glass-bg)", color: "var(--ink-3)" }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* ── email form ── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--ink-3)" }}>
                Email
              </label>
              <input
                id="email"
                ref={emailRef}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hospital.org"
                className="auth-input"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--ink-3)" }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="6+ characters"
                className="auth-input"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </div>

            {mode === "signup" && (
              <div className="fade-in">
                <label htmlFor="confirm" className="block text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--ink-3)" }}>
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="same as above"
                  className="auth-input"
                  autoComplete="new-password"
                />
              </div>
            )}

            {error && (
              <div className="text-[13px] p-3 r-md fade-in" style={{ background: "var(--danger-tint)", color: "var(--danger)", border: "1px solid rgba(225,29,72,0.18)" }}>
                {error}
              </div>
            )}
            {success && (
              <div className="text-[13px] p-3 r-md fade-in" style={{ background: "var(--success-tint)", color: "var(--success)", border: "1px solid rgba(5,150,105,0.20)" }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
              style={{ opacity: loading ? 0.65 : 1 }}
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in →" : "Create account →"}
            </button>
          </form>

          {/* ── mode toggle ── */}
          <div className="mt-4 text-center text-[13px]" style={{ color: "var(--ink-3)" }}>
            {mode === "signin" ? (
              <>
                New here?{" "}
                <button className="font-semibold hover:underline" style={{ color: "var(--info)" }} onClick={() => switchMode("signup")}>
                  Create a free account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button className="font-semibold hover:underline" style={{ color: "var(--info)" }} onClick={() => switchMode("signin")}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── guest footer ── */}
        <div
          className="px-8 py-4 text-center"
          style={{ borderTop: "1px solid var(--hairline)", background: "var(--glass-bg)" }}
        >
          <button
            onClick={handleGuest}
            disabled={loading}
            className="text-[13px] hover:underline transition-colors"
            style={{ color: "var(--ink-3)", opacity: loading ? 0.65 : 1 }}
          >
            Continue without an account →
          </button>
          <p className="text-[11px] mt-1" style={{ color: "var(--ink-3)", opacity: 0.6 }}>
            Progress saves to this device only
          </p>
        </div>
      </div>
    </div>
  );
}
