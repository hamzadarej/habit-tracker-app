import { Check, Flame, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  streak: number;
  completedToday: boolean;
  completedDates: string[];
}

interface HabitCardProps {
  habit: Habit;
  onToggleComplete: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
}

export const HabitCard = ({ habit, onToggleComplete, onDelete }: HabitCardProps) => {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-yellow-400";
    if (streak >= 7) return "text-orange-400";
    if (streak >= 3) return "text-info";
    return "text-muted-foreground";
  };

  return (
    <Card className="p-4 bg-gradient-card border-border/50 shadow-soft hover:shadow-glow transition-all duration-300 animate-slide-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: habit.color }}
          />
          <div>
            <h3 className="font-semibold text-foreground">{habit.name}</h3>
            {habit.description && (
              <p className="text-sm text-muted-foreground">{habit.description}</p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant={habit.completedToday ? "default" : "outline"}
          className={`${
            habit.completedToday 
              ? "bg-success hover:bg-success/90 animate-habit-complete" 
              : "hover:bg-success/20"
          } transition-all duration-200`}
          onClick={() => onToggleComplete(habit.id)}
        >
          <Check className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Flame className={`w-4 h-4 ${getStreakColor(habit.streak)}`} />
            <span className={`text-sm font-medium ${getStreakColor(habit.streak)}`}>
              {habit.streak} day{habit.streak !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {habit.completedDates.length} total
            </span>
          </div>
        </div>
        
        {habit.completedToday && (
          <Badge variant="secondary" className="bg-success/20 text-success">
            Completed
          </Badge>
        )}
      </div>
    </Card>
  );
};