import React, { useState, useEffect } from 'react';
import { trackEvent } from '../../services/analytics';
import { TestType } from '../../types';
import { AlertCircle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Item {
  id: string;
  text: string;
  categoryId: string;
  explanation: string;
}

const categories: Category[] = [
  { id: "food", name: "Food", color: "bg-orange-100 border-orange-200 text-orange-800" },
  { id: "transport", name: "Transport", color: "bg-blue-100 border-blue-200 text-blue-800" },
  { id: "furniture", name: "Furniture", color: "bg-purple-100 border-purple-200 text-purple-800" },
];

const itemsData: Item[] = [
  { id: "i1", text: "Apple", categoryId: "food", explanation: "An apple is a fruit you eat." },
  { id: "i2", text: "Train", categoryId: "transport", explanation: "A train is a vehicle for moving people." },
  { id: "i3", text: "Sofa", categoryId: "furniture", explanation: "A sofa is a seat found in living rooms." },
  { id: "i4", text: "Bread", categoryId: "food", explanation: "Bread is a staple food." },
  { id: "i5", text: "Bus", categoryId: "transport", explanation: "A bus drives on roads carrying passengers." },
  { id: "i6", text: "Chair", categoryId: "furniture", explanation: "A chair is used for sitting." }
];

export const Test6Columns: React.FC = () => {
  // Map itemId -> categoryId (or 'pool')
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize all to pool
    const initial: Record<string, string> = {};
    itemsData.forEach(i => initial[i.id] = 'pool');
    setPlacements(initial);
    trackEvent({ event_name: 'test_started', test_id: TestType.COLUMNS, timestamp: Date.now() });
  }, []);

  const handleDragStart = (itemId: string) => {
    if (!submitted) {
        setDraggedItem(itemId);
        setError(null);
    }
  };

  const handleDrop = (targetCatId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem && !submitted) {
      setPlacements(prev => ({ ...prev, [draggedItem]: targetCatId }));
      setDraggedItem(null);
      setError(null);
    }
  };

  const handleSubmit = () => {
    // Validation: Check if any item is still in 'pool'
    const unsorted = Object.values(placements).some(catId => catId === 'pool');
    if (unsorted) {
        setError("You have not completed the exercise.");
        return;
    }

    setSubmitted(true);
    let correct = 0;
    itemsData.forEach(i => {
        if(placements[i.id] === i.categoryId) correct++;
    });
    trackEvent({ 
        event_name: 'test_submitted', 
        test_id: TestType.COLUMNS, 
        timestamp: Date.now(), 
        score: (correct / itemsData.length) * 100 
    });
  };

  return (
    <div className="max-w-[980px] mx-auto p-8 mt-8 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
       <h2 className="text-xl font-semibold mb-8 text-slate-800">Categorize the words into the correct columns.</h2>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map(cat => (
             <div 
                key={cat.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(cat.id, e)}
                className={`min-h-[250px] rounded-xl border-2 p-4 flex flex-col gap-2 transition-colors ${cat.color} ${submitted ? '' : 'hover:brightness-95'}`}
             >
                <h3 className="font-bold text-center uppercase tracking-wide mb-4">{cat.name}</h3>
                
                {itemsData.filter(i => placements[i.id] === cat.id).map(item => {
                    const isCorrect = submitted && item.categoryId === cat.id;
                    const isWrong = submitted && item.categoryId !== cat.id;
                    
                    return (
                        <div key={item.id} className="relative">
                            <div 
                                draggable={!submitted}
                                onDragStart={() => handleDragStart(item.id)}
                                className={`p-3 bg-white rounded shadow-sm font-medium text-slate-800 cursor-grab active:cursor-grabbing border ${isCorrect ? 'border-green-500 ring-1 ring-green-500' : isWrong ? 'border-red-500 ring-1 ring-red-500' : 'border-transparent'}`}
                            >
                                {item.text}
                            </div>
                            {isWrong && (
                                <div className="text-xs bg-red-100 text-red-800 p-2 mt-1 rounded">
                                    Should be in: <strong>{categories.find(c => c.id === item.categoryId)?.name}</strong>
                                </div>
                            )}
                        </div>
                    )
                })}
             </div>
          ))}
       </div>

       <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 min-h-[100px]">
          <p className="text-sm font-semibold text-slate-400 uppercase mb-4">Unsorted Words</p>
          <div 
            className="flex flex-wrap gap-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop('pool', e)}
          >
            {itemsData.filter(i => placements[i.id] === 'pool').map(item => (
                 <div 
                    key={item.id}
                    draggable={!submitted}
                    onDragStart={() => handleDragStart(item.id)}
                    className="px-5 py-2 bg-white border border-slate-300 shadow-sm rounded-full cursor-grab hover:shadow-md hover:border-purple-300 transition-all text-slate-700"
                >
                    {item.text}
                </div>
            ))}
            {itemsData.filter(i => placements[i.id] === 'pool').length === 0 && !submitted && (
                <span className="text-slate-400 italic text-sm">Drag items from columns back here if needed.</span>
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
            {!submitted && (
                <button 
                    onClick={handleSubmit}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-3 rounded-full font-semibold shadow-lg shadow-purple-200 transition-all"
                >
                    Check Categories
                </button>
            )}
       </div>
    </div>
  );
};