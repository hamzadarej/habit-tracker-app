import { useState, useEffect } from "react";

interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  streak: number;
  completedToday: boolean;
  completedDates: string[];
  lastCompletedDate?: string;
  targetDays?: number;
  startDate?: string;
  endDate?: string;
  status: 'todo' | 'completed';
}

const STORAGE_KEY = "habit-tracker-data";

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habits from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if any habits need their "completedToday" status reset
        const today = new Date().toISOString().split('T')[0];
        const updated = parsed.map((habit: Habit) => ({
          ...habit,
          completedToday: habit.lastCompletedDate === today,
        }));
        setHabits(updated);
      }
    } catch (error) {
      console.error("Failed to load habits from localStorage:", error);
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error("Failed to save habits to localStorage:", error);
    }
  }, [habits]);

  const addHabit = (habitData: { 
    name: string; 
    description: string; 
    color: string; 
    targetDays?: number; 
    startDate?: string; 
    endDate?: string; 
  }) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: habitData.name,
      description: habitData.description,
      color: habitData.color,
      streak: 0,
      completedToday: false,
      completedDates: [],
      targetDays: habitData.targetDays,
      startDate: habitData.startDate,
      endDate: habitData.endDate,
      status: 'todo',
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleHabitComplete = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;

      const wasCompletedToday = habit.completedToday;
      const newCompletedToday = !wasCompletedToday;

      let newCompletedDates = [...habit.completedDates];
      let newStreak = habit.streak;

      if (newCompletedToday) {
        // Mark as completed
        if (!newCompletedDates.includes(today)) {
          newCompletedDates.push(today);
          newStreak = calculateStreak([...newCompletedDates, today]);
        }
      } else {
        // Mark as incomplete
        newCompletedDates = newCompletedDates.filter(date => date !== today);
        newStreak = calculateStreak(newCompletedDates);
      }

      return {
        ...habit,
        completedToday: newCompletedToday,
        completedDates: newCompletedDates,
        streak: newStreak,
        lastCompletedDate: newCompletedToday ? today : habit.lastCompletedDate,
        status: newCompletedToday ? 'completed' : 'todo',
      };
    }));
  };

  const moveHabit = (habitId: string, newStatus: 'todo' | 'completed') => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const today = new Date().toISOString().split('T')[0];
      let newCompletedDates = [...habit.completedDates];
      let newStreak = habit.streak;
      const isCompletingToday = newStatus === 'completed';

      if (isCompletingToday && !newCompletedDates.includes(today)) {
        newCompletedDates.push(today);
        newStreak = calculateStreak(newCompletedDates);
      } else if (!isCompletingToday && newCompletedDates.includes(today)) {
        newCompletedDates = newCompletedDates.filter(date => date !== today);
        newStreak = calculateStreak(newCompletedDates);
      }

      return {
        ...habit,
        status: newStatus,
        completedToday: isCompletingToday,
        completedDates: newCompletedDates,
        streak: newStreak,
        lastCompletedDate: isCompletingToday ? today : habit.lastCompletedDate,
      };
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  return {
    habits,
    addHabit,
    toggleHabitComplete,
    moveHabit,
    deleteHabit,
  };
};

// Helper function to calculate current streak
const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;

  const sortedDates = completedDates.sort().reverse(); // Most recent first
  const today = new Date().toISOString().split('T')[0];
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const dateStr of sortedDates) {
    const completedDate = currentDate.toISOString().split('T')[0];
    
    if (sortedDates.includes(completedDate)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};