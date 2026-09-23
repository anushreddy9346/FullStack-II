import React, { useState } from 'react';

const PLATFORM_CONFIG = {
  Twitter: { icon: '𝕏', class: 'twitter' },
  Instagram: { icon: '📸', class: 'instagram' },
  Facebook: { icon: '📘', class: 'facebook' },
  LinkedIn: { icon: '💼', class: 'linkedin' }
};

const PostList = ({ posts, totalCount, currentFilter, onFilterChange, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleEditClick = (post) => {
    setEditingId(post.id);
    setEditContent(post.content);
  };

  const handleSaveClick = (id, platform) => {
    onUpdate(id, { platform, content: editContent });
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleCopyClick = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const countWords = (text) => {
    return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  };

  const filters = ['All', 'Twitter', 'Instagram', 'Facebook', 'LinkedIn'];

  return (
    <div className="post-list-container">
      <div className="post-list-header">
        <div className="list-title">
          <h2>Published Posts & Drafts</h2>
          <span className="post-count-badge">{posts.length} {posts.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="filter-chips">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-chip ${currentFilter === filter ? 'active' : ''}`}
              onClick={() => onFilterChange(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts-card">
          <div className="empty-icon">📮</div>
          <h3>No posts found</h3>
          <p>{totalCount === 0 ? "You haven't created any posts yet. Select a platform above and compose your first draft!" : `No posts matching "${currentFilter}".`}</p>
        </div>
      ) : (
        <div className="post-grid">
          {posts.map(post => {
            const config = PLATFORM_CONFIG[post.platform] || { icon: '💬', class: 'generic' };
            const wordCount = countWords(post.content);
            const isEditing = editingId === post.id;

            return (
              <div key={post.id} className={`post-card platform-border-${config.class}`}>
                <div className="post-header">
                  <span className={`platform-badge ${config.class}`}>
                    <span className="badge-icon">{config.icon}</span>
                    <span className="badge-name">{post.platform}</span>
                  </span>

                  <div className="post-actions">
                    {isEditing ? (
                      <>
                        <button className="action-btn save" onClick={() => handleSaveClick(post.id, post.platform)}>
                          ✓ Save
                        </button>
                        <button className="action-btn cancel" onClick={handleCancelClick}>
                          ✕ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="action-btn copy" 
                          onClick={() => handleCopyClick(post.id, post.content)}
                          title="Copy to clipboard"
                        >
                          {copiedId === post.id ? '✓ Copied' : '📋 Copy'}
                        </button>
                        <button className="action-btn edit" onClick={() => handleEditClick(post)} title="Edit post">
                          ✏️ Edit
                        </button>
                        <button className="action-btn delete" onClick={() => onDelete(post.id)} title="Delete post">
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="post-body">
                  {isEditing ? (
                    <textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows="4"
                      className="edit-textarea"
                    />
                  ) : (
                    <p className="post-content-text">{post.content}</p>
                  )}
                </div>

                <div className="post-card-footer">
                  <span className="meta-info">
                    {wordCount} words &bull; {post.content.length} chars
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostList;

