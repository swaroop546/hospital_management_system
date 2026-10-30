import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { hmsApi } from '../../api/hmsApi';
import { useAuth } from '../../context/useAuth';
import { ROLES } from '../../utils/constants';

export const VitalsPage = () => {
  const { role } = useAuth();
  const [vitals, setVitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ patientId: '', bp: '120/80', heartRate: '75', temperature: '98.6', spo2: '98', respiratoryRate: '16' });
  const canCreate = [ROLES.NURSE, ROLES.DOCTOR].includes(role);
  const load = async () => {
    try {
      if (role === ROLES.PATIENT) {
        const [patient, vitalResponse] = await Promise.all([hmsApi.getMyPatient(), hmsApi.listVitals()]);
        setPatients(patient.data ? [patient.data] : []);
        setVitals(vitalResponse.data || []);
      } else {
        const patientResponse = await hmsApi.listPatients();
        const patientList = patientResponse.data || [];
        const vitalResponses = await Promise.all(patientList.map((patient) => hmsApi.listVitals(patient.id)));
        setPatients(patientList);
        setVitals(vitalResponses.flatMap((response) => response.data || []));
      }
      setError('');
    } catch (err) { setError(err.message); }
  };
  useEffect(() => { load(); }, [role]);
  const patientName = (id) => { const p = patients.find((item) => item.id === id); return p ? `${p.firstName} ${p.lastName}` : id; };
  const create = async (event) => { event.preventDefault(); try { const [systolic, diastolic] = formData.bp.split('/').map(Number); await hmsApi.recordVitals({ patientId: formData.patientId, bloodPressureSystolic: systolic, bloodPressureDiastolic: diastolic, heartRate: Number(formData.heartRate), temperature: Number(formData.temperature), temperatureUnit: 'F', oxygenSaturation: Number(formData.spo2), respiratoryRate: Number(formData.respiratoryRate) }); setIsModalOpen(false); await load(); } catch (err) { setError(err.message); } };
  const filtered = vitals.filter((v) => patientName(v.patientId).toLowerCase().includes(searchTerm.toLowerCase()));
  return <div className="space-y-6"><div className="flex items-center justify-between gap-4"><div><h2 className="text-2xl font-bold text-white">Clinical Vital Signs</h2><p className="text-sm text-slate-400 mt-1">Live observations from the clinical API</p></div>{canCreate && <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>Record Vitals</Button>}</div>{error && <p className="text-sm text-rose-400">{error}</p>}<Card><div className="flex items-center justify-between mb-6"><div className="relative w-80"><Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" /><input placeholder="Search patient..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white" /></div><Badge variant="info">{filtered.length} Observations</Badge></div><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-800 text-slate-400 uppercase"><th className="pb-3 px-3">Patient</th><th className="pb-3 px-3">Recorded</th><th className="pb-3 px-3">BP</th><th className="pb-3 px-3">Heart Rate</th><th className="pb-3 px-3">Temperature</th><th className="pb-3 px-3">SpO2</th><th className="pb-3 px-3">Respiratory</th></tr></thead><tbody className="divide-y divide-slate-800/60">{filtered.map((v)=><tr key={v.id}><td className="py-3 px-3 text-white">{patientName(v.patientId)}</td><td className="py-3 px-3 text-slate-400">{v.recordedAt ? new Date(v.recordedAt).toLocaleString() : '-'}</td><td className="py-3 px-3 text-cyan-300">{v.bloodPressureSystolic}/{v.bloodPressureDiastolic}</td><td className="py-3 px-3 text-slate-300">{v.heartRate} bpm</td><td className="py-3 px-3 text-slate-300">{v.temperature} °{v.temperatureUnit}</td><td className="py-3 px-3 text-slate-300">{v.oxygenSaturation}%</td><td className="py-3 px-3 text-slate-300">{v.respiratoryRate}/min</td></tr>)}</tbody></table></div></Card>
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Patient Vitals"><form onSubmit={create} className="space-y-4"><select required value={formData.patientId} onChange={(e)=>setFormData({...formData,patientId:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"><option value="">Select patient</option>{patients.map((p)=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}</select><input required placeholder="Blood pressure (e.g. 120/80)" value={formData.bp} onChange={(e)=>setFormData({...formData,bp:e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" /><div className="grid grid-cols-2 gap-3">{[['heartRate','Heart rate'],['temperature','Temperature °F'],['spo2','Oxygen saturation'],['respiratoryRate','Respiratory rate']].map(([key,label])=><input key={key} required type="number" placeholder={label} value={formData[key]} onChange={(e)=>setFormData({...formData,[key]:e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />)}</div><Button type="submit" variant="primary">Save Vitals</Button></form></Modal>
  </div>;
};
