import React, { useEffect, useState } from 'react';
import { Calendar, FileText } from 'lucide-react';
import { Card, CardHeader } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { hmsApi } from '../../api/hmsApi';
import { useAuth } from '../../context/useAuth';

export const DoctorDashboard = () => {
  const { user } = useAuth(); const [appointments, setAppointments] = useState([]); const [patients, setPatients] = useState([]); const [error, setError] = useState('');
  useEffect(() => { Promise.all([hmsApi.listAppointments(), hmsApi.listPatients()]).then(([a,p]) => { setAppointments(a.data || []); setPatients(p.data || []); }).catch((err) => setError(err.message)); }, []);
  return <div className="space-y-6"><div><h2 className="text-2xl font-bold text-white">Doctor Hub</h2><p className="text-sm text-slate-400 mt-1">Live schedule and assigned patients for {user?.firstName} {user?.lastName}</p></div>{error && <p className="text-sm text-rose-400">{error}</p>}<div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><StatCard title="My appointments" value={appointments.length} subtext="From the scheduling API" icon={Calendar} color="emerald" /><StatCard title="Assigned patients" value={patients.length} subtext="Filtered by your doctor ID" icon={FileText} color="cyan" /></div><Card><CardHeader title="Consultation schedule" subtitle="Appointment records assigned to you" /><div className="space-y-2">{appointments.map((a)=><div key={a.id} className="flex justify-between border-b border-slate-800 py-3 text-sm"><span className="text-white">{new Date(a.scheduledAt).toLocaleString()}</span><Badge variant="info" size="sm">{a.status}</Badge></div>)}</div></Card></div>;
};
