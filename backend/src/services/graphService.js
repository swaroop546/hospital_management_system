'use strict';

const { getDriver, neo4jStatus } = require('../db/neo4j');
const config = require('../config');

const run = async (query, params = {}) => {
  const driver = getDriver();
  if (!driver || !neo4jStatus().connected) return false;
  const session = driver.session({ database: config.neo4j.database });
  try {
    await session.run(query, params);
    return true;
  } catch (err) {
    console.error('[GRAPH_SYNC_FAILED]', err.message);
    return false;
  } finally {
    await session.close();
  }
};

const initializeGraph = async () => {
  await run('CREATE CONSTRAINT patient_id IF NOT EXISTS FOR (n:Patient) REQUIRE n.externalId IS UNIQUE');
  await run('CREATE CONSTRAINT doctor_id IF NOT EXISTS FOR (n:Doctor) REQUIRE n.externalId IS UNIQUE');
  await run('CREATE CONSTRAINT department_id IF NOT EXISTS FOR (n:Department) REQUIRE n.externalId IS UNIQUE');
  await run('CREATE CONSTRAINT appointment_id IF NOT EXISTS FOR (n:Appointment) REQUIRE n.externalId IS UNIQUE');
};

const syncPatient = (patient) => {
  if (!patient?.id) return Promise.resolve(false);
  return run(
  'MERGE (p:Patient {externalId: $id}) SET p.name = $name',
  { id: patient.id, name: `${patient.firstName} ${patient.lastName}` }
  );
};
const syncDoctor = (doctor) => {
  if (!doctor?.id) return Promise.resolve(false);
  return run(
  'MERGE (d:Doctor {externalId: $id}) SET d.name = $name',
  { id: doctor.id, name: `${doctor.firstName} ${doctor.lastName}` }
  );
};
const syncDepartment = (department) => {
  if (!department?.id) return Promise.resolve(false);
  return run(
  'MERGE (d:Department {externalId: $id}) SET d.name = $name',
  { id: department.id, name: department.name }
  );
};
const syncAppointment = (appointment) => {
  if (!appointment?.id || !appointment.patientId || !appointment.doctorId) return Promise.resolve(false);
  return run(
  'MERGE (a:Appointment {externalId: $id}) SET a.scheduledAt = $scheduledAt ' +
  'WITH a MATCH (p:Patient {externalId: $patientId}), (d:Doctor {externalId: $doctorId}) ' +
  'MERGE (p)-[:BOOKED]->(a) MERGE (d)-[:ATTENDS]->(a)',
  { id: appointment.id, scheduledAt: new Date(appointment.scheduledAt).toISOString(), patientId: appointment.patientId, doctorId: appointment.doctorId }
  );
};

module.exports = { initializeGraph, syncPatient, syncDoctor, syncDepartment, syncAppointment };
