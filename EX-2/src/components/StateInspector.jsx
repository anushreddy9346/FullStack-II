import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleStateInspector } from "../features/ui/uiSlice";
import { X, Terminal, Database, Activity, Code2 } from "lucide-react";

export const StateInspector = () => {
  const dispatch = useDispatch();
  const showStateInspector = useSelector((state) => state.ui.showStateInspector);
  const postsState = useSelector((state) => state.posts);
  const platformsState = useSelector((state) => state.platforms);
  const actionLog = useSelector((state) => state.ui.actionLog);

  const [activeTab, setActiveTab] = useState("NORMALIZATION"); // 'NORMALIZATION' | 'LOGS' | 'THUNKS'

  if (!showStateInspector) return null;

  return (
    <div className="inspector-drawer">
      {/* Header */}
      <div className="inspector-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Terminal size={18} color="var(--accent-violet)" />
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>
            Redux Toolkit Live State Inspector
          </h3>
        </div>
        <button
          onClick={() => dispatch(toggleStateInspector())}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer"
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs Bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(10, 13, 20, 0.6)"
        }}
      >
        <button
          onClick={() => setActiveTab("NORMALIZATION")}
          style={{
            flex: 1,
            padding: "8px",
            background: activeTab === "NORMALIZATION" ? "rgba(139, 92, 246, 0.2)" : "transparent",
            border: "none",
            borderBottom: activeTab === "NORMALIZATION" ? "2px solid var(--accent-violet)" : "none",
            color: activeTab === "NORMALIZATION" ? "#fff" : "var(--text-muted)",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px"
          }}
        >
          <Database size={14} /> Normalized Tree
        </button>

        <button
          onClick={() => setActiveTab("THUNKS")}
          style={{
            flex: 1,
            padding: "8px",
            background: activeTab === "THUNKS" ? "rgba(139, 92, 246, 0.2)" : "transparent",
            border: "none",
            borderBottom: activeTab === "THUNKS" ? "2px solid var(--accent-violet)" : "none",
            color: activeTab === "THUNKS" ? "#fff" : "var(--text-muted)",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px"
          }}
        >
          <Activity size={14} /> Active Thunks
        </button>

        <button
          onClick={() => setActiveTab("LOGS")}
          style={{
            flex: 1,
            padding: "8px",
            background: activeTab === "LOGS" ? "rgba(139, 92, 246, 0.2)" : "transparent",
            border: "none",
            borderBottom: activeTab === "LOGS" ? "2px solid var(--accent-violet)" : "none",
            color: activeTab === "LOGS" ? "#fff" : "var(--text-muted)",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px"
          }}
        >
          <Code2 size={14} /> Action History ({actionLog.length})
        </button>
      </div>

      {/* Body Content */}
      <div className="inspector-body">
        {activeTab === "NORMALIZATION" && (
          <div>
            <div style={{ marginBottom: "12px" }}>
              <span style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>
                // postsSlice State Structure (createEntityAdapter)
              </span>
              <pre
                style={{
                  background: "#030408",
                  padding: "10px",
                  borderRadius: "6px",
                  marginTop: "4px",
                  color: "#a5b4fc"
                }}
              >
                {JSON.stringify(
                  {
                    ids: postsState.ids,
                    entitiesCount: Object.keys(postsState.entities).length,
                    entities: postsState.entities
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div>
              <span style={{ color: "var(--accent-emerald)", fontWeight: 700 }}>
                // platformsSlice State Structure
              </span>
              <pre
                style={{
                  background: "#030408",
                  padding: "10px",
                  borderRadius: "6px",
                  marginTop: "4px",
                  color: "#6ee7b7"
                }}
              >
                {JSON.stringify(
                  {
                    ids: platformsState.ids,
                    entities: platformsState.entities
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "THUNKS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                padding: "10px",
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: "6px"
              }}
            >
              <h4 style={{ color: "#a5b4fc", fontSize: "0.85rem", marginBottom: "4px" }}>
                Posts Slice Thunk Lifecycle
              </h4>
              <p>
                Status: <strong>{postsState.status}</strong>
              </p>
              <p>
                Active Pending Thunk:{" "}
                <strong style={{ color: "var(--accent-amber)" }}>
                  {postsState.activeThunk || "None"}
                </strong>
              </p>
              <p>
                Error: <strong>{postsState.error || "Null"}</strong>
              </p>
            </div>

            <div
              style={{
                padding: "10px",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "6px"
              }}
            >
              <h4 style={{ color: "#6ee7b7", fontSize: "0.85rem", marginBottom: "4px" }}>
                Platforms Slice Thunk Lifecycle
              </h4>
              <p>
                Status: <strong>{platformsState.status}</strong>
              </p>
              <p>
                Active Pending Thunk:{" "}
                <strong style={{ color: "var(--accent-amber)" }}>
                  {platformsState.activeThunk || "None"}
                </strong>
              </p>
              <p>
                Error: <strong>{platformsState.error || "Null"}</strong>
              </p>
            </div>
          </div>
        )}

        {activeTab === "LOGS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {actionLog.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: "6px 8px",
                  background: "#030408",
                  borderLeft: log.type.endsWith("/fulfilled")
                    ? "3px solid var(--accent-emerald)"
                    : log.type.endsWith("/pending")
                    ? "3px solid var(--accent-amber)"
                    : log.type.endsWith("/rejected")
                    ? "3px solid var(--accent-rose)"
                    : "3px solid var(--accent-indigo)",
                  borderRadius: "2px",
                  fontSize: "0.75rem"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "var(--text-dim)"
                  }}
                >
                  <strong style={{ color: "#fff" }}>{log.type}</strong>
                  <span>{log.timestamp}</span>
                </div>
                <div
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {log.payload}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
