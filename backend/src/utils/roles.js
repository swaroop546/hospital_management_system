'use strict';

/**
 * Role definitions and permission maps.
 * Backend-enforced — never trust roles from the client request body.
 */

const ROLES = Object.freeze({
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist',
  PATIENT: 'patient',
});

/**
 * Coarse-grained permission sets per role.
 * Fine-grained resource ownership checks are handled in service layer.
 */
const PERMISSIONS = Object.freeze({
  // Users & staff
  VIEW_USERS: [ROLES.ADMIN],
  MANAGE_USERS: [ROLES.ADMIN],
  MANAGE_DEPARTMENTS: [ROLES.ADMIN],

  // Patients
  REGISTER_PATIENT: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  VIEW_PATIENT_LIST: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST],
  UPDATE_PATIENT_DEMOGRAPHICS: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  VIEW_OWN_PROFILE: [ROLES.PATIENT],

  // Appointments
  CREATE_APPOINTMENT: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT],
  VIEW_ALL_APPOINTMENTS: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  VIEW_OWN_APPOINTMENTS: [ROLES.DOCTOR, ROLES.NURSE, ROLES.PATIENT],
  MANAGE_APPOINTMENT_STATUS: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR],
  CANCEL_OWN_APPOINTMENT: [ROLES.PATIENT],

  // Clinical records
  VIEW_CLINICAL_RECORDS: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
  CREATE_CONSULTATION: [ROLES.DOCTOR],
  CREATE_DIAGNOSIS: [ROLES.DOCTOR],
  VIEW_OWN_MEDICAL_RECORDS: [ROLES.PATIENT],

  // Vitals
  RECORD_VITALS: [ROLES.NURSE, ROLES.DOCTOR],
  VIEW_VITALS: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
  VIEW_OWN_VITALS: [ROLES.PATIENT],
});

/**
 * Check if a role has a given permission.
 */
const hasPermission = (role, permission) => {
  const allowed = PERMISSIONS[permission];
  if (!allowed) return false;
  return allowed.includes(role);
};

module.exports = { ROLES, PERMISSIONS, hasPermission };
