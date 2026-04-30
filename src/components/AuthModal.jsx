import { useEffect, useRef, useState } from "react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function AuthModal({ onClose, signIn, signUp, signInWithGoogle, signInAnonymously }) {
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

  // ── Google ────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setError(""); setLoading(true);
    const err = await signInWithGoogle();
    setLoading(false);
    if (err) setError(err.message);
    // on success the page redirects — modal closes automatically
  };

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

          {/* ── Google button ── */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 r-lg font-medium text-[14px] transition-colors"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--hairline)",
              color: "var(--ink)",
              opacity: loading ? 0.65 : 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ink-3)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* ── divider ── */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "var(--hairline)" }} />
            <span className="text-[11px] font-medium tracking-widest uppercase" style={{ color: "var(--ink-3)" }}>
              or
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--hairline)" }} />
          </div>

          {/* ── email form ── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--ink-3)" }}>
                Email
              </label>
              <input
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
              <label className="block text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--ink-3)" }}>
                Password
              </label>
              <input
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
                <label className="block text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "var(--ink-3)" }}>
                  Confirm password
                </label>
                <input
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
