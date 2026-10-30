'use strict';

const { z } = require('zod');

const createAppointmentSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  scheduledAt: z.string().datetime({ message: 'scheduledAt must be a valid ISO datetime' }),
  durationMinutes: z.number().int().min(10).max(240).default(30),
  type: z.string().min(1).max(100),
  reason: z.string().max(500).optional().default(''),
  notes: z.string().max(1000).optional().default(''),
});

const updateAppointmentSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
  durationMinutes: z.number().int().min(10).max(240).optional(),
  type: z.string().min(1).max(100).optional(),
  reason: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
  status: z
    .enum(['scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'])
    .optional(),
});

module.exports = { createAppointmentSchema, updateAppointmentSchema };
