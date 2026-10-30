import React, { useEffect, useState } from 'react';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { hmsApi } from '../../api/hmsApi';
import { useAuth } from '../../context/useAuth';
import { ROLES } from '../../utils/constants';

const emptyForm = { patientId: '', doctorId: '', scheduledAt: '', durationMinutes: 30, type: 'Consultation', reason: '', notes: '' };

export const AppointmentsPage = () => {
  const { role } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState(emptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const canCreate = [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT].includes(role);

  const nameFor = (id) => { const p = patients.find((item) => item.id === id); const d = doctors.find((item) => item.id === id); return p ? `${p.firstName} ${p.lastName}` : d ? `${d.firstName} ${d.lastName}` : id; };
  const load = async () => {
    try {
      const patientPromise = role === ROLES.PATIENT ? hmsApi.getMyPatient() : hmsApi.listPatients();
      const [appointmentRes, patientRes, doctorRes] = await Promise.all([hmsApi.listAppointments(), patientPromise, hmsApi.listDoctors()]);
      setAppointments(appointmentRes.data || []); setPatients(role === ROLES.PATIENT ? (patientRes.data ? [patientRes.data] : []) : (patientRes.data || [])); setDoctors(doctorRes.data || []); setError('');
      if (role === ROLES.PATIENT && !formData.patientId) { setFormData((current) => ({ ...current, patientId: patientRes.data?.id || '' })); }
    } catch (err) { setError(err.message); }
  };
  useEffect(() => { load(); }, [role]);

  const create = async (event) => {
    event.preventDefault();
    try {
      await hmsApi.createAppointment({ ...formData, durationMinutes: Number(formData.durationMinutes), scheduledAt: new Date(formData.scheduledAt).toISOString() });
      setFormData(emptyForm); setIsModalOpen(false); await load();
    } catch (err) { setError(err.message); }
  };
  const updateStatus = async (id, status) => { try { await hmsApi.updateAppointment(id, { status }); await load(); } catch (err) { setError(err.message); } };
  const filtered = appointments.filter((a) => filterStatus === 'all' || a.status === filterStatus);

  return <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h2 className="text-2xl font-bold text-white">Appointments Management</h2><p className="text-sm text-slate-400 mt-1">Live scheduling and appointment status</p></div>{canCreate && <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>Book Appointment</Button>}</div>
    {error && <p className="text-sm text-rose-400">{error}</p>}
    <Card><div className="flex items-center justify-between gap-4 mb-6"><div className="flex flex-wrap gap-2">{['all','scheduled','confirmed','checked_in','in_progress','completed','cancelled'].map((status) => <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1.5 rounded-xl text-xs capitalize ${filterStatus === status ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>{status.replace('_',' ')}</button>)}</div><Badge variant="info">{filtered.length} Appointments</Badge></div>
      <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-800 text-slate-400 uppercase"><th className="pb-3 px-3">Date</th><th className="pb-3 px-3">Patient</th><th className="pb-3 px-3">Doctor</th><th className="pb-3 px-3">Type</th><th className="pb-3 px-3">Status</th><th className="pb-3 px-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-800/60">{filtered.map((a) => <tr key={a.id}><td className="py-3 px-3 text-slate-300">{new Date(a.scheduledAt).toLocaleString()}</td><td className="py-3 px-3 text-white">{nameFor(a.patientId)}</td><td className="py-3 px-3 text-slate-300">{nameFor(a.doctorId)}</td><td className="py-3 px-3 text-slate-400">{a.type}</td><td className="py-3 px-3"><Badge variant={a.status === 'completed' ? 'success' : a.status === 'cancelled' ? 'danger' : 'info'} size="sm">{a.status}</Badge></td><td className="py-3 px-3"><div className="flex gap-2">{[ROLES.ADMIN,ROLES.RECEPTIONIST,ROLES.DOCTOR].includes(role) && a.status !== 'completed' && <button title="Complete" onClick={() => updateStatus(a.id,'completed')} className="text-emerald-400"><CheckCircle className="w-4 h-4" /></button>}{(role === ROLES.PATIENT || [ROLES.ADMIN,ROLES.RECEPTIONIST,ROLES.DOCTOR].includes(role)) && a.status !== 'cancelled' && <button title="Cancel" onClick={() => updateStatus(a.id,'cancelled')} className="text-rose-400"><XCircle className="w-4 h-4" /></button>}</div></td></tr>)}</tbody></table></div>
    </Card>
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Appointment"><form onSubmit={create} className="space-y-4">
      <select required disabled={role === ROLES.PATIENT} value={formData.patientId} onChange={(e) => setFormData({...formData,patientId:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"><option value="">Select patient</option>{patients.map((p)=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}</select>
      <select required value={formData.doctorId} onChange={(e) => setFormData({...formData,doctorId:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"><option value="">Select doctor</option>{doctors.map((d)=><option key={d.id} value={d.id}>{d.firstName} {d.lastName} ({d.specialty || d.department})</option>)}</select>
      <div className="grid grid-cols-2 gap-3"><input required type="datetime-local" value={formData.scheduledAt} onChange={(e)=>setFormData({...formData,scheduledAt:e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" /><input required type="number" min="10" max="240" value={formData.durationMinutes} onChange={(e)=>setFormData({...formData,durationMinutes:e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" /></div>
      <input required placeholder="Appointment type" value={formData.type} onChange={(e)=>setFormData({...formData,type:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" /><textarea placeholder="Reason" value={formData.reason} onChange={(e)=>setFormData({...formData,reason:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" /><Button type="submit" variant="primary">Create Appointment</Button>
    </form></Modal>
  </div>;
};
