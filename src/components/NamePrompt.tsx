import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NamePromptProps {
  onSubmit: (name: string) => void;
}

export function NamePrompt({ onSubmit }: NamePromptProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-md max-w-md w-full"
      >
        <h1 className="text-2xl font-display text-primary-800 mb-6 text-center">welcome to CityDay+</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-primary-600 mb-4 text-center">
              I, <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-b-2 border-sage-300 focus:border-sage-500 outline-none px-2 py-1 text-primary-700"
                placeholder="[type name here]"
                required
              />, am going to record my days and track my habits better with CityDay+
            </p>
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className={`w-full py-3 rounded-lg font-medium ${
              name.trim()
                ? 'bg-sage-600 text-white hover:bg-sage-700'
                : 'bg-sage-100 text-sage-400 cursor-not-allowed'
            }`}
          >
            let's begin
          </button>
        </form>
      </motion.div>
    </div>
  );
}