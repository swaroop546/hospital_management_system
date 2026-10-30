import React, { useEffect, useState } from 'react';
import { Calendar, Users, Stethoscope } from 'lucide-react';
import { Card, CardHeader } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { hmsApi } from '../../api/hmsApi';

export const ReceptionistDashboard = () => {
  const [appointments, setAppointments] = useState([]); const [patients, setPatients] = useState([]); const [doctors, setDoctors] = useState([]); const [error, setError] = useState('');
  useEffect(() => { Promise.all([hmsApi.listAppointments(), hmsApi.listPatients(), hmsApi.listDoctors()]).then(([a,p,d]) => { setAppointments(a.data || []); setPatients(p.data || []); setDoctors(d.data || []); }).catch((err) => setError(err.message)); }, []);
  return <div className="space-y-6"><div><h2 className="text-2xl font-bold text-white">Front Desk & Reception</h2><p className="text-sm text-slate-400 mt-1">Live patient registry, schedule, and clinician directory</p></div>{error && <p className="text-sm text-rose-400">{error}</p>}<div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><StatCard title="Patients" value={patients.length} icon={Users} color="amber" /><StatCard title="Appointments" value={appointments.length} icon={Calendar} color="cyan" /><StatCard title="Active doctors" value={doctors.length} icon={Stethoscope} color="emerald" /></div><Card><CardHeader title="Today's scheduling records" subtitle="Manage appointments from the Scheduling page" />{appointments.map((a)=><div key={a.id} className="flex justify-between border-b border-slate-800 py-3 text-xs"><span className="text-slate-300">{new Date(a.scheduledAt).toLocaleString()}</span><Badge variant="info" size="sm">{a.status}</Badge></div>)}</Card></div>;
};
