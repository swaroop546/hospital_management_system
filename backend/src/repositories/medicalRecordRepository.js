'use strict';

const MedicalRecord = require('../models/MedicalRecord');
const { newId } = require('../utils/helpers');

const clean = (r) => {
  if (!r) return null;
  const { _id, id, data = {}, recordType, ...base } = r;
  return { ...data, ...base, id: _id || id };
};
const find = (patientId, recordType) => MedicalRecord.find({ patientId, recordType }).sort({ createdAt: -1 }).lean().then((rows) => rows.map(clean));
const findConsultationById = (id) => MedicalRecord.findOne({ _id: id, recordType: 'consultation' }).lean().then(clean);
const findConsultationsByPatient = (patientId) => find(patientId, 'consultation');
const createConsultation = async (data) => clean((await MedicalRecord.create({ _id: newId(), recordType: 'consultation', patientId: data.patientId, doctorId: data.doctorId, appointmentId: data.appointmentId, status: 'draft', data })).toObject());
const updateConsultation = async (id, updates) => {
  const current = await MedicalRecord.findOne({ _id: id, recordType: 'consultation' }).lean();
  if (!current) return null;
  return clean(await MedicalRecord.findByIdAndUpdate(id, { $set: { ...updates, data: { ...current.data, ...updates } } }, { new: true }).lean());
};
const findDiagnosesByPatient = (patientId) => find(patientId, 'diagnosis');
const createDiagnosis = async (data) => clean((await MedicalRecord.create({ _id: newId(), recordType: 'diagnosis', patientId: data.patientId, doctorId: data.doctorId, diagnosedAt: data.diagnosedAt, data })).toObject());
const findNotesByPatient = (patientId) => find(patientId, 'note');
const createNote = async (data) => clean((await MedicalRecord.create({ _id: newId(), recordType: 'note', patientId: data.patientId, authorId: data.authorId, authorRole: data.authorRole, data })).toObject());

module.exports = { findConsultationById, findConsultationsByPatient, createConsultation, updateConsultation, findDiagnosesByPatient, createDiagnosis, findNotesByPatient, createNote };
