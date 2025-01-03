import express, { json } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import jwt from "jsonwebtoken"
import appointmentRoutes from './routes/appointments.js';
import authRoutes from "./routes/authRoutes.js" ;
import UserRoutes from "./routes/userRoutes.js"


config();
const app = express();
let mongoURI;

// Middleware
app.use(json());
app.use(cors());

if (process.env.NODE_ENV === 'production') {
    mongoURI = process.env.MONGO_URI; // Use MONGO_URI from environment variables (e.g., Atlas URI)
  } 
  else {
    mongoURI = process.env.MONGO_LOCAL_URI; // Local MongoDB connection
  }
  

// Connect to MongoDB
connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB',mongoURI))
.catch((err) => console.log('Failed to connect to MongoDB:', err));

// Simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Sample route for a resource (Appointments)
// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.use('/api/auth', authRoutes);
app.use('/api/appointments',authenticateToken, appointmentRoutes);
app.use("/api/users",authenticateToken ,UserRoutes)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
