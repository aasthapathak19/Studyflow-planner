import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Subject {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  estimatedHours: number;
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: string;
}

export interface TimetableSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  title: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  username: string;
  theme: 'light' | 'dark';
}

interface StudyStore {
  subjects: Subject[];
  tasks: Task[];
  timetable: TimetableSlot[];
  notes: Note[];
  profile: UserProfile;
  
  // Subject actions
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Timetable actions
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  updateTimetableSlot: (id: string, slot: Partial<TimetableSlot>) => void;
  deleteTimetableSlot: (id: string) => void;
  
  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Profile actions
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStudyStore = create<StudyStore>()(
  persist(
    (set) => ({
      subjects: [
        {
          id: '1',
          name: 'Database Management',
          description: 'SQL, NoSQL, and database design principles',
          color: '#FF6B6B',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Web Development',
          description: 'React, TypeScript, and modern frontend frameworks',
          color: '#4ECDC4',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Data Structures',
          description: 'Arrays, trees, graphs, and algorithms',
          color: '#95E1D3',
          createdAt: new Date().toISOString(),
        },
      ],
      tasks: [
        {
          id: '1',
          title: 'Complete SQL assignment',
          description: 'Write complex queries for the database project',
          subjectId: '1',
          priority: 'high',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedHours: 3,
          status: 'in-progress',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Build React component library',
          description: 'Create reusable UI components with TypeScript',
          subjectId: '2',
          priority: 'medium',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedHours: 5,
          status: 'todo',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Study binary trees',
          description: 'Review traversal algorithms and implementations',
          subjectId: '3',
          priority: 'high',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedHours: 2,
          status: 'todo',
          createdAt: new Date().toISOString(),
        },
      ],
      timetable: [
        {
          id: '1',
          day: 'Monday',
          startTime: '09:00',
          endTime: '11:00',
          subjectId: '1',
          title: 'Database Theory',
        },
        {
          id: '2',
          day: 'Tuesday',
          startTime: '14:00',
          endTime: '16:00',
          subjectId: '2',
          title: 'Web Dev Workshop',
        },
        {
          id: '3',
          day: 'Wednesday',
          startTime: '10:00',
          endTime: '12:00',
          subjectId: '3',
          title: 'DSA Practice',
        },
      ],
      notes: [
        {
          id: '1',
          title: 'SQL Joins Overview',
          content: 'INNER JOIN returns matching rows from both tables...',
          subjectId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      profile: {
        username: 'Student',
        theme: 'light',
      },
      
      // Subject actions
      addSubject: (subject) =>
        set((state) => ({
          subjects: [
            ...state.subjects,
            { ...subject, id: generateId(), createdAt: new Date().toISOString() },
          ],
        })),
      updateSubject: (id, subject) =>
        set((state) => ({
          subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...subject } : s)),
        })),
      deleteSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
          tasks: state.tasks.filter((t) => t.subjectId !== id),
          timetable: state.timetable.filter((t) => t.subjectId !== id),
          notes: state.notes.filter((n) => n.subjectId !== id),
        })),
      
      // Task actions
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: generateId(), createdAt: new Date().toISOString() }],
        })),
      updateTask: (id, task) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      
      // Timetable actions
      addTimetableSlot: (slot) =>
        set((state) => ({
          timetable: [...state.timetable, { ...slot, id: generateId() }],
        })),
      updateTimetableSlot: (id, slot) =>
        set((state) => ({
          timetable: state.timetable.map((t) => (t.id === id ? { ...t, ...slot } : t)),
        })),
      deleteTimetableSlot: (id) =>
        set((state) => ({
          timetable: state.timetable.filter((t) => t.id !== id),
        })),
      
      // Note actions
      addNote: (note) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...note,
              id: generateId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateNote: (id, note) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...note, updatedAt: new Date().toISOString() } : n
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),
      
      // Profile actions
      updateProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),
    }),
    {
      name: 'study-planner-storage',
    }
  )
);
