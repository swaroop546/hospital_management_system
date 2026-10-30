import React, { useEffect, useState } from 'react';
import { Calendar, Heart, FileText } from 'lucide-react';
import { Card, CardHeader } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { hmsApi } from '../../api/hmsApi';
import { useAuth } from '../../context/useAuth';

export const PatientDashboard = () => {
  const { user } = useAuth(); const [appointments, setAppointments] = useState([]); const [vitals, setVitals] = useState([]); const [error, setError] = useState('');
  useEffect(() => { Promise.all([hmsApi.listAppointments(), hmsApi.listVitals()]).then(([a, v]) => { setAppointments(a.data || []); setVitals(v.data || []); }).catch((err) => setError(err.message)); }, []);
  const latest = vitals[vitals.length - 1];
  return <div className="space-y-6"><div><h2 className="text-2xl font-bold text-white">Patient Health Portal</h2><p className="text-sm text-slate-400 mt-1">Welcome back, {user?.firstName}. Your data is loaded from the hospital API.</p></div>{error && <p className="text-sm text-rose-400">{error}</p>}<div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><StatCard title="Appointments" value={appointments.length} icon={Calendar} color="blue" /><StatCard title="Latest BP" value={latest ? `${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic}` : '-'} icon={Heart} color="cyan" /><StatCard title="Vital records" value={vitals.length} icon={FileText} color="purple" /></div><Card><CardHeader title="My appointments" subtitle="Only records associated with your patient account" />{appointments.map((a)=><div key={a.id} className="flex justify-between border-b border-slate-800 py-3 text-xs"><span className="text-slate-300">{new Date(a.scheduledAt).toLocaleString()}</span><Badge variant="info" size="sm">{a.status}</Badge></div>)}</Card></div>;
};
