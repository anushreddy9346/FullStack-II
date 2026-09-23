import React, { useState } from 'react';

const PLATFORMS = [
  { name: 'Twitter', limit: 50, icon: '𝕏', desc: '50 words limit', color: '#38bdf8' },
  { name: 'Instagram', limit: 100, icon: '📸', desc: '100 words limit', color: '#f43f5e' },
  { name: 'Facebook', limit: 200, icon: '📘', desc: '200 words limit', color: '#3b82f6' },
  { name: 'LinkedIn', limit: 300, icon: '💼', desc: '300 words limit', color: '#0284c7' }
];

const WORD_LIMITS = PLATFORMS.reduce((acc, p) => ({ ...acc, [p.name]: p.limit }), {});

const SAMPLE_POSTS = {
  Twitter: "Excited to launch our new feature today! Check it out and let us know your thoughts. 🚀 #Tech #Innovation",
  Instagram: "Visual stories speak louder than words. Exploring new creative boundaries with design & code. Drop a comment below! ✨📸",
  Facebook: "We are thrilled to announce our latest milestone! Thank you to our amazing community for all the support. Stay tuned for exciting updates ahead! 🎉",
  LinkedIn: "Leadership in modern software development requires adaptability and continuous learning. Here are 3 key insights we learned building scalable full-stack applications. #SoftwareEngineering"
};

const PostComposer = ({ onPostCreate, onError }) => {
  const [platform, setPlatform] = useState('Twitter');
  const [content, setContent] = useState('');

  const currentPlatformObj = PLATFORMS.find(p => p.name === platform) || PLATFORMS[0];
  const limit = currentPlatformObj.limit;

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = countWords(content);
  const percentage = Math.min(100, Math.round((wordCount / limit) * 100));

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onPostCreate({ platform, content });
    setContent('');
    onError(null);
  };

  return (
    <div className="composer-card">
      <div className="composer-header">
        <div className="composer-title-wrapper">
          <span className="composer-icon">✍️</span>
          <h2>Create New Post</h2>
        </div>
        <button 
          type="button" 
          className="sample-btn" 
          onClick={handleInsertSample}
          title="Insert sample text for platform"
        >
          ✨ Insert Sample
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="input-label">Choose Target Channel</label>
          <div className="platform-grid">
            {PLATFORMS.map((p) => {
              const isSelected = platform === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  className={`platform-tab ${isSelected ? 'active' : ''}`}
                  onClick={() => handlePlatformSelect(p.name)}
                  style={{ '--tab-color': p.color }}
                >
                  <span className="platform-icon">{p.icon}</span>
                  <div className="platform-info">
                    <span className="platform-name">{p.name}</span>
                    <span className="platform-limit">{p.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <div className="textarea-label-row">
            <label className="input-label">Content Draft</label>
            <span className={`limit-badge ${percentage >= 90 ? 'warning' : ''}`}>
              {wordCount} / {limit} words
            </span>
          </div>

          <div className="textarea-wrapper">
            <textarea 
              rows="5"
              placeholder={`Write your ${platform} post here...`}
              value={content}
              onChange={handleContentChange}
            />
            
            <div className="progress-bar-container">
              <div 
                className={`progress-bar-fill ${percentage >= 90 ? 'danger' : percentage >= 75 ? 'warning' : ''}`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="composer-footer">
          <span className="char-counter">
            {content.length} characters
          </span>
          <button 
            type="submit" 
            className="primary-btn" 
            disabled={!content.trim()}
          >
            🚀 Publish Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostComposer;

