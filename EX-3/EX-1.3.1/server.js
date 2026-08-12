import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5000;

// Secret key used to sign and verify JWT tokens
const JWT_SECRET = 'fullstack-lab-jwt-secret-key-2026';

app.use(cors());
app.use(express.json());

// Simulated User Database
const USERS = [
  {
    id: 'usr_001',
    name: 'Alice Johnson',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    department: 'Cyber Security & Systems'
  },
  {
    id: 'usr_002',
    name: 'Bob Smith',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    department: 'Frontend Engineering'
  }
];

// Helper: Custom request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  const authHeader = req.headers.authorization ? `${req.headers.authorization.substring(0, 30)}...` : 'None';
  console.log(`[${timestamp}] ${req.method} ${req.path} | Authorization: ${authHeader}`);
  next();
});

// Middleware: Verify JWT Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access Denied: No Token Provided',
      message: 'HTTP 401 Unauthorized - An Authorization Bearer token is required to access this resource.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      const isExpired = err.name === 'TokenExpiredError';
      return res.status(401).json({
        success: false,
        error: isExpired ? 'Token Expired' : 'Invalid Token Signature',
        message: isExpired 
          ? 'HTTP 401 Unauthorized - Token lifetime expired. Please re-authenticate.'
          : 'HTTP 401 Unauthorized - Signature verification failed! Token may have been tampered with.',
        details: err.message
      });
    }

    req.user = decodedUser;
    next();
  });
}

// Middleware: Require Admin Role
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Forbidden Access',
      message: `HTTP 403 Forbidden - Role '${req.user?.role || 'unknown'}' lacks Admin privileges.`
    });
  }
}

// ==========================================
// API ROUTES
// ==========================================

// Public Route: Login & Issue JWT
app.post('/api/login', (req, res) => {
  const { email, password, expiresIn = '1h' } = req.body;

  const user = USERS.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid Credentials',
      message: 'Invalid email or password combination. Try admin@example.com / password123'
    });
  }

  // Create token payload (Claims)
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
  };

  // Sign JWT token
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

  // Decode unverified to inspect iat and exp
  const decodedClaims = jwt.decode(token);

  res.json({
    success: true,
    message: 'Authentication successful! JWT token generated.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    },
    claims: decodedClaims
  });
});

// Protected Route: Get Current User Profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Protected user profile retrieved successfully using valid JWT.',
    user: req.user,
    serverTime: new Date().toISOString(),
    sessionInfo: {
      issuedAt: new Date(req.user.iat * 1000).toLocaleString(),
      expiresAt: new Date(req.user.exp * 1000).toLocaleString(),
      secondsRemaining: Math.max(0, req.user.exp - Math.floor(Date.now() / 1000))
    }
  });
});

// Admin Protected Route: System Stats
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to confidential system statistics (Admin Role verified).',
    stats: {
      activeSessions: 14,
      totalUsers: 1250,
      jwtAlgorithm: 'HS256 (HMAC with SHA-256)',
      serverUptime: `${Math.floor(process.uptime())} seconds`,
      securityAlerts: 0
    }
  });
});

// Token Verification Endpoint
app.post('/api/verify-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({
        valid: false,
        error: err.name,
        message: err.message
      });
    }

    res.json({
      valid: true,
      decoded
    });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'JWT Authentication API Server', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 JWT Auth API Server running on http://localhost:${PORT}`);
});
