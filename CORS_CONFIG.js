// LifeTube Backend - CORS Configuration for Render Frontend
// Add this to your Railway backend server.js or app.js

const cors = require('cors');

// Allowed origins - update this list with your frontend URLs
const allowedOrigins = [
  'http://localhost:5173',           // Local development
  'http://localhost:5174',           // Alternative local port
  'https://lifetube-web.onrender.com', // Render frontend URL (update with your actual URL)
  'https://www.lifetube.com'         // Your custom domain (if configured)
];

// CORS middleware configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Alternative: Use environment variable for allowed origins
// In Railway, set: ALLOWED_ORIGINS=http://localhost:5173,https://lifetube-web.onrender.com

/*
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
*/
