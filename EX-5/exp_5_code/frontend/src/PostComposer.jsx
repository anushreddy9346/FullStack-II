import React, { useState } from 'react';

const PLATFORMS = [
  { name: 'Twitter', limit: 50, icon: '𝕏', handle: '@easypost', color: '#38bdf8' },
  { name: 'Instagram', limit: 100, icon: '📸', handle: 'easypost_app', color: '#f43f5e' },
  { name: 'Facebook', limit: 200, icon: '📘', handle: 'EasyPost Official', color: '#3b82f6' },
  { name: 'LinkedIn', limit: 300, icon: '💼', handle: 'EasyPost Inc.', color: '#0284c7' }
];

const SAMPLE_POSTS = {
  Twitter: "Excited to launch our new feature today! Check it out and let us know your thoughts. 🚀 #Tech #Innovation",
  Instagram: "Visual stories speak louder than words. Exploring new creative boundaries with design & code. Drop a comment below! ✨📸",
  Facebook: "We are thrilled to announce our latest milestone! Thank you to our amazing community for all the support. Stay tuned for exciting updates ahead! 🎉",
  LinkedIn: "Leadership in modern software development requires adaptability and continuous learning. Here are key insights we learned building scalable full-stack applications. #SoftwareEngineering"
};

const PostComposer = ({ onPostCreate, onError }) => {
  const [platform, setPlatform] = useState('Twitter');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  const currentPlatformObj = PLATFORMS.find(p => p.name === platform) || PLATFORMS[0];
  const limit = currentPlatformObj.limit;

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = countWords(content);
  const percentage = Math.min(100, Math.round((wordCount / limit) * 100));

  // Circular gauge math
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  const handleContentChange = (e) => {
    const text = e.target.value;
    const words = countWords(text);

    if (words > limit) {
      onError(`Word limit reached for ${platform}! Maximum allowed is ${limit} words.`);
      const truncatedText = text.trim().split(/\s+/).slice(0, limit).join(' ');
      setContent(truncatedText + (text.endsWith(' ') ? ' ' : ''));
    } else {
      onError(null);
      setContent(text);
    }
  };

  const handlePlatformSelect = (selectedPlatform) => {
    setPlatform(selectedPlatform);
    setContent('');
    onError(null);
  };

  const handleInsertSample = () => {
    const sample = SAMPLE_POSTS[platform] || "";
    setContent(sample);
    onError(null);
  };

  const handleClear = () => {
    setContent('');
    onError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onPostCreate({ platform, content });
    setContent('');
    onError(null);
  };

  return (
    <div className="composer-studio-card">
      <div className="card-top-bar">
        <div className="panel-title">
          <span className="title-icon">⚡</span>
          <h3>Content Composer</h3>
        </div>
        
        <div className="quick-actions">
          <button type="button" className="text-action-btn" onClick={handleInsertSample}>
            ✨ Sample
          </button>
          {content && (
            <button type="button" className="text-action-btn clear" onClick={handleClear}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Platform Selector */}
        <div className="studio-group">
          <span className="studio-label">Target Channel</span>
          <div className="channel-selector-pills">
            {PLATFORMS.map((p) => {
              const isSelected = platform === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  className={`channel-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => handlePlatformSelect(p.name)}
                  style={{ '--brand-color': p.color }}
                >
                  <span className="pill-icon">{p.icon}</span>
                  <span className="pill-name">{p.name}</span>
                  <span className="pill-limit">{p.limit}w</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Input Area with Radial SVG Gauge */}
        <div className="studio-group">
          <div className="label-with-gauge">
            <span className="studio-label">Draft Message</span>
            
            {/* SVG Circular Radial Progress Gauge */}
            <div className="radial-gauge-wrapper">
              <svg className="radial-gauge" width="52" height="52" viewBox="0 0 52 52">
                <circle
                  className="gauge-bg"
                  cx="26"
                  cy="26"
                  r={radius}
                  strokeWidth="4"
                />
                <circle
                  className={`gauge-fill ${percentage >= 90 ? 'danger' : percentage >= 75 ? 'warning' : ''}`}
                  cx="26"
                  cy="26"
                  r={radius}
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ stroke: currentPlatformObj.color }}
                />
              </svg>
              <div className="gauge-text">
                <span className="gauge-count">{wordCount}</span>
                <span className="gauge-max">/{limit}</span>
              </div>
            </div>
          </div>

          <div className="studio-textarea-box">
            <textarea 
              rows="6"
              placeholder={`Write your post for ${platform}...`}
              value={content}
              onChange={handleContentChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="studio-submit-row">
          <button 
            type="button" 
            className="toggle-preview-btn"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? '👁️ Hide Preview' : '👁️ Show Preview'}
          </button>

          <button 
            type="submit" 
            className="publish-btn"
            disabled={!content.trim()}
          >
            🚀 Publish to {platform}
          </button>
        </div>
      </form>

      {/* Live Social Card Preview Box */}
      {showPreview && content.trim() && (
        <div className="social-preview-box">
          <div className="preview-header">
            <span className="preview-label">Live {platform} Preview</span>
            <span className="preview-badge" style={{ background: currentPlatformObj.color }}>
              {currentPlatformObj.icon} {platform}
            </span>
          </div>

          <div className="preview-card-body">
            <div className="preview-author-row">
              <div className="avatar-circle" style={{ background: currentPlatformObj.color }}>
                {currentPlatformObj.icon}
              </div>
              <div className="author-info">
                <span className="author-name">EasyPost Creator</span>
                <span className="author-handle">{currentPlatformObj.handle}</span>
              </div>
            </div>
            <p className="preview-text">{content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComposer;


