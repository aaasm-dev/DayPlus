import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Tab } from '@headlessui/react';
import { JournalEntry as JournalEntryType, Emotion, Habit, emotionColors, Mood } from './types';
import { JournalEntry } from './components/JournalEntry';
import { EmotionCalendar } from './components/Calendar';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { Habits } from './components/Habits';
import { NamePrompt } from './components/NamePrompt';
import { JournalList } from './components/JournalList';

export default function App() {
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));
  const [showNamePrompt, setShowNamePrompt] = useState(!localStorage.getItem('userName'));

  const handleNameSubmit = (name: string) => {
    localStorage.setItem('userName', name);
    setUserName(name);
    setShowNamePrompt(false);
  };

  const handleSaveEntry = (content: string, emotion: Emotion, date: string, emotionScores: { emotion: Emotion; percentage: number }[], mood: Mood) => {
    const newEntry: JournalEntryType = {
      id: Date.now().toString(),
      date,
      content,
      emotion,
      emotionScores,
      mood
    };
    setEntries([...entries, newEntry]);
  };

  const handleUpdateEntry = (id: string, content: string, emotion: Emotion, date: string, emotionScores: { emotion: Emotion; percentage: number }[], mood: Mood) => {
    setEntries(entries.map(entry => 
      entry.id === id 
        ? { ...entry, content, emotion, emotionScores, mood }
        : entry
    ));
    setEditingEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddHabit = (habit: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString()
    };
    setHabits([...habits, newHabit]);
  };

  const handleUpdateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { ...habit, ...updates }
        : habit
    ));
  };

  const handleDeleteHabit = (id: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      setHabits(habits.filter(habit => habit.id !== id));
    }
  };

  if (showNamePrompt) {
    return <NamePrompt onSubmit={handleNameSubmit} />;
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="hidden">
          <Tab>Home</Tab>
          <Tab>Habits</Tab>
          <Tab>Journal</Tab>
          <Tab>Calendar</Tab>
        </Tab.List>

        <Tab.Panels className="h-[calc(100vh-64px)]">
          <Tab.Panel className="h-full overflow-y-auto">
            <Home
              entries={entries}
              habits={habits}
              userName={userName || ''}
              onNavigateToJournal={() => setSelectedTab(2)}
              onNavigateToHabits={() => setSelectedTab(1)}
              onSaveEntry={handleSaveEntry}
            />
          </Tab.Panel>

          <Tab.Panel className="h-full overflow-y-auto">
            <Habits
              habits={habits}
              onAddHabit={handleAddHabit}
              onUpdateHabit={handleUpdateHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          </Tab.Panel>

          <Tab.Panel className="h-full overflow-y-auto">
            <JournalList entries={entries} />
          </Tab.Panel>
          
          <Tab.Panel className="h-full overflow-y-auto">
            <div className="p-6 pb-24">
              <EmotionCalendar 
                entries={entries}
                habits={habits}
                onDayClick={handleDayClick}
              />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <Navigation selectedIndex={selectedTab} onChange={setSelectedTab} />
    </div>
  );
}