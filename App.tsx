import React, { useState } from 'react';
import { Home } from './views/Home';
import { TestRenderer } from './views/TestRenderer';
import { TESTS, TestType } from './types';
import { trackEvent } from './services/analytics';

const App: React.FC = () => {
  const [activeTestId, setActiveTestId] = useState<TestType | null>(null);

  const handleSelectTest = (id: TestType) => {
    setActiveTestId(id);
    trackEvent({ 
      event_name: 'tile_opened', 
      test_id: id, 
      timestamp: Date.now() 
    });
  };

  const handleBackHome = () => {
    trackEvent({ 
      event_name: 'back_clicked', 
      test_id: activeTestId || undefined, 
      timestamp: Date.now() 
    });
    setActiveTestId(null);
  };

  const activeTestConfig = activeTestId ? TESTS.find(t => t.id === activeTestId) : null;

  return (
    <div className="font-sans antialiased text-slate-800 bg-[#F8FAFC] min-h-screen selection:bg-blue-100 selection:text-blue-900">
      {activeTestId && activeTestConfig ? (
        <TestRenderer 
          testId={activeTestId} 
          testConfig={activeTestConfig} 
          onBack={handleBackHome} 
        />
      ) : (
        <Home onSelectTest={handleSelectTest} />
      )}
    </div>
  );
};

export default App;