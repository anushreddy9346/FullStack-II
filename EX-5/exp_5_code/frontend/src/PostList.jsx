import React, { useState } from 'react';

const PLATFORM_CONFIG = {
  Twitter: { icon: '𝕏', class: 'twitter', color: '#38bdf8' },
  Instagram: { icon: '📸', class: 'instagram', color: '#f43f5e' },
  Facebook: { icon: '📘', class: 'facebook', color: '#3b82f6' },
  LinkedIn: { icon: '💼', class: 'linkedin', color: '#0284c7' }
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
    <div className="feed-container">
      {/* Feed Header */}
      <div className="feed-header">
        <div className="feed-title">
          <h3>Published Content Feed</h3>
          <span className="count-tag">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
        </div>

        {/* Filter Pills */}
        <div className="filter-pills-row">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`feed-filter-btn ${currentFilter === filter ? 'active' : ''}`}
              onClick={() => onFilterChange(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List / Cards */}
      {posts.length === 0 ? (
        <div className="empty-feed-box">
          <div className="empty-symbol">📭</div>
          <h4>No posts found</h4>
          <p>{totalCount === 0 ? "Your feed is empty. Draft your first post using the Content Composer on the left!" : `No posts matching channel "${currentFilter}".`}</p>
        </div>
      ) : (
        <div className="feed-cards-list">
          {posts.map((post, idx) => {
            const config = PLATFORM_CONFIG[post.platform] || { icon: '💬', class: 'generic', color: '#a855f7' };
            const wordCount = countWords(post.content);
            const isEditing = editingId === post.id;

            return (
              <div key={post.id} className="feed-card" style={{ '--card-accent': config.color }}>
                <div className="feed-card-header">
                  <div className="platform-tag" style={{ background: `${config.color}22`, color: config.color, borderColor: `${config.color}44` }}>
                    <span className="tag-icon">{config.icon}</span>
                    <span className="tag-text">{post.platform}</span>
                  </div>

                  <div className="card-actions-group">
                    {isEditing ? (
                      <>
                        <button className="btn-sm save" onClick={() => handleSaveClick(post.id, post.platform)}>
                          ✓ Save
                        </button>
                        <button className="btn-sm cancel" onClick={handleCancelClick}>
                          ✕ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="btn-sm copy" 
                          onClick={() => handleCopyClick(post.id, post.content)}
                          title="Copy text"
                        >
                          {copiedId === post.id ? '✓ Copied' : '📋 Copy'}
                        </button>
                        <button className="btn-sm edit" onClick={() => handleEditClick(post)} title="Edit">
                          ✏️ Edit
                        </button>
                        <button className="btn-sm delete" onClick={() => onDelete(post.id)} title="Delete">
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="feed-card-body">
                  {isEditing ? (
                    <textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows="4"
                      className="studio-edit-input"
                    />
                  ) : (
                    <p className="feed-text">{post.content}</p>
                  )}
                </div>

                <div className="feed-card-footer">
                  <span className="card-stat">
                    {wordCount} words &bull; {post.content.length} characters
                  </span>
                  <span className="card-id">ID #{post.id}</span>
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


