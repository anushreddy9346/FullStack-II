import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllPlatforms, togglePlatformConnectionAsync } from "../features/platforms/platformsSlice";
import { setPlatformFilter, addToast } from "../features/ui/uiSlice";
import {
  Globe,
  Users,
  CheckCircle2,
  XCircle,
  Filter
} from "lucide-react";

// Inline SVG Brand Icons for max reliability
export const renderPlatformIcon = (iconKey, size = 18, color = "currentColor") => {
  switch (iconKey) {
    case "Twitter":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case "Linkedin":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      );
    case "Instagram":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    case "Facebook":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.69c0-2.47 1.47-3.83 3.72-3.83 1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.23 0-1.61.76-1.61 1.54V12h2.74l-.44 3h-2.3v6.8c4.56-.93 8-4.96 8-9.8z"/>
        </svg>
      );
    case "Youtube":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    default:
      return <Globe size={size} color={color} />;
  }
};

export const PlatformGrid = () => {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const activePlatformFilter = useSelector((state) => state.ui.activePlatformFilter);
  const activeThunk = useSelector((state) => state.platforms.activeThunk);

  const handleToggle = async (platform) => {
    try {
      const resultAction = await dispatch(
        togglePlatformConnectionAsync({
          platformId: platform.id,
          currentConnectedState: platform.connected
        })
      ).unwrap();

      dispatch(
        addToast({
          type: resultAction.connected ? "success" : "info",
          message: `${platform.name} connection state set to ${resultAction.connected ? "Active" : "Disconnected"}`
        })
      );
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: `Failed to update ${platform.name}: ${err}`
        })
      );
    }
  };

  return (
    <section style={{ marginBottom: "28px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Globe size={20} color="var(--accent-indigo)" />
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Connected Social Networks</h2>
          <span
            style={{
              fontSize: "0.75rem",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "2px 8px",
              borderRadius: "10px",
              color: "var(--text-muted)"
            }}
          >
            Redux Normalized Entity Slice
          </span>
        </div>

        {/* Quick Clear Filter Button */}
        {activePlatformFilter !== "ALL" && (
          <button
            onClick={() => dispatch(setPlatformFilter("ALL"))}
            className="btn btn-secondary btn-sm"
          >
            <Filter size={14} />
            Show All Networks
          </button>
        )}
      </div>

      {/* Grid of Platform Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "14px"
        }}
      >
        {platforms.map((platform) => {
          const isSelectedFilter = activePlatformFilter === platform.id;
          const isToggling = activeThunk === "togglePlatformConnectionAsync";

          return (
            <div
              key={platform.id}
              className="glass-card"
              style={{
                padding: "16px",
                borderColor: isSelectedFilter
                  ? platform.color
                  : platform.connected
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(255, 255, 255, 0.04)",
                opacity: platform.connected ? 1 : 0.65,
                transform: isSelectedFilter ? "translateY(-2px)" : "none",
                position: "relative"
              }}
            >
              {/* Header inside platform card */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: `${platform.color}20`,
                      border: `1px solid ${platform.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {renderPlatformIcon(platform.iconKey, 20, platform.color)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.2 }}>
                      {platform.name}
                    </h3>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {platform.handle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specs & Metrics */}
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginBottom: "14px",
                  padding: "8px 10px",
                  background: "rgba(10, 13, 20, 0.4)",
                  borderRadius: "var(--radius-sm)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Audience:</span>
                  <strong style={{ color: "#fff", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Users size={12} /> {platform.followers.toLocaleString()}
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Max Chars:</span>
                  <strong style={{ color: "var(--accent-cyan)" }}>{platform.charLimit}</strong>
                </div>
              </div>

              {/* Card Footer: Filter & Toggle Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  paddingTop: "8px",
                  borderTop: "1px solid var(--border-subtle)"
                }}
              >
                {/* Filter Feed Toggle */}
                <button
                  onClick={() =>
                    dispatch(setPlatformFilter(isSelectedFilter ? "ALL" : platform.id))
                  }
                  style={{
                    background: isSelectedFilter ? `${platform.color}25` : "transparent",
                    color: isSelectedFilter ? platform.color : "var(--text-muted)",
                    border: `1px solid ${isSelectedFilter ? platform.color : "transparent"}`,
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {isSelectedFilter ? "Filtering Feed" : "Filter Posts"}
                </button>

                {/* Connection Async Thunk Toggle Switch */}
                <button
                  onClick={() => handleToggle(platform)}
                  disabled={isToggling}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: platform.connected
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(244, 63, 94, 0.15)",
                    color: platform.connected ? "#34d399" : "#fca5a5",
                    border: `1px solid ${
                      platform.connected ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)"
                    }`,
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {platform.connected ? (
                    <>
                      <CheckCircle2 size={12} /> Active
                    </>
                  ) : (
                    <>
                      <XCircle size={12} /> Off
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
