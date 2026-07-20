import { useState } from 'react';
import { useStudyStore } from '@/store/useStudyStore';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { profile, updateProfile, subjects, tasks, notes } = useStudyStore();
  const [username, setUsername] = useState(profile.username);

  const handleSaveUsername = () => {
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }
    updateProfile({ username: username.trim() });
    toast.success('Username updated successfully!');
  };

  const toggleTheme = () => {
    const newTheme = profile.theme === 'light' ? 'dark' : 'light';
    updateProfile({ theme: newTheme });
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast.success(`Switched to ${newTheme} mode`);
  };

  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const totalStudyHours = tasks
    .filter((task) => task.status === 'completed')
    .reduce((acc, task) => acc + task.estimatedHours, 0);

  const stats = [
    { label: 'Total Subjects', value: subjects.length },
    { label: 'Total Tasks', value: tasks.length },
    { label: 'Completed Tasks', value: completedTasks },
    { label: 'Total Notes', value: notes.length },
    { label: 'Study Hours', value: totalStudyHours },
    { label: 'Completion Rate', value: tasks.length > 0 ? `${Math.round((completedTasks / tasks.length) * 100)}%` : '0%' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="p-6 lg:col-span-1">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-1 text-card-foreground">
                  {profile.username}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Student Account</p>
                <div className="text-sm text-muted-foreground">
                  Member since 2024
                </div>
              </div>
            </Card>

            {/* Settings Card */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-xl font-semibold mb-6 text-card-foreground">
                Account Settings
              </h3>

              <div className="space-y-6">
                {/* Username */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="flex gap-3 mt-2">
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                    <Button onClick={handleSaveUsername}>Save</Button>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div>
                  <Label>Appearance</Label>
                  <div className="flex items-center justify-between mt-2 p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      {profile.theme === 'light' ? (
                        <Sun className="h-5 w-5 text-warning" />
                      ) : (
                        <Moon className="h-5 w-5 text-primary" />
                      )}
                      <div>
                        <div className="font-medium text-card-foreground">
                          {profile.theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Current theme setting
                        </div>
                      </div>
                    </div>
                    <Button onClick={toggleTheme} variant="outline">
                      Switch to {profile.theme === 'light' ? 'Dark' : 'Light'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Statistics */}
          <Card className="p-6 mt-6">
            <h3 className="text-xl font-semibold mb-6 text-card-foreground">
              Your Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* App Info */}
          <Card className="p-6 mt-6 bg-muted/30">
            <h3 className="text-lg font-semibold mb-3 text-card-foreground">
              About StudyPlanner
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              A complete study management system built with React, TypeScript, and Tailwind CSS.
              All your data is stored locally in your browser.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                React 18
              </span>
              <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                TypeScript
              </span>
              <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                Tailwind CSS
              </span>
              <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                Zustand
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
