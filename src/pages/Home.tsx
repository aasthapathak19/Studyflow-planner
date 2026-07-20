import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Target, Calendar, Brain, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Home = () => {
  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Set Goals',
      description: 'Track your study goals and achieve them systematically',
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Weekly Planner',
      description: 'Organize your study schedule with our intuitive timetable',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Pomodoro Timer',
      description: 'Stay focused with built-in productivity timer',
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Smart Notes',
      description: 'Take and organize notes for each subject',
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: 'Task Management',
      description: 'Create, prioritize, and complete your tasks efficiently',
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Subject Organization',
      description: 'Keep all your subjects and materials organized',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-block animate-fade-in">
              <BookOpen className="h-16 w-16 text-white mx-auto mb-4" />
            </div>
            <h1 className="mb-6 text-4xl md:text-6xl font-bold text-white animate-fade-in">
              Plan Your Study.
              <br />
              Track Your Progress.
            </h1>
            <p className="mb-8 text-lg md:text-xl text-white/90 animate-fade-in">
              A complete study planner to help you organize subjects, manage tasks,
              and stay focused with built-in productivity tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/subjects">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  View Subjects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help students stay organized and productive
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Study Routine?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already achieving their academic goals
            with our study planner.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
              Start Planning Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 StudyPlanner. Built with React, TypeScript & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
