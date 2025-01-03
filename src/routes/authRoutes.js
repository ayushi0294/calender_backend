import { Router } from 'express';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken'; // Import the default export from jsonwebtoken
import User from '../models/User.js';

const { sign } = jwt; // Destructure the `sign` method from the default export

const router = Router();

// Register
router.post('/register', async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      // Check if a user already exists with the provided email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'Email is already registered. Please log in.' });
      }
  
      // Hash the password before saving it
      const hashedPassword = await hash(password, 10);
  
      // Create a new user with the provided data
      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
