import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { openComposer, toggleStateInspector } from "../features/ui/uiSlice";
import { selectTotalPosts } from "../features/posts/postsSlice";
import { selectAllPlatforms } from "../features/platforms/platformsSlice";
import { Plus, Terminal, RefreshCw, Layers, Radio, Sparkles } from "lucide-react";

export const Header = () => {
  const dispatch = useDispatch();
  const totalPosts = useSelector(selectTotalPosts);
  const platforms = useSelector(selectAllPlatforms);
  const postsActiveThunk = useSelector((state) => state.posts.activeThunk);
  const platformsActiveThunk = useSelector((state) => state.platforms.activeThunk);
  const showStateInspector = useSelector((state) => state.ui.showStateInspector);

  const activeThunk = postsActiveThunk || platformsActiveThunk;
  const connectedCount = platforms.filter((p) => p.connected).length;

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 32px",
        background: "rgba(18, 24, 36, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 500
      }}
    >
      {/* Brand Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
          }}
        >
          <Layers size={24} color="#fff" />
        </div>
        <div>
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #fff 40%, #a5b4fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Redux Toolkit Centralized State Hub
          </h1>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Experiment 1.2</span>
            <span>•</span>
            <span style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>Normalized Entity State & Async Thunks</span>
          </p>
        </div>
      </div>

      {/* Center Metrics & Thunk Status Indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Active Thunk Status Badge */}
        {activeThunk ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#fbbf24",
              fontSize: "0.8rem",
              fontWeight: 600
            }}
          >
            <RefreshCw size={14} className="thunk-spinner" />
            <span>Thunk Dispatching: {activeThunk}</span>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              color: "#34d399",
              fontSize: "0.8rem",
              fontWeight: 600
            }}
          >
            <Radio size={14} />
            <span>Store Synchronized</span>
          </div>
        )}

        {/* Counters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            background: "rgba(10, 13, 20, 0.5)",
            padding: "6px 16px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            fontSize: "0.85rem"
          }}
        >
          <div>
            <span style={{ color: "var(--text-dim)", marginRight: "6px" }}>Posts:</span>
            <strong style={{ color: "#fff" }}>{totalPosts}</strong>
          </div>
          <div style={{ width: "1px", height: "16px", background: "var(--border-subtle)" }} />
          <div>
            <span style={{ color: "var(--text-dim)", marginRight: "6px" }}>Networks:</span>
            <strong style={{ color: "var(--accent-emerald)" }}>{connectedCount}</strong> / {platforms.length}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Toggle Redux State Inspector */}
        <button
          onClick={() => dispatch(toggleStateInspector())}
          className={`btn ${showStateInspector ? "btn-primary" : "btn-secondary"}`}
          title="Toggle Normalized State Visualizer"
          style={{ padding: "8px 14px" }}
        >
          <Terminal size={16} />
          <span>Redux Inspector</span>
        </button>

        {/* Create Post Button */}
        <button onClick={() => dispatch(openComposer())} className="btn btn-primary">
          <Plus size={18} />
          <span>Create Post</span>
        </button>
      </div>
    </header>
  );
};
