import React, { useState, useEffect } from 'react';
import { trackEvent } from '../../services/analytics';
import { TestType } from '../../types';
import { AlertCircle } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correct: string;
  explanation: string;
}

interface MCQTest {
  id: string;
  name: string;
  questions: Question[];
}

const testsData: MCQTest[] = [
  {
    id: "A",
    name: "Test A: Articles",
    questions: [
      { id: "q1", text: "Choose the correct article: ___ apple", options: ["a", "an", "the"], correct: "an", explanation: "Use 'an' before words starting with a vowel sound." },
      { id: "q2", text: "I saw ___ elephant at the zoo.", options: ["a", "an", "the"], correct: "an", explanation: "Elephant starts with a vowel sound." },
      { id: "q3", text: "She is ___ doctor.", options: ["a", "an", "the"], correct: "a", explanation: "Use 'a' for professions starting with a consonant." }
    ]
  },
  {
    id: "B",
    name: "Test B: Verb Tenses",
    questions: [
      { id: "q4", text: "She ___ to school yesterday.", options: ["go", "went", "gone"], correct: "went", explanation: "Past simple of 'go' is 'went'." },
      { id: "q5", text: "They have ___ their homework.", options: ["finish", "finished", "finishing"], correct: "finished", explanation: "Present perfect uses 'have' + past participle." },
      { id: "q6", text: "He is ___ right now.", options: ["run", "ran", "running"], correct: "running", explanation: "Present continuous uses verb+ing." }
    ]
  },
  {
    id: "C",
    name: "Test C: Vocabulary",
    questions: [
      { id: "q7", text: "Opposite of 'Hot'", options: ["Cold", "Warm", "Fire"], correct: "Cold", explanation: "The direct antonym of hot is cold." },
      { id: "q8", text: "A place where you buy books.", options: ["Library", "Bookstore", "Gym"], correct: "Bookstore", explanation: "You buy books at a bookstore; you borrow them from a library." },
      { id: "q9", text: "Synonym for 'Happy'", options: ["Sad", "Angry", "Joyful"], correct: "Joyful", explanation: "Joyful means full of happiness." }
    ]
  }
];

export const Test2MCQ: React.FC = () => {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submittedTests, setSubmittedTests] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    trackEvent({ event_name: 'test_started', test_id: TestType.MCQ, timestamp: Date.now() });
  }, []);

  const handleSelect = (qId: string, option: string, testId: string) => {
    if (submittedTests[testId]) return;
    setSelections(prev => ({ ...prev, [qId]: option }));
    setErrors(prev => ({ ...prev, [testId]: null }));
  };

  const handleSubmit = (testId: string) => {
    const test = testsData.find(t => t.id === testId);
    if (!test) return;

    // Validation: Check if all questions are answered
    const unanswered = test.questions.some(q => !selections[q.id]);
    if (unanswered) {
        setErrors(prev => ({ ...prev, [testId]: "You have not completed the exercise." }));
        return;
    }

    setSubmittedTests(prev => ({ ...prev, [testId]: true }));
    
    // Calculate score for this sub-test
    let correct = 0;
    test.questions.forEach(q => {
        if(selections[q.id] === q.correct) correct++;
    });
    trackEvent({ 
        event_name: 'test_submitted', 
        test_id: TestType.MCQ, 
        timestamp: Date.now(),
        score: (correct / test.questions.length) * 100
    });
  };

  return (
    <div className="max-w-[980px] mx-auto space-y-8 pb-10 mt-8">
      {testsData.map(test => (
        <div key={test.id} className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">{test.name}</h2>
          
          <div className="space-y-8">
            {test.questions.map(q => {
              const isSubmitted = submittedTests[test.id];
              const isCorrect = isSubmitted && selections[q.id] === q.correct;
              const isWrong = isSubmitted && selections[q.id] !== q.correct;

              return (
                <div key={q.id}>
                  <p className="text-lg text-slate-700 font-medium mb-3">{q.text}</p>
                  <div className="flex flex-col gap-2">
                    {q.options.map(opt => {
                      const isSelected = selections[q.id] === opt;
                      let optionClass = "p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ";
                      
                      if (isSubmitted) {
                        if (opt === q.correct) {
                           optionClass += "bg-green-50 border-green-500 text-green-800";
                        } else if (isSelected && opt !== q.correct) {
                           optionClass += "bg-red-50 border-red-500 text-red-800";
                        } else {
                           optionClass += "bg-white border-slate-200 opacity-50";
                        }
                      } else {
                        if (isSelected) {
                          optionClass += "bg-sky-50 border-sky-500 text-sky-800 shadow-sm";
                        } else {
                          optionClass += "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                        }
                      }

                      return (
                        <div 
                          key={opt} 
                          onClick={() => handleSelect(q.id, opt, test.id)}
                          className={optionClass}
                        >
                          <span>{opt}</span>
                          {isSubmitted && opt === q.correct && <span className="text-green-600 font-bold">✓</span>}
                          {isSubmitted && isSelected && opt !== q.correct && <span className="text-red-500 font-bold">✕</span>}
                        </div>
                      );
                    })}
                  </div>
                  {isWrong && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded text-red-800 text-sm">
                       <strong>Incorrect.</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {errors[test.id] && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                    <AlertCircle size={20} />
                    <span>{errors[test.id]}</span>
                </div>
            )}
            {!submittedTests[test.id] ? (
                <button 
                onClick={() => handleSubmit(test.id)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                Submit {test.name}
                </button>
            ) : (
                <div className="text-center text-slate-500 text-sm font-medium">Results shown above</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};