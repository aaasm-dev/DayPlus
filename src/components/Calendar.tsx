import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { JournalEntry, Habit, moodColors, emotionColors } from '../types';
import { format, isToday, getYear, getMonth, getDaysInMonth, isFuture, startOfDay } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface EmotionCalendarProps {
  entries: JournalEntry[];
  habits: Habit[];
  onDayClick: (date: Date) => void;
}

interface MonthYearPickerProps {
  date: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

function MonthYearPicker({ date, onSelect, onClose }: MonthYearPickerProps) {
  const [selectedYear, setSelectedYear] = useState(getYear(date));
  const [selectedMonth, setSelectedMonth] = useState(getMonth(date));
  const [selectedDay, setSelectedDay] = useState(date.getDate());

  const minDate = new Date(2024, 0, 1); // January 1, 2024
  const maxDate = startOfDay(new Date());

  const years = Array.from(
    { length: maxDate.getFullYear() - 2023 },
    (_, i) => 2024 + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i);
  const days = Array.from(
    { length: getDaysInMonth(new Date(selectedYear, selectedMonth)) },
    (_, i) => i + 1
  );

  const handleSelect = () => {
    const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
    if (selectedDate >= minDate && selectedDate <= maxDate) {
      onSelect(selectedDate);
      onClose();
    }
  };

  const formatMonth = (month: number) => {
    return format(new Date(2000, month), 'MMM').toLowerCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 bg-white rounded-xl p-6 z-10 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-display text-primary-800 mb-6">
        time travel
      </h2>

      <div className="flex justify-between gap-2 h-48">
        <div className="flex-1 overflow-y-scroll scrollbar-hide rounded-lg bg-primary-50">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`w-full p-4 text-sm font-medium ${
                selectedYear === year
                  ? 'bg-sage-100 text-sage-700'
                  : 'hover:bg-sage-50 text-primary-600'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-scroll scrollbar-hide rounded-lg bg-primary-50">
          {months.map(month => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`w-full p-4 text-sm font-medium ${
                selectedMonth === month
                  ? 'bg-sage-100 text-sage-700'
                  : 'hover:bg-sage-50 text-primary-600'
              }`}
            >
              {formatMonth(month)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-scroll scrollbar-hide rounded-lg bg-primary-50">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`w-full p-4 text-sm font-medium ${
                selectedDay === day
                  ? 'bg-sage-100 text-sage-700'
                  : 'hover:bg-sage-50 text-primary-600'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSelect}
        className="w-full bg-sage-600 text-white py-3 rounded-lg hover:bg-sage-700 font-medium mt-6"
      >
        go
      </button>
    </motion.div>
  );
}

export function EmotionCalendar({ entries, habits, onDayClick }: EmotionCalendarProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const minDate = new Date(2024, 0, 1); // January 1, 2024
  const maxDate = startOfDay(new Date());

  const getTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = entries.find(e => e.date === dateStr);
    const dayHabits = habits.filter(h => h.lastChecked === dateStr);
    
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        {entry?.mood && (
          <div 
            className={`absolute inset-0 ${moodColors[entry.mood].bg} opacity-20 rounded-full w-8 h-8 m-auto`}
          />
        )}
        <span className="relative z-10">{date.getDate()}</span>
        {dayHabits.length > 0 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            {dayHabits.map((habit, index) => (
              <span 
                key={habit.id}
                className="w-1 h-1 bg-sage-600 rounded-full"
                style={{ opacity: 0.8 - (index * 0.2) }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const navigationLabel = ({ date }: { date: Date }) => (
    <div
      onClick={() => setShowPicker(true)}
      className="text-sm font-medium text-primary-800 hover:text-primary-900 transition-colors cursor-pointer"
    >
      {format(date, 'MMMM yyyy').toLowerCase()}
    </div>
  );

  const handleDateChange = (value: Date) => {
    if (value >= minDate && value <= maxDate) {
      setCurrentDate(value);
      setSelectedDate(value);
      onDayClick(value);
    }
  };

  const getDayEntries = () => {
    if (!selectedDate) return [];
    return entries.filter(
      (entry) => entry.date === format(selectedDate, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display text-primary-800">
        time travel
      </h2>

      <div className="bg-white rounded-xl shadow-md p-6 relative">
        <Calendar
          onChange={handleDateChange}
          value={currentDate}
          className="w-full"
          locale="en-US"
          view="month"
          minDetail="year"
          maxDetail="month"
          minDate={minDate}
          maxDate={maxDate}
          tileContent={getTileContent}
          navigationLabel={navigationLabel}
          prevLabel={<ChevronLeftIcon className="w-5 h-5" />}
          nextLabel={<ChevronRightIcon className="w-5 h-5" />}
          tileClassName={({ date }) => `
            relative text-primary-800 hover:bg-transparent
            transition-colors duration-200 ease-in-out
            font-sans h-12
            ${isToday(date) ? 'font-bold' : 'font-normal'}
          `}
        />

        <AnimatePresence>
          {showPicker && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-25 z-10"
              onClick={() => setShowPicker(false)}
            >
              <MonthYearPicker
                date={currentDate}
                onSelect={handleDateChange}
                onClose={() => setShowPicker(false)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      {selectedDate && (
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6 border border-sage-100">
          <h2 className="text-xl font-display text-primary-800 mb-4">
            my soul pieces
          </h2>
          {getDayEntries().map((entry) => (
            <div key={entry.id} className="mb-4 p-4 border border-sage-100 rounded-xl">
              <p className="text-primary-600 mb-2">{entry.content}</p>
              {entry.emotionScores && (
                <div className="flex flex-wrap gap-2">
                  {entry.emotionScores.map(({ emotion }) => (
                    <span
                      key={emotion}
                      className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${emotionColors[emotion]}`}
                    >
                      {emotion.toLowerCase()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {getDayEntries().length === 0 && (
            <p className="text-primary-500 text-center py-4">no entries for this day</p>
          )}
        </div>
      )}
    </div>
  );
}