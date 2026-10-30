import api from './client';

const request = async (method, url, data, config) => {
  const res = method === 'get' ? await api.get(url, config) : await api[method](url, data, config);
  return res.data;
};

export const hmsApi = {
  listUsers: (params = {}) => request('get', '/users', undefined, { params }),
  getUser: (id) => request('get', `/users/${id}`),
  createUser: (data) => request('post', '/users', data),
  updateUser: (id, data) => request('patch', `/users/${id}`, data),
  listPatients: (params = {}) => request('get', '/patients', undefined, { params }),
  getMyPatient: () => request('get', '/patients/me'),
  getPatient: (id) => request('get', `/patients/${id}`),
  createPatient: (data) => request('post', '/patients', data),
  updatePatient: (id, data) => request('patch', `/patients/${id}`, data),

  listDoctors: () => request('get', '/users/doctors'),
  listDepartments: () => request('get', '/departments'),
  createDepartment: (data) => request('post', '/departments', data),
  updateDepartment: (id, data) => request('patch', `/departments/${id}`, data),
  listNotifications: () => request('get', '/notifications'),
  createNotification: (data) => request('post', '/notifications', data),
  markNotificationRead: (id) => request('patch', `/notifications/${id}/read`, {}),

  listAppointments: (params = {}) => request('get', '/appointments', undefined, { params }),
  createAppointment: (data) => request('post', '/appointments', data),
  updateAppointment: (id, data) => request('patch', `/appointments/${id}`, data),

  listConsultations: (patientId) =>
    request('get', '/medical-records/consultations', undefined, { params: { patientId } }),
  createConsultation: (data) => request('post', '/medical-records/consultations', data),
  finalizeConsultation: (id, data = {}) =>
    request('patch', `/medical-records/consultations/${id}/finalize`, data),
  listDiagnoses: (patientId) =>
    request('get', '/medical-records/diagnoses', undefined, { params: { patientId } }),
  createDiagnosis: (data) => request('post', '/medical-records/diagnoses', data),
  listNotes: (patientId) =>
    request('get', '/medical-records/notes', undefined, { params: { patientId } }),
  createNote: (data) => request('post', '/medical-records/notes', data),

  listVitals: (patientId) =>
    request('get', '/vitals', undefined, patientId ? { params: { patientId } } : undefined),
  recordVitals: (data) => request('post', '/vitals', data),
};
