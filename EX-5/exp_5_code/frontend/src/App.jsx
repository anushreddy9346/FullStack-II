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
    <div className="app-container">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <GlobalError message={globalError} onClose={() => setGlobalError(null)} />
      
      <header className="app-header">
        <div className="logo-badge">⚡ EASY POST</div>
        <h1>EasyPost Composer</h1>
        <p className="subtitle">Craft once, publish seamlessly. Smart word limits & live multi-platform preview.</p>
        
        <div className="stats-bar">
          <div className="stat-card">
            <span className="stat-value">{posts.length}</span>
            <span className="stat-label">Total Drafts</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalWords}</span>
            <span className="stat-label">Total Words</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{uniquePlatformsCount}</span>
            <span className="stat-label">Active Channels</span>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <PostComposer 
          onPostCreate={handleCreatePost} 
          onError={setGlobalError} 
        />
        <PostList 
          posts={filteredPosts} 
          totalCount={posts.length}
          currentFilter={filterPlatform}
          onFilterChange={setFilterPlatform}
          onDelete={handleDeletePost} 
          onUpdate={handleUpdatePost} 
        />
      </main>

      <footer className="app-footer">
        <p>EasyPost Composer &bull; Powered by React & Spring Boot</p>
      </footer>
    </div>
  )
}

export default App;

