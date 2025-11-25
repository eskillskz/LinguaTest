import React, { useState, useEffect } from 'react';
import { trackEvent } from '../../services/analytics';
import { TestType } from '../../types';
import { AlertCircle } from 'lucide-react';

interface Gap {
  id: string;
  correct: string;
  explanation: string;
}

interface Exercise {
  id: number;
  parts: (string | Gap)[];
  words: string[];
}

const exercisesData: Exercise[] = [
  {
    id: 1,
    parts: ["Yesterday I ", { id: "g1", correct: "went", explanation: "Use past tense 'went' for 'yesterday'." }, " to the market and ", { id: "g2", correct: "bought", explanation: "Use past tense 'bought' to match the sentence timeframe." }, " some fruit."],
    words: ["went", "goes", "buy", "bought"]
  },
  {
    id: 2,
    parts: ["She ", { id: "g3", correct: "plays", explanation: "Third person singular requires 's' (plays)." }, " tennis every Sunday, but she ", { id: "g4", correct: "doesn't", explanation: "Negative present simple for she is 'doesn't'." }, " like football."],
    words: ["play", "plays", "don't", "doesn't"]
  },
  {
    id: 3,
    parts: ["I am ", { id: "g5", correct: "interested", explanation: "Adjective describing a feeling uses -ed." }, " in learning how to ", { id: "g6", correct: "cook", explanation: "After 'to' use the infinitive verb." }, " Italian food."],
    words: ["interesting", "interested", "cooking", "cook"]
  },
  {
    id: 4,
    parts: ["The cat is ", { id: "g7", correct: "sleeping", explanation: "Present continuous: is + verb-ing." }, " on the ", { id: "g8", correct: "sofa", explanation: "A piece of furniture to sleep on." }, " right now."],
    words: ["sleeps", "sleeping", "sofa", "fridge"]
  }
];

export const Test1DragGaps: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For drag and drop logic
  const [draggedWord, setDraggedWord] = useState<string | null>(null);

  useEffect(() => {
    trackEvent({ event_name: 'test_started', test_id: TestType.DRAG_GAPS, timestamp: Date.now() });
  }, []);

  const handleDragStart = (word: string) => {
    setDraggedWord(word);
    setError(null);
  };

  const handleDrop = (gapId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedWord) {
      setAnswers(prev => ({ ...prev, [gapId]: draggedWord }));
      setDraggedWord(null);
      setError(null);
    }
  };

  // Helper to calculate available words for a specific exercise
  // This logic ensures words disappear from the list once used
  const getAvailableWords = (exercise: Exercise) => {
    // Get all words currently placed in gaps for this exercise
    const usedWords: string[] = [];
    exercise.parts.forEach(part => {
      if (typeof part !== 'string') {
        const val = answers[part.id];
        if (val) usedWords.push(val);
      }
    });

    // Create a frequency map of original words
    const counts: Record<string, number> = {};
    exercise.words.forEach(w => counts[w] = (counts[w] || 0) + 1);

    // Subtract used words
    usedWords.forEach(w => {
      if (counts[w]) counts[w]--;
    });

    // Return flattened list of remaining words
    return Object.keys(counts).flatMap(w => Array(counts[w]).fill(w));
  };

  const handleSubmit = () => {
    // Validate completion: Check if every gap has an answer
    let totalGaps = 0;
    let filledGaps = 0;

    exercisesData.forEach(ex => {
      ex.parts.forEach(part => {
        if (typeof part !== 'string') {
          totalGaps++;
          if (answers[part.id]) filledGaps++;
        }
      });
    });

    if (filledGaps < totalGaps) {
      setError("You have not completed the exercise.");
      return;
    }

    setSubmitted(true);
    let correctCount = 0;

    exercisesData.forEach(ex => {
      ex.parts.forEach(part => {
        if (typeof part !== 'string') {
          if (answers[part.id] === part.correct) correctCount++;
        }
      });
    });

    trackEvent({ 
      event_name: 'test_submitted', 
      test_id: TestType.DRAG_GAPS, 
      timestamp: Date.now(), 
      score: (correctCount / totalGaps) * 100 
    });
  };

  // Allow removing a word from a gap by clicking it (optional UX improvement)
  const removeAnswer = (gapId: string) => {
    if (!submitted) {
      const newAnswers = { ...answers };
      delete newAnswers[gapId];
      setAnswers(newAnswers);
    }
  };

  return (
    <div className="max-w-[980px] mx-auto p-7 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 mt-8">
      <h2 className="text-xl font-semibold mb-6 text-slate-700">Complete the sentences by dragging the correct words into the gaps.</h2>
      
      <div className="space-y-12">
        {exercisesData.map((ex) => {
          const availableWords = getAvailableWords(ex);
          
          return (
            <div key={ex.id} className="p-6 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-lg leading-10 text-slate-800">
                {ex.parts.map((part, idx) => {
                  if (typeof part === 'string') return <span key={idx}>{part}</span>;
                  
                  const isCorrect = submitted && answers[part.id] === part.correct;
                  const isWrong = submitted && answers[part.id] !== part.correct;
                  const hasValue = !!answers[part.id];
                  
                  return (
                    <span key={part.id} className="inline-block mx-1 align-middle relative group">
                      <span 
                        className={`inline-flex items-center justify-center min-w-[100px] h-10 px-3 rounded-md border-2 transition-colors cursor-pointer
                          ${isCorrect ? 'border-green-500 bg-green-50 text-green-800' : ''}
                          ${isWrong ? 'border-red-400 bg-red-50 text-red-800' : ''}
                          ${!submitted && hasValue ? 'border-slate-400 bg-white' : ''}
                          ${!submitted && !hasValue ? 'border-slate-300 bg-white border-dashed' : ''}
                        `}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(part.id, e)}
                        onClick={() => removeAnswer(part.id)}
                        title={!submitted && hasValue ? "Click to remove" : ""}
                      >
                        {answers[part.id] || ""}
                        {isCorrect && <span className="ml-2 text-green-600">✓</span>}
                        {isWrong && <span className="ml-2 text-red-500 font-bold">-</span>}
                      </span>
                      
                      {isWrong && (
                        <div className="block mt-2 text-sm p-3 bg-red-50 text-red-700 rounded border border-red-100 w-full max-w-md">
                          <p className="font-semibold">Correct: {part.correct}</p>
                          <p>{part.explanation}</p>
                        </div>
                      )}
                    </span>
                  );
                })}
              </div>
              
              <div className="mt-6 min-h-[60px] flex flex-wrap gap-3">
                {availableWords.map((word, i) => (
                  <div
                    key={`${word}-${i}`}
                    draggable={!submitted}
                    onDragStart={() => handleDragStart(word)}
                    className={`px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg cursor-grab active:cursor-grabbing hover:border-slate-400 hover:shadow-md transition-all font-medium text-slate-700 ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {word}
                  </div>
                ))}
                {availableWords.length === 0 && !submitted && (
                   <span className="text-slate-400 italic text-sm self-center">All words placed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 animate-pulse">
                <AlertCircle size={20} />
                <span>{error}</span>
            </div>
        )}
        {!submitted ? (
          <button 
            onClick={handleSubmit}
            className="bg-slate-900 text-white px-10 py-3 rounded-full font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          >
            Submit Answers
          </button>
        ) : (
           <div className="text-center text-slate-500 italic">Test completed. Review your results above.</div>
        )}
      </div>
    </div>
  );
};