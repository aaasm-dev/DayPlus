import React from 'react';
import { Tab } from '@headlessui/react';
import { 
  HomeIcon,
  ChartBarIcon,
  CalendarIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

interface NavigationProps {
  selectedIndex: number;
  onChange: (index: number) => void;
}

export function Navigation({ selectedIndex, onChange }: NavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl border-t border-sage-100">
      <Tab.Group selectedIndex={selectedIndex} onChange={onChange}>
        <Tab.List className="flex p-2 space-x-1">
          <Tab className={({ selected }) => `
            w-full py-3 px-4 rounded-lg flex items-center justify-center
            ${selected 
              ? 'bg-sage-50 text-sage-700' 
              : 'text-sage-400 hover:bg-sage-50 hover:text-sage-600'
            }
          `}>
            <HomeIcon className="w-5 h-5" />
          </Tab>
          <Tab className={({ selected }) => `
            w-full py-3 px-4 rounded-lg flex items-center justify-center
            ${selected 
              ? 'bg-sage-50 text-sage-700' 
              : 'text-sage-400 hover:bg-sage-50 hover:text-sage-600'
            }
          `}>
            <ChartBarIcon className="w-5 h-5" />
          </Tab>
          <Tab className={({ selected }) => `
            w-full py-3 px-4 rounded-lg flex items-center justify-center
            ${selected 
              ? 'bg-sage-50 text-sage-700' 
              : 'text-sage-400 hover:bg-sage-50 hover:text-sage-600'
            }
          `}>
            <BookOpenIcon className="w-5 h-5" />
          </Tab>
          <Tab className={({ selected }) => `
            w-full py-3 px-4 rounded-lg flex items-center justify-center
            ${selected 
              ? 'bg-sage-50 text-sage-700' 
              : 'text-sage-400 hover:bg-sage-50 hover:text-sage-600'
            }
          `}>
            <CalendarIcon className="w-5 h-5" />
          </Tab>
        </Tab.List>
      </Tab.Group>
    </div>
  );
}