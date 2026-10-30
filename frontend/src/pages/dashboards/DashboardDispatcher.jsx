import React from 'react';
import { useAuth } from '../../context/useAuth';
import { ROLES } from '../../utils/constants';
import { AdminDashboard } from './AdminDashboard';
import { DoctorDashboard } from './DoctorDashboard';
import { NurseDashboard } from './NurseDashboard';
import { ReceptionistDashboard } from './ReceptionistDashboard';
import { PatientDashboard } from './PatientDashboard';

export const DashboardDispatcher = () => {
  const { role } = useAuth();

  switch (role) {
    case ROLES.ADMIN:
      return <AdminDashboard />;
    case ROLES.DOCTOR:
      return <DoctorDashboard />;
    case ROLES.NURSE:
      return <NurseDashboard />;
    case ROLES.RECEPTIONIST:
      return <ReceptionistDashboard />;
    case ROLES.PATIENT:
      return <PatientDashboard />;
    default:
      return <AdminDashboard />;
  }
};
