'use strict';

const { z } = require('zod');

const createConsultationSchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().optional(),
  chiefComplaint: z.string().min(1).max(500),
  presentingSymptoms: z.string().max(1000).optional().default(''),
  physicalExamination: z.string().max(2000).optional().default(''),
  assessment: z.string().max(2000).optional().default(''),
  plan: z.string().max(2000).optional().default(''),
  followUpDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
});

const createDiagnosisSchema = z.object({
  patientId: z.string().min(1),
  consultationId: z.string().optional(),
  icdCode: z.string().max(20).optional().default(''),
  description: z.string().min(1).max(500),
  severity: z.enum(['mild', 'moderate', 'severe']).optional().default('mild'),
  status: z.enum(['active', 'resolved', 'chronic']).optional().default('active'),
  diagnosedAt: z.string().datetime().optional(),
});

const createNoteSchema = z.object({
  patientId: z.string().min(1),
  consultationId: z.string().optional(),
  content: z.string().min(1).max(5000),
  noteType: z.enum(['clinical', 'nursing', 'administrative']).optional().default('clinical'),
});

module.exports = { createConsultationSchema, createDiagnosisSchema, createNoteSchema };
