import { CheckCircle2, Plus, TrendingUp, MoveRight } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableHabitCard } from "@/components/DraggableHabitCard";
import { DroppableZone } from "@/components/DroppableZone";
import { AddHabitModal } from "@/components/AddHabitModal";
import { StatsOverview } from "@/components/StatsOverview";
import { useHabits } from "@/hooks/useHabits";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { habits, addHabit, toggleHabitComplete, moveHabit, deleteHabit } = useHabits();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const todoHabits = habits.filter(h => h.status === 'todo');
  const completedHabits = habits.filter(h => h.status === 'completed');

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-primary">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">HabitFlow</h1>
                <p className="text-white/80">{today}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-white">
                  <div className="text-2xl font-bold">
                    {habits.filter(h => h.completedToday).length}/{habits.length}
                  </div>
                  <div className="text-sm text-white/80">Today's Progress</div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Stats Overview */}
          <StatsOverview habits={habits} />

          {/* Habits Section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">My Habits</h2>
            <AddHabitModal onAddHabit={addHabit} />
          </div>

          {/* Drag & Drop Instructions */}
          {habits.length > 0 && (
            <div className="mb-6 p-4 bg-info/10 border border-info/20 rounded-lg">
              <div className="flex items-center gap-2 text-info">
                <MoveRight className="w-4 h-4" />
                <p className="text-sm">
                  Drag habits between columns to mark as complete or move back to todo
                </p>
              </div>
            </div>
          )}

          {/* Habits Board */}
          {habits.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Todo Column */}
              <DroppableZone
                title={`To Do (${todoHabits.length})`}
                status="todo"
                onDrop={moveHabit}
                emptyMessage="No habits in progress. Drag completed habits here or add new ones!"
              >
                {todoHabits.map((habit) => (
                  <DraggableHabitCard
                    key={habit.id}
                    habit={habit}
                    onToggleComplete={toggleHabitComplete}
                    onDelete={deleteHabit}
                  />
                ))}
              </DroppableZone>

              {/* Completed Column */}
              <DroppableZone
                title={`Completed Today (${completedHabits.length})`}
                status="completed"
                onDrop={moveHabit}
                emptyMessage="No habits completed today. Drag habits here to mark as done!"
              >
                {completedHabits.map((habit) => (
                  <DraggableHabitCard
                    key={habit.id}
                    habit={habit}
                    onToggleComplete={toggleHabitComplete}
                    onDelete={deleteHabit}
                  />
                ))}
              </DroppableZone>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No habits yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start building better habits today. Add your first habit to begin tracking your progress.
                </p>
                <AddHabitModal onAddHabit={addHabit} />
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {habits.length > 0 && (
            <div className="mt-12 p-6 bg-gradient-card rounded-lg border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    todoHabits.forEach(habit => {
                      moveHabit(habit.id, 'completed');
                    });
                  }}
                  disabled={todoHabits.length === 0}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete All Todo
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    completedHabits.forEach(habit => {
                      moveHabit(habit.id, 'todo');
                    });
                  }}
                  disabled={completedHabits.length === 0}
                >
                  <MoveRight className="w-4 h-4 mr-2" />
                  Move All to Todo
                </Button>
                {/*<Button variant="outline" size="sm">*/}
                {/*  <Plus className="w-4 h-4 mr-2" />*/}
                {/*  Export Data*/}
                {/*</Button>*/}
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default Index;
