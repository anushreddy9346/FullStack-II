import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeComposer, addToast } from "../features/ui/uiSlice";
import { selectPostById, addPostAsync, updatePostAsync } from "../features/posts/postsSlice";
import { selectAllPlatforms } from "../features/platforms/platformsSlice";
import { renderPlatformIcon } from "./PlatformGrid";
import { X, Send, AlertTriangle, Check, RefreshCw } from "lucide-react";

export const PostComposer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isComposerOpen);
  const editingPostId = useSelector((state) => state.ui.editingPostId);
  const existingPost = useSelector((state) =>
    editingPostId ? selectPostById(state, editingPostId) : null
  );
  const platforms = useSelector(selectAllPlatforms);
  const postsActiveThunk = useSelector((state) => state.posts.activeThunk);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["tw", "li"]);
  const [status, setStatus] = useState("Draft");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title || "");
      setContent(existingPost.content || "");
      setSelectedPlatforms(existingPost.platforms || ["tw"]);
      setStatus(existingPost.status || "Draft");
      setTagsInput(existingPost.tags ? existingPost.tags.join(", ") : "");
    } else {
      setTitle("");
      setContent("");
      setSelectedPlatforms(["tw", "li"]);
      setStatus("Draft");
      setTagsInput("ReduxToolkit, React");
    }
  }, [existingPost, isOpen]);

  if (!isOpen) return null;

  const togglePlatformSelect = (id) => {
    if (selectedPlatforms.includes(id)) {
      if (selectedPlatforms.length === 1) {
        dispatch(
          addToast({
            type: "info",
            message: "Select at least one destination platform."
          })
        );
        return;
      }
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== id));
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  // Find lowest character limit among selected platforms
  const activeSelectedPlatformObjects = platforms.filter((p) =>
    selectedPlatforms.includes(p.id)
  );
  const minCharLimit = Math.min(
    ...activeSelectedPlatformObjects.map((p) => p.charLimit),
    10000
  );
  const isOverCharLimit = content.length > minCharLimit;

  const isSubmitting =
    postsActiveThunk === "addPostAsync" || postsActiveThunk === "updatePostAsync";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      dispatch(
        addToast({
          type: "error",
          message: "Please enter both a title and post content."
        })
      );
      return;
    }

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    const postPayload = {
      title,
      content,
      platforms: selectedPlatforms,
      status,
      tags: tagsArray
    };

    try {
      if (existingPost) {
        await dispatch(
          updatePostAsync({ id: existingPost.id, ...postPayload })
        ).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: "Post updated successfully via Async Thunk!"
          })
        );
      } else {
        await dispatch(addPostAsync(postPayload)).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: "New post dispatched & stored in Redux!"
          })
        );
      }
      dispatch(closeComposer());
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: `Thunk error: ${err}`
        })
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={() => dispatch(closeComposer())}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            paddingBottom: "14px",
            borderBottom: "1px solid var(--border-subtle)"
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
              {existingPost ? "Edit Social Post" : "Compose New Social Post"}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Centralized state update via Redux Toolkit Thunk
            </p>
          </div>
          <button
            onClick={() => dispatch(closeComposer())}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer"
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Post Title */}
          <div className="form-group">
            <label className="form-label">Post Headline / Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 🚀 Introducing Redux Toolkit Normalization"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Target Platforms Multi-Select */}
          <div className="form-group">
            <label className="form-label">Target Social Platforms</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {platforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => togglePlatformSelect(platform.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "var(--radius-sm)",
                      border: `1px solid ${
                        isSelected ? platform.color : "var(--border-subtle)"
                      }`,
                      background: isSelected ? `${platform.color}25` : "rgba(10, 13, 20, 0.4)",
                      color: isSelected ? "#fff" : "var(--text-muted)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {renderPlatformIcon(platform.iconKey, 16, isSelected ? platform.color : "gray")}
                    <span>{platform.name}</span>
                    {isSelected && <Check size={14} color={platform.color} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post Body Content */}
          <div className="form-group">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px"
              }}
            >
              <label className="form-label" style={{ margin: 0 }}>
                Post Body / Content
              </label>
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: isOverCharLimit ? "var(--accent-rose)" : "var(--text-dim)"
                }}
              >
                {content.length} / {minCharLimit} chars limit
              </span>
            </div>
            <textarea
              className="form-textarea"
              placeholder="Write your cross-platform content post update..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            {isOverCharLimit && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.78rem",
                  color: "#fca5a5",
                  marginTop: "6px"
                }}
              >
                <AlertTriangle size={14} />
                <span>
                  Content exceeds character limit for one of your selected platforms ({minCharLimit} chars).
                </span>
              </div>
            )}
          </div>

          {/* Row: Status & Tags */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Publication Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Redux, React, State"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "20px",
              paddingTop: "14px",
              borderTop: "1px solid var(--border-subtle)"
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatch(closeComposer())}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isOverCharLimit}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="thunk-spinner" />
                  <span>Dispatching Thunk...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>{existingPost ? "Update Post Thunk" : "Dispatch Add Post"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
