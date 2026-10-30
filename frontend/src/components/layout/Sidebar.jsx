import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Activity,
  LogOut,
  Hospital,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { ROLES, ROLE_CONFIG } from '../../utils/constants';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, role, logout } = useAuth();
  const currentRoleConfig = ROLE_CONFIG[role] || ROLE_CONFIG[ROLES.PATIENT];

  const getNavLinks = () => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
          { to: '/patients', label: 'Patients Directory', icon: Users },
          { to: '/appointments', label: 'Appointments', icon: Calendar },
          { to: '/records', label: 'Clinical Records', icon: FileText },
          { to: '/vitals', label: 'Vital Signs', icon: Activity },
          { to: '/users', label: 'User Administration', icon: Users },
        ];
      case ROLES.DOCTOR:
        return [
          { to: '/dashboard', label: 'Doctor Hub', icon: LayoutDashboard },
          { to: '/appointments', label: 'Consultations', icon: Calendar },
          { to: '/records', label: 'Patient Charts', icon: FileText },
          { to: '/vitals', label: 'Patient Vitals', icon: Activity },
        ];
      case ROLES.NURSE:
        return [
          { to: '/dashboard', label: 'Nurse Station', icon: LayoutDashboard },
          { to: '/vitals', label: 'Record Vitals', icon: Activity },
          { to: '/patients', label: 'Ward Patients', icon: Users },
          { to: '/records', label: 'Medical Records', icon: FileText },
        ];
      case ROLES.RECEPTIONIST:
        return [
          { to: '/dashboard', label: 'Front Desk', icon: LayoutDashboard },
          { to: '/patients', label: 'Patient Registry', icon: Users },
          { to: '/appointments', label: 'Scheduling', icon: Calendar },
        ];
      case ROLES.PATIENT:
        return [
          { to: '/dashboard', label: 'My Health Portal', icon: LayoutDashboard },
          { to: '/appointments', label: 'My Appointments', icon: Calendar },
          { to: '/records', label: 'Medical History', icon: FileText },
          { to: '/vitals', label: 'Vitals Log', icon: Activity },
        ];
      default:
        return [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-[17rem] bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-[4.5rem] flex items-center gap-3 px-6 border-b border-slate-200">
          <div className="brand-mark">
            <Hospital className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              MediCore <span className="app-role-chip">HMS</span>
            </h1>
            <p className="text-[11px] text-slate-500">Hospital Management</p>
          </div>
        </div>

        {/* User Role Card */}
        <div className="p-4 mx-4 my-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center font-bold text-sm text-cyan-700">
              {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${currentRoleConfig.badgeColor}`}>
                  {currentRoleConfig.shortLabel}
                </span>
              </div>
            </div>
          </div>
          {user?.department && (
            <p className="text-[11px] text-slate-500 mt-2 truncate font-mono">
              Dept: {user.department}
            </p>
          )}
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.16em]">
            Main Navigation
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'app-nav-active font-semibold shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{link.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
              </NavLink>
            );
          })}
        </nav>

        {/* Footer with logout */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
