import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import connectDatabase from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import passport from './config/passport.js';

dotenv.config();

const port = process.env.PORT || 3000;

// Connect DB
connectDatabase();
const app = express();

// CORS Configuration (must be before routes)
app.use(cors({
  origin: ["http://localhost:5173", "https://blog-it-frontend-deployment.vercel.app"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Middleware
app.use(express.json());

// Session middleware (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Error handling for JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON:', err);
    return res.status(400).json({ message: 'Invalid JSON format' });
  }
  next();
});



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/user', userRoutes);

// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
