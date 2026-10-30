'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { ROLES, hasPermission } = require('../src/utils/roles');

test('role permissions remain least-privilege', () => {
  assert.equal(hasPermission(ROLES.ADMIN, 'MANAGE_USERS'), true);
  assert.equal(hasPermission(ROLES.PATIENT, 'MANAGE_USERS'), false);
  assert.equal(hasPermission(ROLES.DOCTOR, 'RECORD_VITALS'), true);
  assert.equal(hasPermission(ROLES.PATIENT, 'RECORD_VITALS'), false);
});

test('unknown permissions are denied', () => {
  assert.equal(hasPermission(ROLES.ADMIN, 'MANAGE_UNKNOWN_RESOURCE'), false);
  assert.equal(hasPermission(ROLES.ADMIN, 'VIEW_UNKNOWN_RESOURCE'), false);
});
