import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { DashboardDispatcher } from './pages/dashboards/DashboardDispatcher';
import { PatientsPage } from './pages/patients/PatientsPage';
import { AppointmentsPage } from './pages/appointments/AppointmentsPage';
import { MedicalRecordsPage } from './pages/records/MedicalRecordsPage';
import { VitalsPage } from './pages/vitals/VitalsPage';
import { UsersPage } from './pages/users/UsersPage';
import { Unauthorized } from './pages/Unauthorized';
import { NotFound } from './pages/NotFound';
import { ROLES } from './utils/constants';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes inside Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardDispatcher />} />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      ROLES.ADMIN,
                      ROLES.DOCTOR,
                      ROLES.NURSE,
                      ROLES.RECEPTIONIST,
                    ]}
                  />
                }
              >
                <Route index element={<PatientsPage />} />
              </Route>
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route
                path="/records"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.PATIENT]}
                  />
                }
              >
                <Route index element={<MedicalRecordsPage />} />
              </Route>
              <Route
                path="/vitals"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.PATIENT]}
                  />
                }
              >
                <Route index element={<VitalsPage />} />
              </Route>
              <Route
                path="/users"
                element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}
              >
                <Route index element={<UsersPage />} />
              </Route>
            </Route>
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
