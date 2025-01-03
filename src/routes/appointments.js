import express from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

const router = express.Router();

// Authorization Middleware
const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ error: 'Access forbidden' });
  }
  next();
};

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const query = req.user.role === 'doctor'
    ? { doctorId: req.user.id }  // If doctor, use doctorId
    : { userId: req.user.id }; 
    
    const appointments = await Appointment.find(query).populate('userId', 'name') // populate doctor info
    .exec();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new appointment
router.post('/',authorizeRole("user"), async (req, res) => {
  const { doctorId, patientName, startDate, endDate, type, diagnosis } = req.body;
  const appointment = new Appointment({   startDate,doctorId, patientName, endDate, type, diagnosis , userId: req.user.id, });

  try {
    if (!doctorId || !patientName || !startDate || !endDate || !type || !diagnosis.details) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an appointment
router.put('/:id', authorizeRole("user"), async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an appointment
router.delete('/:id',authorizeRole("user"), async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
