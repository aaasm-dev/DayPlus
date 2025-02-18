import React from 'react';
import { Mood, moodColors, moodEmojis } from '../types';

interface MoodSelectorProps {
  selectedMood: Mood | undefined;
  onSelectMood: (mood: Mood) => void;
}

export function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  const moods: Mood[] = ['very-happy', 'somewhat-happy', 'neutral', 'somewhat-sad', 'sad'];

  return (
    <div className="flex justify-between items-center gap-2">
      {moods.map((mood) => (
        <button
          key={mood}
          onClick={() => onSelectMood(mood)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
            ${mood === selectedMood 
              ? 'ring-2 ring-offset-2 ring-sage-300 scale-110' 
              : 'hover:scale-105'
            }
            ${moodColors[mood].bg}
            ${moodColors[mood].text}`}
        >
          {moodEmojis[mood]}
        </button>
      ))}
    </div>
  );
}