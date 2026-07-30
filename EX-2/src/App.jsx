import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPost, deletePost, toggleLike } from "./features/posts/postsSlice";
import { togglePlatform } from "./features/platforms/platformsSlice";
import { Layers, Plus, Trash2, Heart, CheckCircle2, XCircle, Filter } from "lucide-react";

// Platform Icon helper for Instagram, Facebook, and Twitter
function PlatformIcon({ platformId, size = 18, color = "currentColor" }) {
  if (platformId === "instagram") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    );
  }
  if (platformId === "facebook") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.69c0-2.47 1.47-3.83 3.72-3.83 1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.23 0-1.61.76-1.61 1.54V12h2.74l-.44 3h-2.3v6.8c4.56-.93 8-4.96 8-9.8z"/>
      </svg>
    );
  }
  if (platformId === "twitter") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }
  return null;
}

export function App() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const platforms = useSelector((state) => state.platforms);

  // Local state for platform filter and post form
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");

  // Map platform IDs to objects
  const platformMap = platforms.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {});

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    dispatch(
      addPost({
        title,
        content,
        platformId: selectedPlatform
      })
    );

    setTitle("");
    setContent("");
  };

  const filteredPosts = posts.filter(
    (post) => selectedFilter === "ALL" || post.platformId === selectedFilter
  );

  const activePlatformCount = platforms.filter((p) => p.connected).length;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          padding: "20px 32px",
          background: "rgba(18, 24, 36, 0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Layers size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Redux Toolkit State Manager</h1>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Centralized Store • Posts & Platforms
            </p>
          </div>
        </div>

        {/* Global Summary Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            background: "rgba(10, 13, 20, 0.5)",
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            fontSize: "0.85rem"
          }}
        >
          <div>
            <span style={{ color: "var(--text-dim)", marginRight: "6px" }}>Total Posts:</span>
            <strong style={{ color: "#fff" }}>{posts.length}</strong>
          </div>
          <div style={{ width: "1px", height: "16px", background: "var(--border-subtle)" }} />
          <div>
            <span style={{ color: "var(--text-dim)", marginRight: "6px" }}>Connected Platforms:</span>
            <strong style={{ color: "var(--accent-emerald)" }}>{activePlatformCount}</strong> / 3
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          maxWidth: "1000px",
          width: "100%",
          margin: "0 auto",
          padding: "32px 20px 60px 20px",
          flex: 1
        }}
      >
        {/* Platforms Grid */}
        <section style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "14px", color: "var(--text-main)" }}>
            Social Platforms
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px"
            }}
          >
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="glass-card"
                style={{
                  padding: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderColor: selectedFilter === platform.id ? platform.color : "var(--border-subtle)",
                  opacity: platform.connected ? 1 : 0.6
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: `${platform.color}20`,
                      border: `1px solid ${platform.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <PlatformIcon platformId={platform.id} size={22} color={platform.color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{platform.name}</h3>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{platform.handle}</span>
                  </div>
                </div>

                {/* Connection Toggle */}
                <button
                  onClick={() => dispatch(togglePlatform(platform.id))}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    background: platform.connected ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)",
                    color: platform.connected ? "#34d399" : "#fca5a5",
                    border: `1px solid ${platform.connected ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)"}`,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {platform.connected ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  <span>{platform.connected ? "Connected" : "Off"}</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Add Post Form Card */}
        <section className="glass-card" style={{ padding: "24px", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Plus size={18} color="var(--accent-indigo)" /> Create New Post
          </h2>

          <form onSubmit={handleAddPost}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "14px" }}>
              <div>
                <label className="form-label">Post Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Target Platform</label>
                <select
                  className="form-select"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label className="form-label">Content</label>
              <textarea
                className="form-textarea"
                placeholder="Write content here..."
                style={{ minHeight: "80px" }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Add Post to Redux Store
            </button>
          </form>
        </section>

        {/* Posts Feed Header & Filter Tabs */}
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px"
            }}
          >
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Posts Feed</h2>

            {/* Filter Buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              {["ALL", "instagram", "facebook", "twitter"].map((pId) => {
                const isSelected = selectedFilter === pId;
                const pObj = platformMap[pId];
                return (
                  <button
                    key={pId}
                    onClick={() => setSelectedFilter(pId)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      border: `1px solid ${isSelected ? "var(--accent-indigo)" : "var(--border-subtle)"}`,
                      background: isSelected ? "rgba(99, 102, 241, 0.2)" : "rgba(10, 13, 20, 0.3)",
                      color: isSelected ? "#fff" : "var(--text-muted)",
                      cursor: "pointer"
                    }}
                  >
                    {pId === "ALL" ? "All Platforms" : pObj?.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Posts Cards */}
          {filteredPosts.length === 0 ? (
            <div className="glass-card" style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
              No posts found for selected platform filter.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredPosts.map((post) => {
                const platform = platformMap[post.platformId];
                return (
                  <div key={post.id} className="glass-card" style={{ padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {platform && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              background: `${platform.color}20`,
                              border: `1px solid ${platform.color}40`,
                              color: platform.color,
                              fontSize: "0.78rem",
                              fontWeight: 700
                            }}
                          >
                            <PlatformIcon platformId={platform.id} size={14} color={platform.color} />
                            {platform.name}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => dispatch(deletePost(post.id))}
                        className="btn btn-danger btn-sm"
                        title="Delete Post from Redux Store"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>

                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "6px" }}>{post.title}</h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-main)", lineHeight: 1.5, marginBottom: "14px" }}>
                      {post.content}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-subtle)", paddingTop: "10px" }}>
                      <button
                        onClick={() => dispatch(toggleLike(post.id))}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--accent-rose)",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        <Heart size={16} fill="var(--accent-rose)" /> {post.likes} Likes
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
