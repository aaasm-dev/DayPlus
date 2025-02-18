export type Mood = 'very-happy' | 'somewhat-happy' | 'neutral' | 'somewhat-sad' | 'sad';

export type Emotion = 'happy' | 'sad' | 'disappointed' | 'inspired' | 'annoyed' | 
  'embarrassed' | 'neutral' | 'anxious' | 'fear' | 'shocked' | 'bored';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  emotion: Emotion;
  mood?: Mood;
  emotionScores?: { emotion: Emotion; percentage: number }[];
}

export interface EmotionScore {
  emotion: Emotion;
  percentage: number;
}

export type HabitInterval = 'daily' | 'specific-days' | 'weekly' | 'monthly';

export interface HabitDuration {
  hours?: number;
  minutes?: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: 'wellness' | 'personal' | 'health' | 'learning' | 'other';
  startDate: string;
  streak: number;
  lastChecked: string | null;
  interval: HabitInterval;
  specificDays?: string[]; // ['mon', 'wed', 'fri']
  objective?: string;
  duration?: HabitDuration;
  status: 'active' | 'paused';
  type?: string;
}

export const moodColors: Record<Mood, { bg: string; text: string }> = {
  'very-happy': { bg: 'bg-emerald-500', text: 'text-white' },
  'somewhat-happy': { bg: 'bg-emerald-300', text: 'text-emerald-900' },
  'neutral': { bg: 'bg-gray-400', text: 'text-white' },
  'somewhat-sad': { bg: 'bg-blue-300', text: 'text-blue-900' },
  'sad': { bg: 'bg-blue-500', text: 'text-white' }
};

export const moodEmojis: Record<Mood, string> = {
  'very-happy': '😊',
  'somewhat-happy': '🙂',
  'neutral': '😐',
  'somewhat-sad': '🙁',
  'sad': '😢'
};

export const emotionColors: Record<Emotion, string> = {
  happy: 'bg-emerald-100 text-emerald-800',
  sad: 'bg-blue-100 text-blue-800',
  disappointed: 'bg-gray-100 text-gray-800',
  inspired: 'bg-purple-100 text-purple-800',
  annoyed: 'bg-orange-100 text-orange-800',
  embarrassed: 'bg-pink-100 text-pink-800',
  neutral: 'bg-slate-100 text-slate-800',
  anxious: 'bg-amber-100 text-amber-800',
  fear: 'bg-red-100 text-red-800',
  shocked: 'bg-indigo-100 text-indigo-800',
  bored: 'bg-slate-100 text-slate-800'
};

export const workoutTypes = [
  'strength training',
  'cardio',
  'yoga',
  'hiit',
  'swimming',
  'running',
  'cycling',
  'pilates',
  'dance',
  'sports',
  'calisthenics',
  'crossfit'
] as const;

export const meditationPractices = [
  'mindfulness',
  'breathing',
  'body scan',
  'loving-kindness',
  'transcendental',
  'zen',
  'vipassana',
  'walking',
  'sound',
  'mantra'
] as const;

export const habitTemplates = [
  {
    name: 'workout',
    icon: '💪',
    category: 'health' as const,
    requiresType: true,
    types: workoutTypes,
    requiresDuration: true
  },
  {
    name: 'learning a skill',
    icon: '🎯',
    category: 'learning' as const,
    requiresDuration: true
  },
  {
    name: 'reading a book',
    icon: '📚',
    category: 'personal' as const,
    requiresDuration: true
  },
  {
    name: 'smoke-free',
    icon: '🚭',
    category: 'health' as const,
    requiresDuration: false
  },
  {
    name: 'journaling',
    icon: '✍️',
    category: 'personal' as const,
    requiresDuration: false
  },
  {
    name: 'meditation',
    icon: '🧘',
    category: 'wellness' as const,
    requiresType: true,
    types: meditationPractices,
    requiresDuration: true
  },
  {
    name: 'quality time',
    icon: '❤️',
    category: 'personal' as const,
    requiresDuration: true
  },
  {
    name: 'other',
    icon: '✨',
    category: 'other' as const,
    requiresDuration: true
  }
] as const;