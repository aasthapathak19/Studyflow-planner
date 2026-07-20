import { useState } from 'react';
import { useStudyStore, TimetableSlot } from '@/store/useStudyStore';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

const Timetable = () => {
  const { timetable, subjects, addTimetableSlot, updateTimetableSlot, deleteTimetableSlot } = useStudyStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [formData, setFormData] = useState({
    day: '',
    startTime: '',
    endTime: '',
    subjectId: '',
    title: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.day || !formData.startTime || !formData.endTime || !formData.subjectId || !formData.title) {
      toast.error('Please fill all fields');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    if (editingSlot) {
      updateTimetableSlot(editingSlot.id, formData);
      toast.success('Session updated successfully!');
    } else {
      addTimetableSlot(formData);
      toast.success('Session added successfully!');
    }

    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      day: '',
      startTime: '',
      endTime: '',
      subjectId: '',
      title: '',
    });
    setEditingSlot(null);
  };

  const handleEdit = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setFormData({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      subjectId: slot.subjectId,
      title: slot.title,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteTimetableSlot(id);
      toast.success('Session deleted successfully!');
    }
  };

  const getSlotForDayAndTime = (day: string, time: string) => {
    return timetable.find(
      (slot) =>
        slot.day === day &&
        slot.startTime <= time &&
        slot.endTime > time
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">Weekly Timetable</h1>
            <p className="text-muted-foreground">Schedule your study sessions</p>
          </div>
          <Button onClick={() => { resetForm(); setIsOpen(true); }} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Session
          </Button>
        </div>

        {/* Desktop View - Grid */}
        <div className="hidden lg:block overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-8 gap-2">
              <div className="font-semibold text-center p-2">Time</div>
              {DAYS.map((day) => (
                <div key={day} className="font-semibold text-center p-2 text-foreground">
                  {day.slice(0, 3)}
                </div>
              ))}

              {TIME_SLOTS.map((time) => (
                <>
                  <div key={`time-${time}`} className="text-sm text-muted-foreground p-2 text-center">
                    {time}
                  </div>
                  {DAYS.map((day) => {
                    const slot = getSlotForDayAndTime(day, time);
                    const subject = slot ? subjects.find((s) => s.id === slot.subjectId) : null;

                    return (
                      <div key={`${day}-${time}`} className="p-1">
                        {slot && slot.startTime === time ? (
                          <Card
                            className="p-3 cursor-pointer hover:shadow-lg transition-shadow group relative"
                            style={{
                              backgroundColor: subject?.color || '#ccc',
                              color: '#fff',
                              minHeight: '60px',
                            }}
                            onClick={() => handleEdit(slot)}
                          >
                            <div className="text-sm font-semibold">{slot.title}</div>
                            <div className="text-xs mt-1 opacity-90">
                              {slot.startTime} - {slot.endTime}
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 bg-black/20 hover:bg-black/40"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(slot.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </Card>
                        ) : slot ? null : (
                          <div className="h-full min-h-[60px] border-2 border-dashed border-border rounded opacity-0 hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View - List */}
        <div className="lg:hidden space-y-4">
          {DAYS.map((day) => {
            const daySessions = timetable.filter((slot) => slot.day === day);
            return (
              <Card key={day} className="p-4">
                <h3 className="font-bold text-lg mb-3 text-foreground">{day}</h3>
                {daySessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sessions scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {daySessions.map((slot) => {
                      const subject = subjects.find((s) => s.id === slot.subjectId);
                      return (
                        <div
                          key={slot.id}
                          className="p-3 rounded-lg flex justify-between items-center"
                          style={{
                            backgroundColor: subject?.color || '#ccc',
                            color: '#fff',
                          }}
                        >
                          <div>
                            <div className="font-semibold">{slot.title}</div>
                            <div className="text-sm opacity-90">
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-black/20 hover:bg-black/40"
                              onClick={() => handleEdit(slot)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-black/20 hover:bg-black/40"
                              onClick={() => handleDelete(slot.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSlot ? 'Edit Study Session' : 'Add Study Session'}
              </DialogTitle>
              <DialogDescription>
                Schedule a study session for your timetable
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Session Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Database Theory"
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
                <Label htmlFor="day">Day *</Label>
                <Select
                  value={formData.day}
                  onValueChange={(value) => setFormData({ ...formData, day: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
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
                  {editingSlot ? 'Update' : 'Add'} Session
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Timetable;
