import { useState, useEffect } from 'react'
import PostComposer from './PostComposer'
import PostList from './PostList'
import GlobalError from './GlobalError'
import './App.css'

const API_URL = 'http://localhost:8080/api/posts';

function App() {
  const [posts, setPosts] = useState([]);
  const [globalError, setGlobalError] = useState(null);
  const [filterPlatform, setFilterPlatform] = useState('All');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      setGlobalError("Could not connect to backend server. Make sure Spring Boot is running on port 8080.");
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      setGlobalError("Failed to create post.");
    }
  };

  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      setGlobalError("Failed to delete post.");
    }
  };

  const handleUpdatePost = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      setGlobalError("Failed to update post.");
    }
  };

  const totalWords = posts.reduce((acc, p) => acc + (p.content ? p.content.trim().split(/\s+/).filter(Boolean).length : 0), 0);
  const uniquePlatformsCount = new Set(posts.map(p => p.platform)).size;

  const filteredPosts = filterPlatform === 'All' 
    ? posts 
    : posts.filter(p => p.platform.toLowerCase() === filterPlatform.toLowerCase());

  return (
    <div className="studio-app">
      <GlobalError message={globalError} onClose={() => setGlobalError(null)} />
      
      {/* Top Navbar */}
      <header className="navbar">
        <div className="nav-brand">
          <div className="brand-logo">⚡</div>
          <div className="brand-text">
            <span className="brand-name">EasyPost Studio</span>
            <span className="brand-sub">Multi-Platform Content Manager</span>
          </div>
        </div>

        <div className="nav-stats">
          <div className="nav-stat-item">
            <span className="stat-num">{posts.length}</span>
            <span className="stat-lbl">Posts</span>
          </div>
          <div className="nav-stat-divider"></div>
          <div className="nav-stat-item">
            <span className="stat-num">{totalWords}</span>
            <span className="stat-lbl">Words</span>
          </div>
          <div className="nav-stat-divider"></div>
          <div className="nav-stat-item">
            <span className="stat-num">{uniquePlatformsCount}</span>
            <span className="stat-lbl">Channels</span>
          </div>
        </div>

        <div className="server-status-pill">
          <span className="status-dot"></span>
          <span>Spring Boot Active</span>
        </div>
      </header>

      {/* Dual-Pane Studio Main Layout */}
      <div className="studio-layout">
        <aside className="left-pane">
          <PostComposer 
            onPostCreate={handleCreatePost} 
            onError={setGlobalError} 
          />
        </aside>

        <section className="right-pane">
          <PostList 
            posts={filteredPosts} 
            totalCount={posts.length}
            currentFilter={filterPlatform}
            onFilterChange={setFilterPlatform}
            onDelete={handleDeletePost} 
            onUpdate={handleUpdatePost} 
          />
        </section>
      </div>
    </div>
  )
}

export default App;


