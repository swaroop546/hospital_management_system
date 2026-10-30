import React, { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { hmsApi } from '../../api/hmsApi';
import { useAuth } from '../../context/useAuth';
import { ROLES } from '../../utils/constants';

const emptyForm = {
  firstName: '', lastName: '', dateOfBirth: '', gender: 'female', phone: '',
  email: '', bloodType: 'unknown', primaryDoctorId: '',
};

export const PatientsPage = () => {
  const { role } = useAuth();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const canCreate = [ROLES.ADMIN, ROLES.RECEPTIONIST].includes(role);

  const load = async () => {
    try {
      const [patientRes, doctorRes] = await Promise.all([
        hmsApi.listPatients({ search: searchTerm }),
        hmsApi.listDoctors(),
      ]);
      setPatients(patientRes.data || []);
      setDoctors(doctorRes.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, [searchTerm]);

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await hmsApi.createPatient({
        ...formData,
        email: formData.email || undefined,
        primaryDoctorId: formData.primaryDoctorId || undefined,
      });
      setFormData(emptyForm);
      setIsModalOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-white">Patient Directory</h2><p className="text-sm text-slate-400 mt-1">Live patient records from the hospital API</p></div>
        {canCreate && <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>Register New Patient</Button>}
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <Card>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72"><Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" /><input placeholder="Search by name, ID, or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white" /></div>
          <Badge variant="info">{patients.length} Patients</Badge>
        </div>
        <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-800 text-slate-400 uppercase"><th className="pb-3 px-3">Patient</th><th className="pb-3 px-3">Demographics</th><th className="pb-3 px-3">Contact</th><th className="pb-3 px-3">Blood Type</th><th className="pb-3 px-3">Primary Doctor</th><th className="pb-3 px-3">Status</th></tr></thead>
          <tbody className="divide-y divide-slate-800/60">{patients.map((patient) => { const doctor = doctors.find((d) => d.id === patient.primaryDoctorId); return <tr key={patient.id}><td className="py-3 px-3 text-white font-semibold">{patient.firstName} {patient.lastName}<div className="text-[10px] text-cyan-400">{patient.patientNumber || patient.id}</div></td><td className="py-3 px-3 text-slate-300">{patient.dateOfBirth} • {patient.gender}</td><td className="py-3 px-3 text-slate-400">{patient.phone}<div className="text-[10px]">{patient.email}</div></td><td className="py-3 px-3 text-cyan-300">{patient.bloodType || 'unknown'}</td><td className="py-3 px-3 text-slate-300">{doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unassigned'}</td><td className="py-3 px-3"><Badge variant="success" size="sm">{patient.isActive ? 'Active' : 'Inactive'}</Badge></td></tr>; })}</tbody>
        </table></div>
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Patient">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">{[['firstName','First name'],['lastName','Last name']].map(([key,label]) => <input key={key} required placeholder={label} value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />)}</div>
          <input required type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />
          <div className="grid grid-cols-2 gap-3"><select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option><option value="prefer_not_to_say">Prefer not to say</option></select><select value={formData.bloodType} onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white">{['unknown','A+','A-','B+','B-','AB+','AB-','O+','O-'].map((v) => <option key={v}>{v}</option>)}</select></div>
          <input required placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white" />
          <select value={formData.primaryDoctorId} onChange={(e) => setFormData({ ...formData, primaryDoctorId: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"><option value="">No primary doctor</option>{doctors.map((d) => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}</select>
          <Button type="submit" variant="primary">Register Patient</Button>
        </form>
      </Modal>
    </div>
  );
};
