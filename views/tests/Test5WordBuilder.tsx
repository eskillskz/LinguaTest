import React, { useState, useEffect } from 'react';
import { trackEvent } from '../../services/analytics';
import { TestType } from '../../types';
import { Delete, AlertCircle } from 'lucide-react';

const wordData = {
  letters: ['R', 'E', 'S', 'T', 'A'],
  target: "stare",
  explanation: "To look at someone or something for a long time with eyes wide open."
};

export const Test5WordBuilder: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent({ event_name: 'test_started', test_id: TestType.WORD_BUILDER, timestamp: Date.now() });
  }, []);

  const addLetter = (char: string) => {
    if (submitted) return;
    if (currentWord.length < wordData.target.length) {
        setCurrentWord(prev => prev + char);
        setError(null);
    }
  };

  const handleBackspace = () => {
    if (submitted) return;
    setCurrentWord(prev => prev.slice(0, -1));
    setError(null);
  };

  const handleSubmit = () => {
    // Validation
    if (currentWord.length < wordData.target.length) {
        setError("You have not completed the exercise.");
        return;
    }

    setSubmitted(true);
    trackEvent({ 
        event_name: 'test_submitted', 
        test_id: TestType.WORD_BUILDER, 
        timestamp: Date.now(), 
        score: currentWord.toLowerCase() === wordData.target.toLowerCase() ? 100 : 0 
    });
  };

  const isCorrect = submitted && currentWord.toLowerCase() === wordData.target.toLowerCase();

  return (
    <div className="max-w-[980px] mx-auto p-8 mt-8 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-center">
        <h2 className="text-xl font-semibold mb-8 text-slate-800">Construct the word from the letters.</h2>
        
        <div className={`inline-block min-w-[300px] p-8 rounded-xl border-2 mb-8 ${submitted ? (isCorrect ? 'border-blue-400 bg-blue-50' : 'border-red-400 bg-red-50') : 'border-blue-100 bg-slate-50'}`}>
            <div className="text-4xl font-bold tracking-[0.5em] text-slate-800 min-h-[48px]">
                {currentWord}
                {!currentWord && !submitted && <span className="opacity-20 tracking-normal text-2xl">...</span>}
            </div>
        </div>

        {submitted && !isCorrect && (
            <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-100 rounded text-red-800 text-left">
                <p className="font-bold">Incorrect.</p>
                <p>Correct Word: <span className="font-mono text-lg">{wordData.target.toUpperCase()}</span></p>
                <p className="text-sm mt-1 text-slate-600">{wordData.explanation}</p>
            </div>
        )}

        <div className="flex justify-center flex-wrap gap-4 mb-10 max-w-lg mx-auto">
            {wordData.letters.map((char, i) => (
                <button
                    key={i}
                    onClick={() => addLetter(char)}
                    disabled={submitted}
                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white text-2xl font-bold shadow-lg shadow-blue-200 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                    {char}
                </button>
            ))}
            <button 
                onClick={handleBackspace}
                disabled={submitted || currentWord.length === 0}
                className="w-16 h-16 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors disabled:opacity-50"
                aria-label="Backspace"
            >
                <Delete size={24} />
            </button>
        </div>

        <div className="flex flex-col items-center gap-4">
            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 animate-pulse">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}
            {!submitted && (
                <button 
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-full font-semibold shadow-lg shadow-blue-200 transition-all"
                >
                    Check Word
                </button>
            )}
        </div>
    </div>
  );
};