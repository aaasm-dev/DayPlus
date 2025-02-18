import React from 'react';
import { Emotion, emotionColors } from '../types';

interface EmotionSelectorProps {
  selectedEmotion: Emotion;
  onSelectEmotion: (emotion: Emotion) => void;
}

export function EmotionSelector({ selectedEmotion, onSelectEmotion }: EmotionSelectorProps) {
  const emotions: Emotion[] = ['happy', 'sad', 'disappointed', 'inspired', 'angry', 'embarrassed', 'neutral'];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {emotions.map((emotion) => (
        <button
          key={emotion}
          onClick={() => onSelectEmotion(emotion)}
          className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all
            ${emotion === selectedEmotion 
              ? 'ring-2 ring-offset-2 ring-rose-300' 
              : ''
            }
            ${emotionColors[emotion]} 
            ${emotion === 'neutral' 
              ? 'border border-rose-100 text-gray-600 hover:bg-rose-50' 
              : 'text-white hover:opacity-90'
            }`}
        >
          {emotion}
        </button>
      ))}
    </div>
  );
}