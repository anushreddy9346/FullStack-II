import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllPosts,
  deletePostAsync,
  publishPostAsync,
  postLiked
} from "../features/posts/postsSlice";
import { selectAllPlatforms } from "../features/platforms/platformsSlice";
import {
  setSearchQuery,
  setStatusFilter,
  setPlatformFilter,
  openComposer,
  addToast
} from "../features/ui/uiSlice";
import { renderPlatformIcon } from "./PlatformGrid";
import {
  Search,
  Filter,
  Send,
  Edit,
  Trash2,
  Heart,
  Share2,
  MessageSquare,
  Clock,
  Tag,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus
} from "lucide-react";

export const PostList = () => {
  const dispatch = useDispatch();
  const allPosts = useSelector(selectAllPosts);
  const platforms = useSelector(selectAllPlatforms);
  const searchQuery = useSelector((state) => state.ui.searchQuery);
  const statusFilter = useSelector((state) => state.ui.statusFilter);
  const activePlatformFilter = useSelector((state) => state.ui.activePlatformFilter);
  const postsStatus = useSelector((state) => state.posts.status);
  const activeThunk = useSelector((state) => state.posts.activeThunk);

  // Map platform ID to entity for fast lookup
  const platformMap = platforms.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {});

  // Filter posts based on search query, status filter, and platform filter
  const filteredPosts = allPosts.filter((post) => {
    // Search matching
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    // Status matching
    const matchesStatus = statusFilter === "ALL" || post.status === statusFilter;

    // Platform matching
    const matchesPlatform =
      activePlatformFilter === "ALL" ||
      (post.platforms && post.platforms.includes(activePlatformFilter));

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const handleDelete = async (post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await dispatch(deletePostAsync(post.id)).unwrap();
        dispatch(
          addToast({
            type: "info",
            message: `Post deleted from normalized store via Async Thunk.`
          })
        );
      } catch (err) {
        dispatch(
          addToast({
            type: "error",
            message: `Failed to delete post: ${err}`
          })
        );
      }
    }
  };

  const handlePublish = async (post) => {
    try {
      await dispatch(publishPostAsync(post.id)).unwrap();
      dispatch(
        addToast({
          type: "success",
          message: `Post published successfully!`
        })
      );
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message: `Failed to publish: ${err}`
        })
      );
    }
  };

  return (
    <section>
      {/* Control Bar: Search & Filters */}
      <div
        className="glass-card"
        style={{
          padding: "16px 20px",
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px"
        }}
      >
        {/* Search Bar */}
        <div style={{ position: "relative", flex: "1 1 250px", minWidth: "200px" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-dim)"
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "36px", height: "40px" }}
            placeholder="Search normalized posts or tags..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {["ALL", "Published", "Scheduled", "Draft"].map((st) => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => dispatch(setStatusFilter(st))}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  border: `1px solid ${
                    isSelected ? "var(--accent-indigo)" : "var(--border-subtle)"
                  }`,
                  background: isSelected
                    ? "rgba(99, 102, 241, 0.2)"
                    : "rgba(10, 13, 20, 0.3)",
                  color: isSelected ? "#fff" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading state for initial fetch */}
      {postsStatus === "loading" && allPosts.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: "40px",
            textAlign: "center",
            color: "var(--text-muted)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <RefreshCw size={32} color="var(--accent-indigo)" className="thunk-spinner" />
          <p>Executing Async Thunk: Initializing Normalized Data Store...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        /* Empty State */
        <div
          className="glass-card"
          style={{
            padding: "50px 20px",
            textAlign: "center",
            color: "var(--text-muted)"
          }}
        >
          <AlertCircle size={36} color="var(--accent-amber)" style={{ marginBottom: "12px" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
            No posts found matching filter
          </h3>
          <p style={{ fontSize: "0.85rem", marginTop: "4px", marginBottom: "16px" }}>
            Try resetting your search query, status tabs, or social network filter.
          </p>
          <button onClick={() => dispatch(openComposer())} className="btn btn-primary btn-sm">
            <Plus size={16} /> Create New Post
          </button>
        </div>
      ) : (
        /* Posts Feed Grid */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredPosts.map((post) => {
            const isPublishing =
              activeThunk === "publishPostAsync" || activeThunk === "deletePostAsync";

            return (
              <article
                key={post.id}
                className="glass-card"
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px"
                }}
              >
                {/* Header Row: Title, Status Badge, ID indicator */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "16px"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.72rem",
                          color: "var(--accent-violet)",
                          background: "rgba(139, 92, 246, 0.12)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          border: "1px solid rgba(139, 92, 246, 0.25)"
                        }}
                      >
                        ID: {post.id}
                      </span>
                      <span
                        className={`badge badge-${post.status.toLowerCase()}`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.3 }}>
                      {post.title}
                    </h3>
                  </div>

                  {/* Date Created */}
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-dim)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    <Clock size={12} />
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>

                {/* Content Body */}
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--text-main)",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.55
                  }}
                >
                  {post.content}
                </p>

                {/* Tags and Target Social Platforms */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    paddingTop: "6px"
                  }}
                >
                  {/* Platform Icons */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                      Target Networks:
                    </span>
                    {post.platforms &&
                      post.platforms.map((pId) => {
                        const platObj = platformMap[pId];
                        if (!platObj) return null;
                        return (
                          <div
                            key={pId}
                            title={platObj.name}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              background: `${platObj.color}15`,
                              border: `1px solid ${platObj.color}35`,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: platObj.color
                            }}
                          >
                            {renderPlatformIcon(platObj.iconKey, 14, platObj.color)}
                            <span>{platObj.name}</span>
                          </div>
                        );
                      })}
                  </div>

                  {/* Tag Pills */}
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Tag size={12} color="var(--text-dim)" />
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-muted)",
                            background: "rgba(255, 255, 255, 0.05)",
                            padding: "2px 8px",
                            borderRadius: "4px"
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action Bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    borderTop: "1px solid var(--border-subtle)"
                  }}
                >
                  {/* Engagement Metrics / Direct Sync Reducer Action */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <button
                      onClick={() => dispatch(postLiked({ id: post.id }))}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "transparent",
                        border: "none",
                        color: "var(--accent-rose)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      <Heart size={16} fill="var(--accent-rose)" />
                      <span>{post.likes}</span>
                    </button>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "var(--text-dim)",
                        fontSize: "0.82rem"
                      }}
                    >
                      <Share2 size={14} />
                      <span>{post.shares}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "var(--text-dim)",
                        fontSize: "0.82rem"
                      }}
                    >
                      <MessageSquare size={14} />
                      <span>{post.comments}</span>
                    </div>
                  </div>

                  {/* Actions: Thunk Publish, Edit, Thunk Delete */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {post.status !== "Published" && (
                      <button
                        onClick={() => handlePublish(post)}
                        disabled={isPublishing}
                        className="btn btn-success btn-sm"
                      >
                        <Send size={14} />
                        <span>Publish Async</span>
                      </button>
                    )}

                    <button
                      onClick={() => dispatch(openComposer(post.id))}
                      className="btn btn-secondary btn-sm"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(post)}
                      disabled={isPublishing}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
