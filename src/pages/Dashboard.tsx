import { useStudyStore } from '@/store/useStudyStore';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { format, isToday, isFuture, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { tasks, subjects } = useStudyStore();

  const todayTasks = tasks.filter((task) => 
    task.status !== 'completed' && isToday(parseISO(task.dueDate))
  );

  const upcomingTasks = tasks.filter((task) => 
    task.status !== 'completed' && 
    isFuture(parseISO(task.dueDate)) && 
    !isToday(parseISO(task.dueDate))
  ).slice(0, 5);

  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  
  const totalStudyHours = tasks
    .filter((task) => task.status === 'completed')
    .reduce((acc, task) => acc + task.estimatedHours, 0);

  const stats = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      label: 'Active Subjects',
      value: subjects.length,
      color: 'text-primary',
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      label: 'Tasks Completed',
      value: completedTasks,
      color: 'text-success',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      label: 'Study Hours',
      value: totalStudyHours,
      color: 'text-accent',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      label: 'Tasks Pending',
      value: tasks.length - completedTasks,
      color: 'text-warning',
    },
  ];

  const getSubject = (subjectId: string) => {
    return subjects.find((s) => s.id === subjectId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            Welcome Back! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what you need to focus on today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color}`}>{stat.icon}</div>
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Tasks */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-card-foreground">Today's Tasks</h2>
              <Badge className="bg-primary text-primary-foreground">
                {todayTasks.length}
              </Badge>
            </div>
            
            {todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tasks due today</p>
                <Link to="/tasks">
                  <Button>Add New Task</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {todayTasks.map((task) => {
                  const subject = getSubject(task.subjectId);
                  return (
                    <div
                      key={task.id}
                      className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-card-foreground">{task.title}</h3>
                        {subject && (
                          <Badge
                            className="text-white border-0 ml-2"
                            style={{ backgroundColor: subject.color }}
                          >
                            {subject.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.estimatedHours}h
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Upcoming Tasks */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-card-foreground">Upcoming Tasks</h2>
              <Badge variant="outline">{upcomingTasks.length}</Badge>
            </div>
            
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No upcoming tasks</p>
                <Link to="/tasks">
                  <Button variant="outline">View All Tasks</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTasks.map((task) => {
                  const subject = getSubject(task.subjectId);
                  return (
                    <div
                      key={task.id}
                      className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-card-foreground">{task.title}</h3>
                        {subject && (
                          <Badge
                            className="text-white border-0 ml-2"
                            style={{ backgroundColor: subject.color }}
                          >
                            {subject.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Due: {format(parseISO(task.dueDate), 'MMM dd, yyyy')}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.estimatedHours}h
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
