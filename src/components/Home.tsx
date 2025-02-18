import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { JournalEntry as JournalEntryType, Habit, Emotion, Mood } from '../types';
import { format } from 'date-fns';
import { JournalEntry } from './JournalEntry';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';

interface HomeProps {
  entries: JournalEntryType[];
  habits: Habit[];
  userName: string;
  onNavigateToJournal: () => void;
  onNavigateToHabits: () => void;
  onSaveEntry: (content: string, emotion: Emotion, date: string, emotionScores: { emotion: Emotion; percentage: number }[], mood: Mood) => void;
}

function getMoodDescription(entries: JournalEntryType[]): string {
  if (!entries || entries.length === 0) return '';

  // Combine all emotion scores from all entries
  const combinedEmotions: { [key in Emotion]?: number } = {};
  let totalScore = 0;

  entries.forEach(entry => {
    entry.emotionScores?.forEach(score => {
      combinedEmotions[score.emotion] = (combinedEmotions[score.emotion] || 0) + score.percentage;
      totalScore += score.percentage;
    });
  });

  // Convert to percentage-based scores
  const normalizedScores = Object.entries(combinedEmotions).map(([emotion, score]) => ({
    emotion: emotion as Emotion,
    percentage: Math.round((score / totalScore) * 100)
  })).sort((a, b) => b.percentage - a.percentage);

  if (normalizedScores.length === 0) return '';

  const primary = normalizedScores[0];
  const secondary = normalizedScores[1];

  if (!secondary) {
    return `feeling ${primary.emotion}`;
  }

  if (primary.percentage >= 70) {
    return `mostly ${primary.emotion} with a hint of ${secondary.emotion}`;
  }

  if (primary.percentage >= 50) {
    return `feeling ${primary.emotion} and somewhat ${secondary.emotion}`;
  }

  if (Math.abs(primary.percentage - secondary.percentage) <= 10) {
    return `a mix of ${primary.emotion} and ${secondary.emotion}`;
  }

  return `primarily ${primary.emotion} with ${secondary.emotion} moments`;
}

export function Home({ entries, habits, userName, onNavigateToJournal, onNavigateToHabits, onSaveEntry }: HomeProps) {
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [showFollowUpEntry, setShowFollowUpEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntryType | null>(null);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntries = entries.filter(entry => entry.date === today);
  const mainEntry = todayEntries[0];

  const formatDate = (date: Date) => {
    const month = format(date, 'MMMM').toLowerCase();
    const day = format(date, 'd');
    const year = format(date, 'yyyy');
    return `${month} ${day}, ${year}`;
  };

  return (
    <div className="min-h-screen bg-primary-50 p-6">
      <div className="space-y-2 mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-display text-primary-800"
        >
          welcome back, {userName}
        </motion.h1>
        <p className="text-sm text-primary-500">
          {formatDate(new Date())}
        </p>
      </div>

      <div className="grid gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-sage-100"
        >
          <h2 className="text-lg font-medium text-primary-700 mb-4">today's mood</h2>
          {showJournalEntry || editingEntry ? (
            <JournalEntry 
              onSave={(content, emotion, date, emotionScores, mood) => {
                onSaveEntry(content, emotion, date, emotionScores, mood);
                setShowJournalEntry(false);
                setEditingEntry(null);
              }}
              onCancel={() => {
                setShowJournalEntry(false);
                setEditingEntry(null);
              }}
              initialContent={editingEntry?.content}
              initialEmotion={editingEntry?.emotion}
              initialDate={editingEntry?.date}
              initialMood={editingEntry?.mood}
              isEditing={!!editingEntry}
            />
          ) : showFollowUpEntry ? (
            <JournalEntry 
              onSave={(content, emotion, date, emotionScores, mood) => {
                onSaveEntry(content, emotion, date, emotionScores, mood);
                setShowFollowUpEntry(false);
              }}
              onCancel={() => setShowFollowUpEntry(false)}
              isFollowUpEntry
            />
          ) : mainEntry ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <p className="text-primary-600">
                  {getMoodDescription(todayEntries)}
                </p>
                <button
                  onClick={() => setEditingEntry(mainEntry)}
                  className="p-2 rounded-full hover:bg-primary-50 text-primary-600"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
              <div 
                className="flex items-center space-x-2 text-sage-600 cursor-pointer group"
                onClick={() => setShowFollowUpEntry(true)}
              >
                <button className="p-2 rounded-full hover:bg-sage-50 transition-colors">
                  <PlusIcon className="w-5 h-5" />
                </button>
                <span className="text-sm group-hover:text-sage-700 transition-colors">
                  more about my day
                </span>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowJournalEntry(true)}
              className="w-full py-3 px-4 rounded-lg bg-sage-50 text-sage-700 hover:bg-sage-100 transition-colors"
            >
              record my day
            </button>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-sage-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-primary-700">habit streaks</h2>
            <button 
              onClick={onNavigateToHabits}
              className="text-sage-600 hover:text-sage-700"
            >
              view all
            </button>
          </div>
          {habits.length > 0 ? (
            <div className="space-y-3">
              {habits.map(habit => (
                <div 
                  key={habit.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-primary-50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-primary-400">{habit.icon}</span>
                    <span className="text-primary-700">{habit.name}</span>
                  </div>
                  <span className="text-primary-600">{habit.streak} days</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-primary-500 text-center py-4">
              no habits tracked yet
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}