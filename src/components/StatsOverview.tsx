import { TrendingUp, Target, Calendar, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  streak: number;
  completedToday: boolean;
  completedDates: string[];
}

interface StatsOverviewProps {
  habits: Habit[];
}

export const StatsOverview = ({ habits }: StatsOverviewProps) => {
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);
  const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);

  const stats = [
    {
      label: "Today's Progress",
      value: `${completedToday}/${totalHabits}`,
      subtext: `${completionRate}% complete`,
      icon: Target,
      color: "text-primary",
    },
    {
      label: "Longest Streak",
      value: longestStreak,
      subtext: longestStreak === 1 ? "day" : "days",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      label: "Total Habits",
      value: totalHabits,
      subtext: "being tracked",
      icon: Calendar,
      color: "text-info",
    },
    {
      label: "All Time",
      value: totalCompletions,
      subtext: "completions",
      icon: Award,
      color: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 bg-gradient-card border-border/50 shadow-soft">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-background/50`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.subtext}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
};