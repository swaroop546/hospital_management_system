'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { loginSchema } = require('../src/validators/authValidator');
const { createAppointmentSchema } = require('../src/validators/appointmentValidator');

test('login validation rejects malformed credentials', () => {
  assert.equal(loginSchema.safeParse({ email: 'invalid', password: '' }).success, false);
});

test('appointment validation accepts a valid appointment', () => {
  const result = createAppointmentSchema.safeParse({
    patientId: 'pat-001',
    doctorId: 'usr-002',
    scheduledAt: '2026-10-25T09:00:00.000Z',
    durationMinutes: 30,
    type: 'General Checkup',
    reason: 'Annual examination',
  });
  assert.equal(result.success, true);
});
