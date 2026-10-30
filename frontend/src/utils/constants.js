export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist',
  PATIENT: 'patient',
};

export const ROLE_CONFIG = {
  [ROLES.ADMIN]: {
    label: 'Hospital Administrator',
    shortLabel: 'Admin',
    color: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    badgeColor: 'bg-purple-900/40 text-purple-300 border-purple-500/30',
    accent: '#a855f7',
  },
  [ROLES.DOCTOR]: {
    label: 'Physician / Doctor',
    shortLabel: 'Doctor',
    color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    badgeColor: 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30',
    accent: '#10b981',
  },
  [ROLES.NURSE]: {
    label: 'Clinical Nurse',
    shortLabel: 'Nurse',
    color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
    badgeColor: 'bg-cyan-900/40 text-cyan-300 border-cyan-500/30',
    accent: '#06b6d4',
  },
  [ROLES.RECEPTIONIST]: {
    label: 'Reception & Desk',
    shortLabel: 'Receptionist',
    color: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    badgeColor: 'bg-amber-900/40 text-amber-300 border-amber-500/30',
    accent: '#f59e0b',
  },
  [ROLES.PATIENT]: {
    label: 'Patient Portal',
    shortLabel: 'Patient',
    color: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    badgeColor: 'bg-blue-900/40 text-blue-300 border-blue-500/30',
    accent: '#3b82f6',
  },
};

export const DEMO_USERS = [
  {
    role: ROLES.ADMIN,
    name: 'Alexandra Morgan',
    title: 'Hospital Admin',
    email: 'admin@hospital.dev',
    password: 'Admin@1234',
    department: 'Administration',
    avatar: 'AM',
  },
  {
    role: ROLES.DOCTOR,
    name: 'Dr. Marcus Chen',
    title: 'Chief Physician',
    email: 'doctor@hospital.dev',
    password: 'Doctor@1234',
    department: 'Internal Medicine',
    avatar: 'MC',
  },
  {
    role: ROLES.NURSE,
    name: 'Sarah Williams, RN',
    title: 'Head Nurse',
    email: 'nurse@hospital.dev',
    password: 'Nurse@1234',
    department: 'General Ward',
    avatar: 'SW',
  },
  {
    role: ROLES.RECEPTIONIST,
    name: 'James Rivera',
    title: 'Front Desk Officer',
    email: 'receptionist@hospital.dev',
    password: 'Recept@1234',
    department: 'Front Desk',
    avatar: 'JR',
  },
  {
    role: ROLES.PATIENT,
    name: 'Emily Johnson',
    title: 'Registered Patient',
    email: 'patient@hospital.dev',
    password: 'Patient@1234',
    department: 'Cardiology Clinic',
    avatar: 'EJ',
  },
];
