import { Router } from 'express';
import User from '../models/User.js';
const router = Router();

router.get('/', async (req, res) => {
    try {
      const doctors = await User.find({ role: "doctor" }); // Only select name and email for doctors
      res.status(200).json(doctors); // Send doctors list as JSON
    } catch (err) {
      console.error('Error fetching doctors:', err);
      res.status(500).json({ message: 'Server error' }); // Handle errors
    }
  });

  export default router;