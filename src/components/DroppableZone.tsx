import { useDrop } from "react-dnd";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Habit {
  id: string;
  status: 'todo' | 'completed';
}

interface DroppableZoneProps {
  title: string;
  status: 'todo' | 'completed';
  onDrop: (habitId: string, newStatus: 'todo' | 'completed') => void;
  children: React.ReactNode;
  emptyMessage?: string;
}

export const DroppableZone = ({ title, status, onDrop, children, emptyMessage }: DroppableZoneProps) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'habit',
    drop: (item: Habit) => {
      if (item.status !== status) {
        onDrop(item.id, status);
      }
    },
    canDrop: (item: Habit) => item.status !== status,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
    <div 
      ref={drop}
      className={`min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-all duration-300 ${
        isActive 
          ? 'border-primary bg-primary/10 shadow-glow' 
          : canDrop 
            ? 'border-primary/50 bg-primary/5' 
            : 'border-border/50 bg-background/50'
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {isActive && (
          <Plus className="w-5 h-5 text-primary animate-pulse" />
        )}
      </div>
      
      <div className="space-y-3">
        {children}
        {!children && emptyMessage && (
          <Card className="p-6 text-center bg-muted/20 border-dashed">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </Card>
        )}
      </div>
    </div>
  );
};