import React, { useEffect, useState } from 'react';
import { FileText, Search, Plus } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { hmsApi } from '../../api/hmsApi';
import { useAuth } from '../../context/useAuth';
import { ROLES } from '../../utils/constants';

export const MedicalRecordsPage = () => {
  const { role } = useAuth();
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ patientId: '', type: 'note', chiefComplaint: '', content: '', icdCode: '' });
  const canCreate = [ROLES.DOCTOR, ROLES.NURSE].includes(role);

  const patientName = (id) => { const p = patients.find((item) => item.id === id); return p ? `${p.firstName} ${p.lastName}` : id; };
  const load = async () => {
    try {
      let patientList;
      if (role === ROLES.PATIENT) { const me = await hmsApi.getMyPatient(); patientList = me.data ? [me.data] : []; } else { const response = await hmsApi.listPatients(); patientList = response.data || []; }
      setPatients(patientList);
      const groups = await Promise.all(patientList.map(async (p) => {
        const [consultations, diagnoses, notes] = await Promise.all([hmsApi.listConsultations(p.id), hmsApi.listDiagnoses(p.id), hmsApi.listNotes(p.id)]);
        return [...(consultations.data || []).map((item) => ({ ...item, recordType: 'Consultation', title: item.assessment || item.chiefComplaint, body: item.plan || item.physicalExamination })), ...(diagnoses.data || []).map((item) => ({ ...item, recordType: 'Diagnosis', title: item.description, body: item.icdCode })), ...(notes.data || []).map((item) => ({ ...item, recordType: item.noteType || 'Note', title: item.content, body: '' }))];
      }));
      setRecords(groups.flat()); setError('');
    } catch (err) { setError(err.message); }
  };
  useEffect(() => { load(); }, [role]);
  const create = async (event) => {
    event.preventDefault();
    try {
      if (formData.type === 'consultation') await hmsApi.createConsultation({ patientId: formData.patientId, chiefComplaint: formData.chiefComplaint, assessment: formData.content });
      else if (formData.type === 'diagnosis') await hmsApi.createDiagnosis({ patientId: formData.patientId, icdCode: formData.icdCode, description: formData.content });
      else await hmsApi.createNote({ patientId: formData.patientId, content: formData.content, noteType: role === ROLES.NURSE ? 'nursing' : 'clinical' });
      setIsModalOpen(false); setFormData({ ...formData, chiefComplaint: '', content: '', icdCode: '' }); await load();
    } catch (err) { setError(err.message); }
  };
  const filtered = records.filter((r) => `${patientName(r.patientId)} ${r.title} ${r.body}`.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div className="space-y-6"><div className="flex items-center justify-between gap-4"><div><h2 className="text-2xl font-bold text-white">Clinical Medical Records</h2><p className="text-sm text-slate-400 mt-1">Consultations, diagnoses, and clinical notes from the API</p></div>{canCreate && <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>New Clinical Entry</Button>}</div>{error && <p className="text-sm text-rose-400">{error}</p>}<Card><div className="relative w-80 mb-6"><Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" /><input placeholder="Search records..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white" /></div><div className="space-y-4">{filtered.map((record)=><div key={`${record.recordType}-${record.id}`} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-cyan-400" /><div><h4 className="text-sm font-bold text-white">{patientName(record.patientId)}</h4><p className="text-xs text-slate-400">{record.recordType} • {record.createdAt ? new Date(record.createdAt).toLocaleString() : '-'}</p></div><Badge variant="info" size="sm">{record.status || record.noteType || record.recordType}</Badge></div><p className="text-sm text-white mt-3">{record.title}</p>{record.body && <p className="text-xs text-slate-300 mt-2">{record.body}</p>}{record.recordType === 'Consultation' && record.status === 'draft' && [ROLES.DOCTOR, ROLES.ADMIN].includes(role) && <Button variant="outline" size="sm" onClick={async () => { try { await hmsApi.finalizeConsultation(record.id); await load(); } catch (err) { setError(err.message); } }}>Finalize Consultation</Button>}</div>)}{filtered.length === 0 && <p className="text-sm text-slate-400">No clinical records found.</p>}</div></Card>
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Clinical Entry"><form onSubmit={create} className="space-y-4"><select required value={formData.patientId} onChange={(e)=>setFormData({...formData,patientId:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"><option value="">Select patient</option>{patients.map((p)=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}</select><select value={formData.type} onChange={(e)=>setFormData({...formData,type:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white">{role === ROLES.DOCTOR && <><option value="consultation">Consultation</option><option value="diagnosis">Diagnosis</option></>}<option value="note">Clinical note</option></select>{formData.type === 'consultation' && <input required placeholder="Chief complaint" value={formData.chiefComplaint} onChange={(e)=>setFormData({...formData,chiefComplaint:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />}{formData.type === 'diagnosis' && <input placeholder="ICD code" value={formData.icdCode} onChange={(e)=>setFormData({...formData,icdCode:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />}<textarea required placeholder={formData.type === 'consultation' ? 'Assessment' : formData.type === 'diagnosis' ? 'Diagnosis description' : 'Note content'} value={formData.content} onChange={(e)=>setFormData({...formData,content:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" /><Button type="submit" variant="primary">Save Clinical Entry</Button></form></Modal>
  </div>;
};
