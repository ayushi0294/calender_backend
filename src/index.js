import express, { json } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import appointmentRoutes from './routes/appointments.js';

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

app.use('/api/appointments', appointmentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
