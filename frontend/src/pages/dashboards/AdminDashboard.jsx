import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Users, Calendar } from 'lucide-react';
import { hmsApi } from '../../api/hmsApi';

export const AdminDashboard = () => {
  const [data, setData] = useState({ patients: [], appointments: [] });
  const [error, setError] = useState('');
  useEffect(() => { Promise.all([hmsApi.listPatients(), hmsApi.listAppointments()]).then(([p, a]) => setData({ patients: p.data || [], appointments: a.data || [] })).catch((err) => setError(err.message)); }, []);
  return <div className="space-y-6"><div><h2 className="text-2xl font-bold text-white">Hospital Overview</h2><p className="text-sm text-slate-400 mt-1">Live operational data from the MediCore API</p></div>{error && <p className="text-sm text-rose-400">{error}</p>}<div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><StatCard title="Patients" value={data.patients.length} subtext="Registered records" icon={Users} color="cyan" /><StatCard title="Appointments" value={data.appointments.length} subtext="Scheduled records" icon={Calendar} color="emerald" /></div><Card><CardHeader title="Operational summary" subtitle="Current hospital records" /><p className="text-sm text-slate-400">Use the Patients and Appointments sections to manage live records.</p></Card></div>;
};
