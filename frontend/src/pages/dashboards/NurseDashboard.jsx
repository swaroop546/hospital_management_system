import React, { useEffect, useState } from 'react';
import { Activity, Users } from 'lucide-react';
import { Card, CardHeader } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { hmsApi } from '../../api/hmsApi';

export const NurseDashboard = () => {
  const [patients, setPatients] = useState([]); const [vitals, setVitals] = useState([]); const [error, setError] = useState('');
  useEffect(() => { hmsApi.listPatients().then(async (p) => { const patientList = p.data || []; const results = await Promise.all(patientList.map((patient) => hmsApi.listVitals(patient.id))); setPatients(patientList); setVitals(results.flatMap((result) => result.data || [])); }).catch((err) => setError(err.message)); }, []);
  return <div className="space-y-6"><div><h2 className="text-2xl font-bold text-white">Nurse Station</h2><p className="text-sm text-slate-400 mt-1">Patient census and vital observations from the API</p></div>{error && <p className="text-sm text-rose-400">{error}</p>}<div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><StatCard title="Ward patients" value={patients.length} icon={Users} color="cyan" /><StatCard title="Vital observations" value={vitals.length} icon={Activity} color="emerald" /></div><Card><CardHeader title="Recent vital observations" subtitle="Use Record Vitals to create a server record" /><div className="space-y-2">{vitals.slice(0, 10).map((v)=><div key={v.id} className="flex justify-between border-b border-slate-800 py-3 text-xs text-slate-300"><span>{v.patientId}</span><span>{v.bloodPressureSystolic}/{v.bloodPressureDiastolic} • {v.heartRate} bpm • {v.oxygenSaturation}%</span></div>)}</div></Card></div>;
};
