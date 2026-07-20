import { Subject } from '@/store/useStudyStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
}

const SubjectCard = ({ subject, onEdit, onDelete }: SubjectCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 animate-fade-in"
      style={{ borderLeftColor: subject.color }}>
      <div className="flex justify-between items-start mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: subject.color }}
        >
          {subject.name.charAt(0)}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(subject)}
            className="h-8 w-8 text-muted-foreground hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(subject.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-card-foreground">
        {subject.name}
      </h3>
      <p className="text-sm text-muted-foreground">
        {subject.description}
      </p>
    </Card>
  );
};

export default SubjectCard;
