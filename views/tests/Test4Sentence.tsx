import React, { useState, useEffect } from 'react';
import { trackEvent } from '../../services/analytics';
import { TestType } from '../../types';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

const sentenceData = {
  words: ["Yesterday", "The", "Train", "Arrived", "Late"],
  correct: "The train arrived late yesterday",
  explanation: "Standard English sentence structure: Subject (The train) + Verb (arrived) + Adverb (late) + Time (yesterday)."
};

export const Test4Sentence: React.FC = () => {
  const [pool, setPool] = useState<string[]>([]);
  const [built, setBuilt] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Shuffle words initially
    setPool([...sentenceData.words].sort(() => Math.random() - 0.5));
    trackEvent({ event_name: 'test_started', test_id: TestType.SENTENCE_BUILDER, timestamp: Date.now() });
  }, []);

  const addToSentence = (word: string, index: number) => {
    if (submitted) return;
    const newPool = [...pool];
    newPool.splice(index, 1);
    setPool(newPool);
    setBuilt([...built, word]);
    setError(null);
  };

  const removeFromSentence = (word: string, index: number) => {
    if (submitted) return;
    const newBuilt = [...built];
    newBuilt.splice(index, 1);
    setBuilt(newBuilt);
    setPool([...pool, word]);
    setError(null);
  };

  const moveLeft = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0 || submitted) return;
    const newBuilt = [...built];
    [newBuilt[index - 1], newBuilt[index]] = [newBuilt[index], newBuilt[index - 1]];
    setBuilt(newBuilt);
  };
  
  const moveRight = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === built.length - 1 || submitted) return;
    const newBuilt = [...built];
    [newBuilt[index + 1], newBuilt[index]] = [newBuilt[index], newBuilt[index + 1]];
    setBuilt(newBuilt);
  };

  const handleSubmit = () => {
    // Validation: Check if all words are used (pool must be empty)
    if (pool.length > 0) {
        setError("You have not completed the exercise.");
        return;
    }

    setSubmitted(true);
    const result = built.join(" ");
    // Flexible check (case insensitive)
    const correct = result.toLowerCase() === sentenceData.correct.toLowerCase();
    
    trackEvent({ 
        event_name: 'test_submitted', 
        test_id: TestType.SENTENCE_BUILDER, 
        timestamp: Date.now(), 
        score: correct ? 100 : 0 
    });
  };

  const isCorrect = submitted && built.join(" ").toLowerCase() === sentenceData.correct.toLowerCase();

  return (
    <div className="max-w-[980px] mx-auto p-8 mt-8 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <h2 className="text-xl font-semibold mb-6 text-slate-800">Construct the correct sentence using all the words below.</h2>

      {/* Construction Area */}
      <div className={`min-h-[140px] p-8 rounded-xl border-2 mb-8 flex flex-wrap gap-4 items-center transition-colors ${submitted ? (isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : 'border-pink-200 bg-pink-50/30'}`}>
        {built.length === 0 && !submitted && <span className="text-slate-400 italic pointer-events-none select-none text-lg">Click words to build your sentence...</span>}
        
        {built.map((word, idx) => (
          <div 
            key={`${word}-${idx}`} 
            onClick={() => removeFromSentence(word, idx)}
            className="relative group bg-white text-slate-800 font-bold px-5 py-3 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-50 flex items-center gap-2"
          >
            {word}
            {!submitted && (
                <>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 hidden group-hover:flex gap-1 bg-slate-800 rounded p-1 shadow-lg z-10">
                    <button onClick={(e) => moveLeft(idx, e)} className="p-1 text-white hover:bg-slate-700 rounded"><ArrowLeft size={14}/></button>
                    <button onClick={(e) => moveRight(idx, e)} className="p-1 text-white hover:bg-slate-700 rounded"><ArrowRight size={14}/></button>
                </div>
                </>
            )}
          </div>
        ))}
      </div>

      {submitted && !isCorrect && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-bold mb-1">Incorrect.</p>
            <p className="mb-2">Correct Answer: <span className="font-semibold">{sentenceData.correct}</span></p>
            <p className="text-sm">{sentenceData.explanation}</p>
        </div>
      )}

      {/* Word Pool */}
      <div className="p-8 border-t border-slate-100">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Available Words</p>
        <div className="flex flex-wrap gap-6">
          {pool.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              onClick={() => addToSentence(word, idx)}
              disabled={submitted}
              // Updated styling for bigger, more tactile buttons with rounded corners and no 'Select' text
              className="px-8 py-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 text-2xl font-bold shadow-md hover:shadow-lg hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 animate-pulse">
                <AlertCircle size={20} />
                <span>{error}</span>
            </div>
        )}
        {!submitted && (
          <button 
            onClick={handleSubmit}
            className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-3 rounded-full font-semibold shadow-lg shadow-pink-200 transition-all"
          >
            Submit Sentence
          </button>
        )}
      </div>
    </div>
  );
};