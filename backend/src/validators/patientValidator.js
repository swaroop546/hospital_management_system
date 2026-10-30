'use strict';

const { z } = require('zod');

const createPatientSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(7).max(20),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']).optional(),
  address: z
    .object({
      street: z.string().max(200).optional(),
      city: z.string().max(100).optional(),
      state: z.string().max(100).optional(),
      zip: z.string().max(20).optional(),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string().max(150).optional(),
      relation: z.string().max(100).optional(),
      phone: z.string().max(20).optional(),
    })
    .optional(),
  allergies: z.array(z.string().max(100)).optional(),
  insuranceProvider: z.string().max(150).optional().or(z.literal('')),
  insurancePolicyNumber: z.string().max(100).optional().or(z.literal('')),
  primaryDoctorId: z.string().optional().or(z.literal('')),
});

const updatePatientSchema = createPatientSchema.partial();

module.exports = { createPatientSchema, updatePatientSchema };
