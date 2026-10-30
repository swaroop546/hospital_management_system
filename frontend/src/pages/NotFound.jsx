import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-cyan-400 mb-4">
        <FileQuestion className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
        Page Not Found (404)
      </h1>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        The requested medical route or clinical resource could not be found.
      </p>
      <div className="flex items-center gap-3">
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" icon={Home} onClick={() => navigate('/dashboard')}>
          Hospital Dashboard
        </Button>
      </div>
    </div>
  );
};
