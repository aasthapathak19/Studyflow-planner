import { Link } from 'react-router-dom';
import { Menu, Moon, Sun, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudyStore } from '@/store/useStudyStore';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const Navbar = () => {
  const { profile, updateProfile } = useStudyStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.theme]);

  const toggleTheme = () => {
    const newTheme = profile.theme === 'light' ? 'dark' : 'light';
    updateProfile({ theme: newTheme });
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) return null;

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link to="/dashboard" onClick={onClick}>
        <Button variant="ghost" className="text-foreground hover:text-primary">
          Dashboard
        </Button>
      </Link>
      <Link to="/subjects" onClick={onClick}>
        <Button variant="ghost" className="text-foreground hover:text-primary">
          Subjects
        </Button>
      </Link>
      <Link to="/tasks" onClick={onClick}>
        <Button variant="ghost" className="text-foreground hover:text-primary">
          Tasks
        </Button>
      </Link>
      <Link to="/timetable" onClick={onClick}>
        <Button variant="ghost" className="text-foreground hover:text-primary">
          Timetable
        </Button>
      </Link>
      <Link to="/pomodoro" onClick={onClick}>
        <Button variant="ghost" className="text-foreground hover:text-primary">
          Timer
        </Button>
      </Link>
      <Link to="/notes" onClick={onClick}>
        <Button variant="ghost" className="text-foreground hover:text-primary">
          Notes
        </Button>
      </Link>
      <Link to="/profile" onClick={onClick}>
        <Button variant="ghost" className="text-foreground hover:text-primary">
          Profile
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              StudyPlanner
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLinks />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-foreground"
            >
              {profile.theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px]">
                <div className="flex flex-col space-y-3 mt-8">
                  <NavLinks onClick={() => {}} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
