import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, CalendarDays, FileText, Hospital, Stethoscope, Users } from 'lucide-react';

const features = [
  { icon: Users, title: 'Patients', text: 'Manage patient information in one place.' },
  { icon: CalendarDays, title: 'Appointments', text: 'Keep schedules clear and organized.' },
  { icon: FileText, title: 'Medical records', text: 'Give care teams the right information.' },
];

export const Home = () => (
  <div className="home-page relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
    <div className="home-ambient" aria-hidden="true">
      <span className="home-stars home-stars-back" />
      <span className="home-stars home-stars-front" />
      <span className="home-glow home-glow-one" />
      <span className="home-glow home-glow-two" />
      <span className="home-horizon" />
      <span className="home-corner home-corner-top" />
      <span className="home-corner home-corner-bottom" />
    </div>

    <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
      <Link to="/" className="flex items-center gap-3">
        <span className="brand-mark"><Hospital className="h-5 w-5" /></span>
        <span className="text-lg font-bold tracking-tight">MediCore <span className="text-cyan-600">HMS</span></span>
      </Link>
      <Link to="/login" className="home-nav-cta">Sign in <ArrowRight className="h-4 w-4" /></Link>
    </header>

    <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-8 lg:px-8 lg:pt-12">
      <section className="home-hero grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <div className="home-copy-wrap max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">Hospital management system</p>
          <h1 className="home-title mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
            Simple tools<br />for better<br />hospital care.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            MediCore helps hospital teams manage patients, appointments, records, and daily care from one clear workspace.
          </p>
          <Link to="/login" className="home-primary-cta mt-8">
            Sign in to MediCore <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="home-care-visual" aria-hidden="true">
          <div className="home-care-window">
            <div className="home-care-toolbar"><span /><span /><span /></div>
            <div className="home-care-grid">
              <div className="home-care-card"><CalendarDays /><i /><b /></div>
              <div className="home-care-card"><Users /><i /><b /></div>
              <div className="home-care-card"><FileText /><i /><b /></div>
              <div className="home-care-card home-care-chart"><Activity /><i /><b /></div>
            </div>
          </div>
          <div className="home-stethoscope"><Stethoscope /></div>
          <span className="home-care-dot home-care-dot-one" />
          <span className="home-care-dot home-care-dot-two" />
        </div>
      </section>

      <section className="mt-20 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <article key={title} className="home-feature-card">
            <Icon className="h-5 w-5 text-cyan-700" />
            <h2 className="mt-4 text-base font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </article>
        ))}
      </section>
    </main>

    <footer className="relative z-10 mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500 lg:px-8">
      MediCore HMS · Hospital care, clearly organized.
    </footer>
  </div>
);
