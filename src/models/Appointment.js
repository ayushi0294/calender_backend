import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  doctorName: { type: String, required: true },
  patientName: { type: String, required: true },
  startDate: { type: Date, required: true }, // Date and time combined
  endDate: { type: Date, required: true },   // Date and time combined
  type: { type: String, required: true },
  diagnosis: {
    details: { type: String, required: true }, // Short description or details
    code: { type: String, required: false },  // Optional ICD or diagnosis code
    notes: { type: String, required: false }, // Optional extra notes
  },
});

const Appointment = model('Appointment', appointmentSchema);

export default Appointment;
