import React, { useState, useEffect } from 'react';

export default function App() {
  // Registered Users (Pre-populated + saved in localStorage)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('app_registered_users');
    return saved ? JSON.parse(saved) : [
      { email: 'admin@example.com', password: 'admin123', role: 'Admin' },
      { email: 'editor@example.com', password: 'editor123', role: 'Editor' }
    ];
  });

  // Save registered users to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('app_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Authentication Form State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin'); // 'Admin' or 'Editor'
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  // Posts State
  const [posts, setPosts] = useState([
    { id: 1, title: 'Welcome to the Portal', content: 'This is a role-based access control demonstration.' },
    { id: 2, title: 'Frontend Authorization', content: 'Admin can Create, Read, Edit, and Delete posts. Editor can Create, Read, and Edit posts.' }
  ]);

  // Create Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Edit Form State
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Handle Login / Sign Up Submission with Password Matching
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please fill in both email and password.');
      return;
    }

    if (authMode === 'signup') {
      // Check if user already exists
      const existingUser = registeredUsers.find(u => u.email === trimmedEmail);
      if (existingUser) {
        setError('An account with this email already exists. Please Log In instead.');
        return;
      }

      if (trimmedPassword.length < 4) {
        setError('Password must be at least 4 characters long.');
        return;
      }

      // Register new user account
      const newUser = { email: trimmedEmail, password: trimmedPassword, role };
      setRegisteredUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setError('');
      setIsLoggedIn(true);

    } else {
      // LOGIN MODE - Verify email & password match
      const userMatch = registeredUsers.find(u => u.email === trimmedEmail);

      if (!userMatch) {
        setError('Account not found with this email. Please check your email or Sign Up.');
        return;
      }

      if (userMatch.password !== trimmedPassword) {
        setError('Incorrect password! Please enter the correct password.');
        return;
      }

      // Successful login
      setCurrentUser(userMatch);
      setRole(userMatch.role);
      setError('');
      setIsLoggedIn(true);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  // Create Post
  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim()
    };

    setPosts([newPost, ...posts]);
    setTitle('');
    setContent('');
  };

  // Edit Post
  const startEdit = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleUpdate = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, title: editTitle, content: editContent } : p));
    setEditingId(null);
  };

  // Delete Post (Admin Only)
  const handleDelete = (id) => {
    if (role !== 'Admin') {
      alert('Access Denied: Only Admin can delete posts.');
      return;
    }
    setPosts(posts.filter(p => p.id !== id));
  };

  // ================= SCREEN 1: LOGIN / SIGN UP PAGE =================
  if (!isLoggedIn) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <h2>{authMode === 'login' ? 'User Login' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {authMode === 'login' 
              ? 'Sign in with your email and password' 
              : 'Register your account credentials and select a role'}
          </p>

          {/* Error Message Box */}
          {error && <div className="error-alert">{error}</div>}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="auth-form">
            {authMode === 'signup' && (
              <div className="form-group">
                <label>Select User Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              {authMode === 'login' ? 'Login' : `Sign Up as ${role}`}
            </button>
          </form>

          {/* Toggle between Login and Sign Up */}
          <div className="auth-toggle">
            {authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button type="button" onClick={() => { setAuthMode('signup'); setError(''); }} className="toggle-btn">
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button type="button" onClick={() => { setAuthMode('login'); setError(''); }} className="toggle-btn">
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ================= SCREEN 2: DASHBOARD PAGE =================
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <h1>Role-Based Access Control</h1>
          <p>Logged in user: <strong>{currentUser?.email}</strong></p>
        </div>

        <div className="header-actions">
          <span className={`role-badge ${role.toLowerCase()}`}>
            {role} Mode
          </span>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Create Post Section */}
      <section className="content-card">
        <h3>Create New Post</h3>
        <form onSubmit={handleCreate} className="post-form">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
            required
          />
          <button type="submit" className="btn-add">Publish Post</button>
        </form>
      </section>

      {/* Posts List Section */}
      <section className="content-card">
        <h3>Posts Directory ({posts.length})</h3>

        {posts.length === 0 ? (
          <p className="empty-text">No posts available. Create a post above.</p>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                {editingId === post.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows="3"
                    />
                    <div className="button-group">
                      <button type="button" className="btn-save" onClick={() => handleUpdate(post.id)}>
                        Save Changes
                      </button>
                      <button type="button" className="btn-cancel" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4>{post.title}</h4>
                    <p>{post.content}</p>

                    <div className="button-group">
                      {/* Edit Button */}
                      <button type="button" className="btn-edit" onClick={() => startEdit(post)}>
                        Edit
                      </button>

                      {/* Delete Button (Active for Admin, Disabled for Editor) */}
                      {role === 'Admin' ? (
                        <button type="button" className="btn-delete" onClick={() => handleDelete(post.id)}>
                          Delete
                        </button>
                      ) : (
                        <button type="button" className="btn-disabled" disabled title="Only Admin can delete posts">
                          Delete (Admin Only)
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
