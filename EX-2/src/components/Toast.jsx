import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeToast } from "../features/ui/uiSlice";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export const Toast = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui.toasts);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "24px",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none"
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: "auto",
              minWidth: "280px",
              maxWidth: "400px",
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              background: "rgba(18, 24, 36, 0.95)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${
                isSuccess
                  ? "rgba(16, 185, 129, 0.4)"
                  : isError
                  ? "rgba(244, 63, 94, 0.4)"
                  : "rgba(99, 102, 241, 0.4)"
              }`,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              animation: "fadeIn 0.2s ease-out"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {isSuccess && <CheckCircle2 size={18} color="#34d399" />}
              {isError && <AlertCircle size={18} color="#fca5a5" />}
              {!isSuccess && !isError && <Info size={18} color="#a5b4fc" />}
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>
                {toast.message}
              </span>
            </div>

            <button
              onClick={() => dispatch(removeToast(toast.id))}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer"
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
