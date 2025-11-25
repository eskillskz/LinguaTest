import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TestHeaderProps {
  title: string;
  onBack: () => void;
}

export const TestHeader: React.FC<TestHeaderProps> = ({ title, onBack }) => {
  return (
    <header className="h-24 px-8 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-[28px] font-semibold text-slate-800">{title}</h1>
      </div>
      <button
        onClick={onBack}
        className="h-10 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
        aria-label="Back to Home"
      >
        <ArrowLeft size={20} />
        Back Home
      </button>
    </header>
  );
};