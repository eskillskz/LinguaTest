import React from 'react';
import { TestType } from '../types';
import { TestHeader } from '../components/TestHeader';
import { Test1DragGaps } from './tests/Test1DragGaps';
import { Test2MCQ } from './tests/Test2MCQ';
import { Test3ImageMatch } from './tests/Test3ImageMatch';
import { Test4Sentence } from './tests/Test4Sentence';
import { Test5WordBuilder } from './tests/Test5WordBuilder';
import { Test6Columns } from './tests/Test6Columns';

interface TestRendererProps {
  testId: TestType;
  testConfig: any;
  onBack: () => void;
}

export const TestRenderer: React.FC<TestRendererProps> = ({ testId, testConfig, onBack }) => {
  
  const renderContent = () => {
    switch (testId) {
      case TestType.DRAG_GAPS:
        return <Test1DragGaps />;
      case TestType.MCQ:
        return <Test2MCQ />;
      case TestType.IMAGE_MATCH:
        return <Test3ImageMatch />;
      case TestType.SENTENCE_BUILDER:
        return <Test4Sentence />;
      case TestType.WORD_BUILDER:
        return <Test5WordBuilder />;
      case TestType.COLUMNS:
        return <Test6Columns />;
      case TestType.PLACEHOLDER:
        return (
            <div className="flex items-center justify-center h-[60vh] text-slate-400">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
                    <p>This module is under development.</p>
                </div>
            </div>
        );
      default:
        return <div>Test Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TestHeader title={testConfig.title} onBack={onBack} />
      <main className="pb-20 animate-fade-in">
        {renderContent()}
      </main>
    </div>
  );
};