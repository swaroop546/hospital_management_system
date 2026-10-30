'use strict';

const { z } = require('zod');

const recordVitalsSchema = z.object({
  patientId: z.string().min(1),
  bloodPressureSystolic: z.number().int().min(50).max(300).optional(),
  bloodPressureDiastolic: z.number().int().min(20).max(200).optional(),
  heartRate: z.number().int().min(20).max(300).optional(),
  temperature: z.number().min(30).max(45).optional(),
  temperatureUnit: z.enum(['C', 'F']).optional().default('F'),
  respiratoryRate: z.number().int().min(4).max(60).optional(),
  oxygenSaturation: z.number().int().min(50).max(100).optional(),
  heightCm: z.number().min(30).max(300).optional(),
  weightKg: z.number().min(1).max(500).optional(),
  notes: z.string().max(1000).optional().default(''),
  recordedAt: z.string().datetime().optional(),
});

module.exports = { recordVitalsSchema };
