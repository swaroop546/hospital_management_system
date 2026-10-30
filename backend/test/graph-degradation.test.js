'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { syncPatient } = require('../src/services/graphService');

test('graph synchronization reports unavailable projection explicitly', async () => {
  const synchronized = await syncPatient({ id: 'pat-test', firstName: 'Test', lastName: 'Patient' });
  assert.equal(synchronized, false);
});
