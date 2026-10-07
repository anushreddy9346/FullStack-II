import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 5;

  // Backend API URL
  const API_URL = 'http://localhost:8080/api/tasks';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?page=${page}&size=${pageSize}&sort=id,desc`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setTasks(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showToast('Backend offline or unreachable', 'error');
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle.trim(), completed: false })
      });
      if (!response.ok) throw new Error('Failed to add task');
      
      await response.json();
      setNewTaskTitle(''); 
      showToast('Task added successfully!');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      showToast('Failed to add task', 'error');
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Failed to toggle task');

      const updatedTask = await response.json();
      setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
      showToast(updatedTask.completed ? 'Task completed! 🎉' : 'Task marked pending');
    } catch (error) {
      console.error('Error toggling task:', error);
      showToast('Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete task');

      showToast('Task deleted');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      showToast('Failed to delete task', 'error');
    }
  };

  // Filter & Search Logic on current page data
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'completed' ? task.completed :
      !task.completed;
    
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Page stats
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="app-viewport">
      {/* Background Animated Ambient Lights */}
      <div className="ambient-background">
        <div className="glow-sphere sphere-1"></div>
        <div className="glow-sphere sphere-2"></div>
        <div className="glow-sphere sphere-3"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <span className="toast-icon">
            {toast.type === 'error' ? '⚠️' : '✨'}
          </span>
          <span className="toast-message">{toast.message}</span>
        </div>
      )}

      <div className="main-wrapper">
        {/* Top Floating Badge */}
        <div className="status-pill">
          <span className="live-dot"></span>
          <span className="status-text">SPRING BOOT API ACTIVE</span>
          <span className="badge-divider">•</span>
          <span className="status-sub">H2 In-Memory DB</span>
        </div>

        {/* Main Glassmorphism Card */}
        <div className="glass-card">
          <header className="app-header">
            <div className="header-badge">EXPERIMENT 6</div>
            <h1 className="main-title">TaskMaster <span className="highlight-text">Pro</span></h1>
            <p className="sub-title">Scalable Read APIs • Caching & Pagination Optimization</p>
          </header>

          {/* Realtime Quick Stats Bar */}
          <div className="stats-dashboard">
            <div className="stat-card">
              <div className="stat-icon total-icon">📋</div>
              <div className="stat-info">
                <span className="stat-value">{totalElements}</span>
                <span className="stat-name">Total Tasks</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon done-icon">✅</div>
              <div className="stat-info">
                <span className="stat-value text-green">{completedCount}</span>
                <span className="stat-name">Completed (Page)</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending-icon">⏳</div>
              <div className="stat-info">
                <span className="stat-value text-amber">{pendingCount}</span>
                <span className="stat-name">Pending (Page)</span>
              </div>
            </div>
          </div>

          {/* New Task Input Form */}
          <form onSubmit={handleAddTask} className="task-form">
            <div className="input-container">
              <span className="input-icon">✦</span>
              <input
                type="text"
                className="task-input"
                placeholder="What is your next objective? (Press Enter to add)"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              {newTaskTitle && (
                <button 
                  type="button" 
                  className="clear-input-btn"
                  onClick={() => setNewTaskTitle('')}
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className="submit-btn" disabled={!newTaskTitle.trim()}>
              <span>Add Task</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </form>

          {/* Toolbar: Search + Filter Tabs */}
          <div className="toolbar">
            <div className="filter-tabs">
              <button 
                className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({tasks.length})
              </button>
              <button 
                className={`tab-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({pendingCount})
              </button>
              <button 
                className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed ({completedCount})
              </button>
            </div>

            <div className="search-box">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Filter tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Task List Section */}
          {loading ? (
            <div className="skeleton-container">
              <div className="skeleton-item"></div>
              <div className="skeleton-item"></div>
              <div className="skeleton-item"></div>
            </div>
          ) : (
            <div className="task-container">
              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-glow-circle">
                    <span className="empty-emoji">{searchQuery ? '🔍' : '🚀'}</span>
                  </div>
                  <h3>{searchQuery ? 'No matching tasks' : 'No tasks on this page'}</h3>
                  <p>{searchQuery ? 'Try adjusting your search criteria' : 'Create a new task above to get started!'}</p>
                </div>
              ) : (
                <div className="task-list">
                  {filteredTasks.map((task, idx) => (
                    <div 
                      key={task.id} 
                      className={`task-row ${task.completed ? 'is-completed' : ''}`}
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    >
                      <div className="task-left" onClick={() => handleToggleTask(task.id)}>
                        <div className={`checkbox-custom ${task.completed ? 'checked' : ''}`}>
                          {task.completed && (
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <div className="task-details">
                          <span className="task-text">{task.title}</span>
                          <div className="task-tags">
                            <span className="tag-id">#{task.id}</span>
                            <span className="tag-status">
                              {task.completed ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="task-actions">
                        <button 
                          className="action-btn toggle-btn" 
                          onClick={() => handleToggleTask(task.id)}
                          title={task.completed ? "Mark as Pending" : "Mark as Completed"}
                        >
                          {task.completed ? '↩' : '✓'}
                        </button>
                        <button 
                          className="action-btn delete-btn" 
                          onClick={() => handleDeleteTask(task.id)}
                          title="Delete task"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Footbar */}
              <div className="pagination-bar">
                <button 
                  className="page-nav-btn"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Previous
                </button>

                <div className="page-badge">
                  <span>Page</span>
                  <strong className="page-num">{page + 1}</strong>
                  <span>of</span>
                  <strong>{totalPages}</strong>
                </div>

                <button 
                  className="page-nav-btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages - 1}
                >
                  Next
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Credit */}
        <footer className="app-footer">
          <span>Student Task Manager • Full-Stack II Experiment 6</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
