import { useEffect, useRef, useState } from "react";

/** Avatar button when signed in, or "Sign in" ghost button when not. */
export default function UserMenu({ user, signOut, onOpenAuth }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── guest state ──
  if (!user) {
    return (
      <button
        onClick={onOpenAuth}
        className="shrink-0 text-[12px] font-semibold px-3.5 py-1.5 hairline r-lg transition-colors hover:bg-opacity-80"
        style={{
          background: "var(--info-tint)",
          color: "var(--info)",
          border: "1px solid rgba(99,102,241,0.25)",
        }}
      >
        Sign in
      </button>
    );
  }

  // ── signed-in state ──
  const initial = user.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="relative shrink-0" ref={ref}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        title={user.email}
        className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white transition-transform active:scale-95"
        style={{
          background: "linear-gradient(135deg, var(--info-2), var(--plum-2))",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.4) inset, 0 4px 14px -4px rgba(99,102,241,0.5)",
        }}
      >
        {initial}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-11 w-60 glass-strong fade-up"
          style={{ borderRadius: 14, zIndex: 100, overflow: "hidden" }}
        >
          {/* Account row */}
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: "var(--hairline)" }}
          >
            <div
              className="text-[10px] font-bold tracking-widest uppercase mb-0.5"
              style={{ color: "var(--ink-3)" }}
            >
              Signed in as
            </div>
            <div
              className="text-[13px] font-medium truncate"
              style={{ color: "var(--ink)" }}
              title={user.email}
            >
              {user.email}
            </div>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-[13px] r-md transition-colors"
              style={{ color: "var(--ink-2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--glass-bg)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
