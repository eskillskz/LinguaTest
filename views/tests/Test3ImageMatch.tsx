import React, { useState, useEffect } from 'react';
import { trackEvent } from '../../services/analytics';
import { TestType } from '../../types';
import { AlertCircle } from 'lucide-react';

interface Item {
  id: string;
  word: string;
  imageUrl: string;
  explanation: string;
}

const items: Item[] = [
  { id: "apple", word: "Apple", imageUrl: "https://picsum.photos/seed/apple/300/300", explanation: "This is a red fruit." },
  { id: "cat", word: "Cat", imageUrl: "https://picsum.photos/seed/cat/300/300", explanation: "A small feline pet." },
  { id: "bus", word: "Bus", imageUrl: "https://picsum.photos/seed/bus/300/300", explanation: "Large public transport vehicle." },
  { id: "tree", word: "Tree", imageUrl: "https://picsum.photos/seed/tree/300/300", explanation: "A large plant with a trunk." }
];

export const Test3ImageMatch: React.FC = () => {
  // Map imageId -> wordId
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [draggedWordId, setDraggedWordId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent({ event_name: 'test_started', test_id: TestType.IMAGE_MATCH, timestamp: Date.now() });
  }, []);

  const handleDragStart = (wordId: string) => {
    if (!submitted) {
        setDraggedWordId(wordId);
        setError(null);
    }
  };

  const handleDrop = (targetImageId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedWordId && !submitted) {
      setMatches(prev => ({ ...prev, [targetImageId]: draggedWordId }));
      setDraggedWordId(null);
      setError(null);
    }
  };

  const handleSubmit = () => {
    // Validation: Check if every image has a match
    if (Object.keys(matches).length < items.length) {
        setError("You have not completed the exercise.");
        return;
    }

    setSubmitted(true);
    let correct = 0;
    items.forEach(item => {
        if(matches[item.id] === item.id) correct++;
    });
    trackEvent({ 
        event_name: 'test_submitted', 
        test_id: TestType.IMAGE_MATCH, 
        timestamp: Date.now(), 
        score: (correct / items.length) * 100 
    });
  };

  return (
    <div className="max-w-[980px] mx-auto p-8 mt-8 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <h2 className="text-xl font-semibold mb-8 text-slate-800">Drag the words to the matching images.</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {items.map(item => {
          const matchedWordId = matches[item.id];
          const matchedItem = items.find(i => i.id === matchedWordId);
          const isCorrect = submitted && matchedWordId === item.id;
          const isWrong = submitted && matchedWordId && matchedWordId !== item.id;

          return (
            <div 
              key={item.id} 
              className="flex flex-col items-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(item.id, e)}
            >
              <div className={`relative w-full aspect-square rounded-xl overflow-hidden border-4 transition-all ${isCorrect ? 'border-green-400' : isWrong ? 'border-red-400' : 'border-transparent bg-slate-100'}`}>
                <img src={item.imageUrl} alt="target" className="w-full h-full object-cover" />
                
                {/* Drop Zone Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${matchedWordId ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                   {matchedItem ? (
                     <span className="bg-white px-4 py-2 rounded-full font-bold shadow-lg">{matchedItem.word}</span>
                   ) : (
                     <span className="text-white text-sm font-medium border border-white/50 px-3 py-1 rounded-full">Drop Here</span>
                   )}
                </div>
              </div>
              
              {isWrong && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded w-full text-center">
                  Correct: {item.word}. <br/> {item.explanation}
                </div>
              )}
               {isCorrect && (
                <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded w-full text-center font-bold">
                  Correct!
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Word Bank</p>
        <div className="flex flex-wrap gap-4">
          {items.map(item => {
            // Hide word if it's already matched somewhere
            const isUsed = Object.values(matches).includes(item.id);
            if (isUsed) return null;

            return (
              <div
                key={item.id}
                draggable={!submitted}
                onDragStart={() => handleDragStart(item.id)}
                className="px-6 py-3 bg-white border border-slate-300 shadow-sm rounded-lg font-bold text-slate-700 cursor-grab active:cursor-grabbing hover:border-orange-400 hover:text-orange-500 transition-colors"
              >
                {item.word}
              </div>
            );
          })}
          {Object.keys(matches).length === items.length && !submitted && (
             <span className="text-slate-400 italic">All words placed. Click Submit!</span>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 animate-pulse">
                <AlertCircle size={20} />
                <span>{error}</span>
            </div>
        )}
        {!submitted ? (
             <button 
                onClick={handleSubmit}
                className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-full font-semibold shadow-lg shadow-orange-200 transition-all"
            >
                Submit Matches
            </button>
        ) : (
             <button 
                onClick={() => { setMatches({}); setSubmitted(false); setError(null); trackEvent({ event_name: 'test_reset', test_id: TestType.IMAGE_MATCH, timestamp: Date.now() }); }}
                className="text-slate-500 hover:text-slate-700 font-medium underline"
            >
                Reset Test
            </button>
        )}
      </div>
    </div>
  );
};