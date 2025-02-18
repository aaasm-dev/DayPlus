import React from 'react';
import { JournalEntry, emotionColors } from '../types';
import { format, subMonths } from 'date-fns';

interface JournalListProps {
  entries: JournalEntry[];
}

export function JournalList({ entries }: JournalListProps) {
  const threeMonthsAgo = subMonths(new Date(), 3);
  const filteredEntries = entries
    .filter(entry => new Date(entry.date) >= threeMonthsAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (date: Date) => {
    const month = format(date, 'MMMM').toLowerCase();
    const day = format(date, 'd');
    const year = format(date, 'yyyy');
    return `${month} ${day}, ${year}`;
  };

  return (
    <div className="min-h-screen bg-primary-50 p-6 pb-24">
      <h2 className="text-xl font-display text-primary-800 mb-6">my soul pieces</h2>
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div 
            key={entry.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-sage-100"
          >
            <div className="flex justify-between items-start mb-3">
              <p className="text-primary-500 text-sm">
                {formatDate(new Date(entry.date))}
              </p>
            </div>
            <p className="text-primary-700 mb-4">{entry.content}</p>
            <div className="flex flex-wrap gap-2">
              {entry.emotionScores?.map(({ emotion }) => (
                <span
                  key={emotion}
                  className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${emotionColors[emotion]}`}
                >
                  {emotion.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        ))}
        {filteredEntries.length === 0 && (
          <p className="text-center text-primary-500 py-8">
            no entries in the last 3 months
          </p>
        )}
      </div>
    </div>
  );
}