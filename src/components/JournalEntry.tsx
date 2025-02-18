import React, { useState } from 'react';
import { Emotion, Mood } from '../types';
import { analyzeEmotions } from '../utils/sentimentAnalysis';
import { format, isFuture, startOfDay } from 'date-fns';
import { MoodSelector } from './MoodSelector';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface JournalEntryProps {
  onSave: (content: string, emotion: Emotion, date: string, emotionScores: { emotion: Emotion; percentage: number }[], mood: Mood) => void;
  initialContent?: string;
  initialEmotion?: Emotion;
  initialDate?: string;
  initialMood?: Mood;
  isEditing?: boolean;
  onCancel?: () => void;
  isFollowUpEntry?: boolean;
}

export function JournalEntry({ 
  onSave, 
  initialContent = '', 
  initialEmotion = 'neutral',
  initialDate = format(new Date(), 'yyyy-MM-dd'),
  initialMood,
  isEditing = false,
  onCancel,
  isFollowUpEntry = false
}: JournalEntryProps) {
  const [content, setContent] = useState(initialContent);
  const [emotion, setEmotion] = useState<Emotion>(initialEmotion);
  const [date, setDate] = useState(initialDate);
  const [mood, setMood] = useState<Mood | undefined>(initialMood);
  const [emotionScores, setEmotionScores] = useState<{ emotion: Emotion; percentage: number }[]>([]);
  const [error, setError] = useState<string>('');

  const handleSave = () => {
    if (isFuture(startOfDay(new Date(date)))) {
      setError("can't add entries for future dates");
      return;
    }
    
    if (!isFollowUpEntry && !mood) {
      setError("please rate your day");
      return;
    }

    if (content.trim()) {
      const scores = analyzeEmotions(content);
      setEmotionScores(scores);
      setEmotion(scores[0]?.emotion || 'neutral');
      onSave(content, emotion, date, scores, mood || 'neutral');
      if (!isEditing) {
        setContent('');
        setEmotion('neutral');
        setDate(format(new Date(), 'yyyy-MM-dd'));
        setMood(undefined);
        setEmotionScores([]);
        setError('');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-sage-100 relative">
      {onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary-50 text-primary-600"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}

      <h3 className="text-lg font-medium text-primary-700 mb-6">
        record my day
      </h3>

      {!isFollowUpEntry && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary-600 mb-3">
            how was it?
          </label>
          <MoodSelector selectedMood={mood} onSelectMood={setMood} />
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="start writing..."
        className="w-full h-32 p-4 mb-4 border border-sage-100 rounded-xl resize-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 placeholder-primary-400 text-primary-700"
      />
      
      {error && (
        <p className="text-rose-500 text-sm mb-4">{error}</p>
      )}

      <div className="flex space-x-3">
        <button
          onClick={handleSave}
          disabled={!!error || (!isFollowUpEntry && !mood)}
          className={`flex-1 ${
            error || (!isFollowUpEntry && !mood)
              ? 'bg-sage-100 text-sage-400 cursor-not-allowed'
              : 'bg-sage-600 text-white hover:bg-sage-700'
          } py-2 px-4 rounded-lg transition-colors`}
        >
          {isEditing ? 'update' : 'save'} entry
        </button>
        
        {isEditing && onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 bg-primary-50 text-primary-700 py-2 px-4 rounded-lg hover:bg-primary-100 transition-colors"
          >
            cancel
          </button>
        )}
      </div>
    </div>
  );
}