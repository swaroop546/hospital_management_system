'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createPatientSchema } = require('../src/validators/patientValidator');

test('admin patient registration payload is accepted', () => {
  const result = createPatientSchema.safeParse({
    firstName: 'Test',
    lastName: 'Patient',
    dateOfBirth: '1995-01-15',
    gender: 'female',
    phone: '5551234567',
    email: '',
    bloodType: 'unknown',
    primaryDoctorId: '',
  });
  assert.equal(result.success, true);
});
