import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit, HabitInterval, habitTemplates, HabitDuration } from '../types';
import { format, isToday } from 'date-fns';
import { PlusIcon, CheckIcon, XMarkIcon, PencilIcon, PauseIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline';

interface NewHabitModalProps {
  onClose: () => void;
  onConfirm: (habit: Omit<Habit, 'id'>) => void;
  existingHabit?: Habit;
}

interface HabitsProps {
  habits: Habit[];
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  onDeleteHabit: (id: string) => void;
}

function NewHabitModal({ onClose, onConfirm, existingHabit }: NewHabitModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(
    existingHabit ? habitTemplates.find(t => t.name === existingHabit.name) : null
  );
  const [habitType, setHabitType] = useState(existingHabit?.type || '');
  const [interval, setInterval] = useState<HabitInterval>(existingHabit?.interval || 'daily');
  const [specificDays, setSpecificDays] = useState<string[]>(existingHabit?.specificDays || []);
  const [duration, setDuration] = useState<HabitDuration>(existingHabit?.duration || {});
  const [objective, setObjective] = useState(existingHabit?.objective || '');

  const isHabitTypeValid = !selectedTemplate?.requiresType || habitType;

  const handleConfirm = () => {
    if (!selectedTemplate) return;

    const newHabit: Omit<Habit, 'id'> = {
      name: selectedTemplate.name,
      icon: selectedTemplate.icon,
      category: selectedTemplate.category,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      streak: existingHabit?.streak || 0,
      lastChecked: existingHabit?.lastChecked || null,
      interval,
      ...(interval === 'specific-days' && { specificDays }),
      ...(selectedTemplate.requiresType && { type: habitType }),
      ...(duration.hours || duration.minutes ? { duration } : {}),
      ...(objective && { objective }),
      status: existingHabit?.status || 'active'
    };

    onConfirm(newHabit);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl p-6 w-full max-w-md my-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display text-primary-800">
            {existingHabit ? 'edit habit' : 'set up new habit'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-primary-50"
          >
            <XMarkIcon className="w-5 h-5 text-primary-600" />
          </button>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              I want to start
            </label>
            <select
              value={selectedTemplate?.name || ''}
              onChange={(e) => {
                const template = habitTemplates.find(h => h.name === e.target.value);
                setSelectedTemplate(template || null);
                if (template?.requiresType) setHabitType('');
              }}
              className="w-full p-3 rounded-lg border border-sage-100 focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
            >
              <option value="">select a habit</option>
              {habitTemplates.map((template) => (
                <option key={template.name} value={template.name}>
                  {template.icon} {template.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTemplate?.requiresType && (
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                type
              </label>
              <select
                value={habitType}
                onChange={(e) => setHabitType(e.target.value)}
                className="w-full p-3 rounded-lg border border-sage-100 focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
              >
                <option value="">select type</option>
                {[...selectedTemplate.types, 'other'].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedTemplate && (
            <>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-primary-700">
                  I will do it
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setInterval('daily')}
                    className={`p-3 rounded-lg text-sm font-medium ${
                      interval === 'daily'
                        ? 'bg-sage-50 text-sage-700'
                        : 'bg-white border border-sage-100 text-primary-600 hover:bg-sage-50'
                    }`}
                  >
                    daily
                  </button>
                  <button
                    onClick={() => setInterval('specific-days')}
                    className={`p-3 rounded-lg text-sm font-medium ${
                      interval === 'specific-days'
                        ? 'bg-sage-50 text-sage-700'
                        : 'bg-white border border-sage-100 text-primary-600 hover:bg-sage-50'
                    }`}
                  >
                    specific days
                  </button>
                </div>

                {interval === 'specific-days' && (
                  <div className="grid grid-cols-7 gap-2">
                    {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                      <button
                        key={day}
                        onClick={() => {
                          setSpecificDays(
                            specificDays.includes(day)
                              ? specificDays.filter(d => d !== day)
                              : [...specificDays, day]
                          );
                        }}
                        className={`p-2 rounded-lg text-sm font-medium ${
                          specificDays.includes(day)
                            ? 'bg-sage-50 text-sage-700'
                            : 'bg-white border border-sage-100 text-primary-600 hover:bg-sage-50'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}

                {selectedTemplate.requiresDuration && (
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      for (optional)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={duration.hours || ''}
                        onChange={(e) => setDuration({ ...duration, hours: Math.min(23, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-16 p-1 text-center border border-sage-100 rounded-lg focus:ring-2 focus:ring-sage-200 focus:outline-none"
                        placeholder="0"
                      />
                      <span className="text-primary-600">h</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={duration.minutes || ''}
                        onChange={(e) => setDuration({ ...duration, minutes: Math.min(59, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-16 p-1 text-center border border-sage-100 rounded-lg focus:ring-2 focus:ring-sage-200 focus:outline-none"
                        placeholder="0"
                      />
                      <span className="text-primary-600">m</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  objective (optional)
                </label>
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="what's your goal?"
                  className="w-full p-3 rounded-lg border border-sage-100 focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                />
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedTemplate || 
                  (interval === 'specific-days' && specificDays.length === 0) ||
                  !isHabitTypeValid}
                className={`w-full py-3 rounded-lg font-medium ${
                  selectedTemplate && 
                  (interval !== 'specific-days' || specificDays.length > 0) &&
                  isHabitTypeValid
                    ? 'bg-sage-600 text-white hover:bg-sage-700'
                    : 'bg-sage-100 text-sage-400 cursor-not-allowed'
                }`}
              >
                {existingHabit ? 'update' : 'confirm'}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Habits({ habits, onAddHabit, onUpdateHabit, onDeleteHabit }: HabitsProps) {
  const [showNewHabitModal, setShowNewHabitModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Filter habits into categories
  const activeHabits = habits.filter(habit => habit.status === 'active' && habit.streak < 7);
  const streakingHabits = habits.filter(habit => habit.status === 'active' && habit.streak >= 7);
  const pausedHabits = habits.filter(habit => habit.status === 'paused');

  const handleCheckIn = (habit: Habit) => {
    if (!canCheckIn(habit)) return;
    onUpdateHabit(habit.id, {
      streak: habit.streak + 1,
      lastChecked: format(new Date(), 'yyyy-MM-dd')
    });
  };

  const canCheckIn = (habit: Habit) => {
    return !isToday(new Date(habit.lastChecked || ''));
  };

  const handlePauseHabit = (habit: Habit) => {
    onUpdateHabit(habit.id, {
      status: 'paused'
    });
  };

  const handleResumeHabit = (habit: Habit) => {
    onUpdateHabit(habit.id, {
      status: 'active',
      lastChecked: null,
      streak: 0
    });
  };

  const renderHabitStreak = (streak: number) => {
    return `${streak} ${streak === 1 ? 'streak' : 'streaks'}`;
  };

  return (
    <div className="min-h-screen bg-primary-50 p-6 pb-24">
      <div className="space-y-8">
        {habits.length > 0 && (
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-display text-primary-800">my habits</h2>
            <button
              onClick={() => setShowNewHabitModal(true)}
              className="p-2 rounded-full bg-sage-50 text-sage-700 hover:bg-sage-100"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {streakingHabits.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-primary-700 mb-4">on a streak!</h3>
            <div className="grid gap-4">
              {streakingHabits.map(habit => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-xl shadow-sm border border-sage-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <h4 className="font-medium text-primary-700">{habit.name}</h4>
                        <p className="text-sm text-primary-500">{renderHabitStreak(habit.streak)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCheckIn(habit)}
                        disabled={!canCheckIn(habit)}
                        className={`p-2 rounded-lg ${
                          canCheckIn(habit)
                            ? 'bg-sage-50 text-sage-700 hover:bg-sage-100'
                            : 'bg-sage-50 text-sage-400 cursor-not-allowed'
                        }`}
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingHabit(habit)}
                        className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handlePauseHabit(habit)}
                        className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100"
                      >
                        <PauseIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDeleteHabit(habit.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeHabits.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-primary-700 mb-4">current habits</h3>
            <div className="grid gap-4">
              {activeHabits.map(habit => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-xl shadow-sm border border-sage-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <h4 className="font-medium text-primary-700">{habit.name}</h4>
                        <p className="text-sm text-primary-500">{renderHabitStreak(habit.streak)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCheckIn(habit)}
                        disabled={!canCheckIn(habit)}
                        className={`p-2 rounded-lg ${
                          canCheckIn(habit)
                            ? 'bg-sage-50 text-sage-700 hover:bg-sage-100'
                            : 'bg-sage-50 text-sage-400 cursor-not-allowed'
                        }`}
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingHabit(habit)}
                        className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handlePauseHabit(habit)}
                        className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100"
                      >
                        <PauseIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDeleteHabit(habit.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {pausedHabits.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-primary-700 mb-4">continue?</h3>
            <div className="grid gap-4">
              {pausedHabits.map(habit => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-xl shadow-sm border border-sage-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <h4 className="font-medium text-primary-700">{habit.name}</h4>
                        <p className="text-sm text-primary-500">paused</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleResumeHabit(habit)}
                        className="p-2 rounded-lg bg-sage-50 text-sage-700 hover:bg-sage-100"
                      >
                        <PlayIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingHabit(habit)}
                        className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDeleteHabit(habit.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {habits.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-display text-primary-800 mb-4">start my first habit</h2>
            <p className="text-primary-600 mb-8">track my progress and build better habits</p>
            <button
              onClick={() => setShowNewHabitModal(true)}
              className="px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700"
            >
              create a habit
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {(showNewHabitModal || editingHabit) && (
          <NewHabitModal
            onClose={() => {
              setShowNewHabitModal(false);
              setEditingHabit(null);
            }}
            onConfirm={editingHabit ? 
              (updates) => {
                onUpdateHabit(editingHabit.id, updates);
                setEditingHabit(null);
              } : onAddHabit}
            existingHabit={editingHabit || undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Habits;

export { Habits }