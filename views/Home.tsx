import React from 'react';
import { TESTS, TestConfig, TestType } from '../types';
import * as Icons from 'lucide-react';

interface HomeProps {
  onSelectTest: (id: TestType) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectTest }) => {
  return (
    <div className="min-h-screen p-8 md:p-16 flex flex-col items-center">
      <div className="text-center mb-16 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">LinguaTest AI</h1>
        <p className="text-slate-500 text-lg">Select a module to begin your assessment. Each test is designed to challenge specific linguistic skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-[1080px]">
        {TESTS.map((test) => {
          // Dynamic Icon component
          const IconComponent = (Icons as any)[test.icon] || Icons.HelpCircle;

          return (
            <button
              key={test.id}
              onClick={() => onSelectTest(test.id)}
              className="group relative w-full h-[84px] rounded-[14px] flex items-center px-6 transition-all duration-300 ease-out hover:-translate-y-[6px] focus:outline-none focus:ring-4 focus:ring-opacity-20 focus:ring-slate-400"
              style={{
                background: `linear-gradient(135deg, ${test.gradientFrom}, ${test.gradientTo})`,
                boxShadow: '0 8px 24px -4px rgba(20, 20, 40, 0.12)'
              }}
              aria-label={`Open ${test.title}`}
            >
              {/* Icon Container */}
              <div className="w-[32px] h-[32px] flex items-center justify-center text-white mr-4">
                 <IconComponent size={28} strokeWidth={2.5} />
              </div>
              
              {/* Title */}
              <span className="text-white text-lg font-bold tracking-wide text-left flex-grow drop-shadow-sm">
                {test.title}
              </span>

              {/* Chevron */}
              <Icons.ChevronRight className="text-white opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
            </button>
          );
        })}
      </div>
    </div>
  );
};