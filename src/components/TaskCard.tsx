import { Task, useStudyStore } from '@/store/useStudyStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) => {
  const { subjects } = useStudyStore();
  const subject = subjects.find((s) => s.id === task.subjectId);

  const priorityColors = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-warning/20 text-warning-foreground border-warning',
    high: 'bg-destructive/20 text-destructive-foreground border-destructive',
  };

  const statusColors = {
    'todo': 'text-muted-foreground',
    'in-progress': 'text-warning',
    'completed': 'text-success',
  };

  return (
    <Card className={`p-5 hover:shadow-lg transition-all duration-300 animate-fade-in ${
      task.status === 'completed' ? 'opacity-75' : ''
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onToggleStatus(task.id)}
            className={`mt-1 transition-colors ${statusColors[task.status]}`}
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-1 ${
              task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-card-foreground'
            }`}>
              {task.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
            <div className="flex flex-wrap gap-2">
              {subject && (
                <Badge
                  className="text-white border-0"
                  style={{ backgroundColor: subject.color }}
                >
                  {subject.name}
                </Badge>
              )}
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {task.estimatedHours}h
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="h-8 w-8 text-muted-foreground hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
        <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
      </div>
    </Card>
  );
};

export default TaskCard;
