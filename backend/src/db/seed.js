'use strict';

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const VitalSign = require('../models/VitalSign');
const Department = require('../models/Department');
const { ROLES } = require('../utils/roles');

const hash = (value) => bcrypt.hashSync(value, 12);

const users = [
  ['usr-001', 'admin@hospital.dev', 'Admin@1234', 'Alexandra', 'Morgan', ROLES.ADMIN, 'Administration'],
  ['usr-002', 'doctor@hospital.dev', 'Doctor@1234', 'Dr. Marcus', 'Chen', ROLES.DOCTOR, 'Internal Medicine'],
  ['usr-003', 'nurse@hospital.dev', 'Nurse@1234', 'Sarah', 'Williams', ROLES.NURSE, 'General Ward'],
  ['usr-004', 'receptionist@hospital.dev', 'Recept@1234', 'James', 'Rivera', ROLES.RECEPTIONIST, 'Front Desk'],
  ['usr-005', 'patient@hospital.dev', 'Patient@1234', 'Emily', 'Johnson', ROLES.PATIENT, ''],
  ['usr-006', 'doctor2@hospital.dev', 'Doctor@1234', 'Dr. Priya', 'Patel', ROLES.DOCTOR, 'Cardiology'],
];

const seedDatabase = async () => {
  for (const [id, email, password, firstName, lastName, role, department] of users) {
    await User.updateOne(
      { _id: id },
      { $setOnInsert: { _id: id, email, passwordHash: hash(password), firstName, lastName, role, department, isActive: true } },
      { upsert: true }
    );
  }
  await Department.bulkWrite([
    { updateOne: { filter: { _id: 'dept-internal-medicine' }, update: { $setOnInsert: { _id: 'dept-internal-medicine', name: 'Internal Medicine', isActive: true } }, upsert: true } },
    { updateOne: { filter: { _id: 'dept-cardiology' }, update: { $setOnInsert: { _id: 'dept-cardiology', name: 'Cardiology', isActive: true } }, upsert: true } },
  ]);
  await Patient.updateOne(
    { _id: 'pat-001' },
    { $setOnInsert: { _id: 'pat-001', userId: 'usr-005', patientNumber: 'P-20240001', firstName: 'Emily', lastName: 'Johnson', dateOfBirth: '1990-03-15', gender: 'female', bloodType: 'O+', email: 'patient@hospital.dev', phone: '+1-555-0104', allergies: ['Penicillin'], primaryDoctorId: 'usr-002', isActive: true } },
    { upsert: true }
  );
  await Patient.updateOne(
    { _id: 'pat-002' },
    { $setOnInsert: { _id: 'pat-002', userId: null, patientNumber: 'P-20240002', firstName: 'Michael', lastName: 'Thompson', dateOfBirth: '1975-07-22', gender: 'male', bloodType: 'A-', email: 'michael.thompson@email.com', primaryDoctorId: 'usr-002', isActive: true } },
    { upsert: true }
  );
  await Appointment.updateOne(
    { _id: 'appt-001' },
    { $setOnInsert: { _id: 'appt-001', patientId: 'pat-001', doctorId: 'usr-002', departmentId: 'dept-internal-medicine', scheduledAt: new Date('2026-10-25T09:00:00.000Z'), durationMinutes: 30, type: 'General Checkup', reason: 'Annual physical examination', status: 'confirmed', notes: '', createdBy: 'usr-004' } },
    { upsert: true }
  );
  await VitalSign.updateOne(
    { _id: 'vit-001' },
    { $setOnInsert: { _id: 'vit-001', patientId: 'pat-001', recordedBy: 'usr-003', bloodPressureSystolic: 120, bloodPressureDiastolic: 80, heartRate: 72, temperature: 98.6, temperatureUnit: 'F', respiratoryRate: 16, oxygenSaturation: 98, recordedAt: new Date('2026-10-24T15:30:00.000Z') } },
    { upsert: true }
  );
};

module.exports = { seedDatabase };
