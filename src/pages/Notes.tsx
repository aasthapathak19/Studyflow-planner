import { useState } from 'react';
import { useStudyStore, Note } from '@/store/useStudyStore';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Pencil, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const Notes = () => {
  const { notes, subjects, addNote, updateNote, deleteNote } = useStudyStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subjectId: '',
  });

  const filteredNotes = filterSubject === 'all'
    ? notes
    : notes.filter((note) => note.subjectId === filterSubject);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a note title');
      return;
    }

    if (!formData.subjectId) {
      toast.error('Please select a subject');
      return;
    }

    if (editingNote) {
      updateNote(editingNote.id, formData);
      toast.success('Note updated successfully!');
    } else {
      addNote(formData);
      toast.success('Note created successfully!');
    }

    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      subjectId: '',
    });
    setEditingNote(null);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      subjectId: note.subjectId,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      toast.success('Note deleted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">My Notes</h1>
            <p className="text-muted-foreground">Keep track of important information</p>
          </div>
          <Button onClick={() => { resetForm(); setIsOpen(true); }} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Note
          </Button>
        </div>

        {/* Filter */}
        <div className="mb-6 max-w-xs">
          <Label className="text-sm mb-2 block">Filter by Subject</Label>
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger>
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">
              {notes.length === 0 ? 'No notes yet' : 'No notes match your filter'}
            </p>
            <Button onClick={() => setIsOpen(true)}>Create Your First Note</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => {
              const subject = subjects.find((s) => s.id === note.subjectId);
              return (
                <Card
                  key={note.id}
                  className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer group"
                  onClick={() => handleEdit(note)}
                >
                  <div className="flex justify-between items-start mb-4">
                    {subject && (
                      <Badge
                        className="text-white border-0"
                        style={{ backgroundColor: subject.color }}
                      >
                        {subject.name}
                      </Badge>
                    )}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(note);
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-card-foreground line-clamp-2">
                    {note.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-4 whitespace-pre-wrap">
                    {note.content || 'No content'}
                  </p>

                  <div className="text-xs text-muted-foreground pt-4 border-t border-border">
                    Updated {format(new Date(note.updatedAt), 'MMM dd, yyyy')}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? 'Edit Note' : 'Create New Note'}
              </DialogTitle>
              <DialogDescription>
                {editingNote ? 'Update your note' : 'Add a new note to your collection'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Note Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., SQL Joins Overview"
                  required
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your notes here..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingNote ? 'Update' : 'Create'} Note
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Notes;
