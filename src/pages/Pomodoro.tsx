import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Coffee, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const Pomodoro = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const focusTime = 25;
  const breakTime = 5;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    // Play completion sound
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    if (isBreak) {
      toast.success('Break complete! Time to focus again.');
      setIsBreak(false);
      setMinutes(focusTime);
      setSeconds(0);
    } else {
      setCompletedPomodoros(completedPomodoros + 1);
      toast.success('Focus session complete! Take a break.');
      setIsBreak(true);
      setMinutes(breakTime);
      setSeconds(0);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (isBreak) {
      setMinutes(breakTime);
    } else {
      setMinutes(focusTime);
    }
    setSeconds(0);
  };

  const switchMode = () => {
    setIsActive(false);
    setIsBreak(!isBreak);
    if (isBreak) {
      setMinutes(focusTime);
    } else {
      setMinutes(breakTime);
    }
    setSeconds(0);
  };

  const totalSeconds = isBreak ? breakTime * 60 : focusTime * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Pomodoro Timer</h1>
            <p className="text-muted-foreground">Stay focused with the Pomodoro Technique</p>
          </div>

          <Card className="p-8 mb-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                {isBreak ? (
                  <>
                    <Coffee className="h-5 w-5" />
                    <span className="font-semibold">Break Time</span>
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5" />
                    <span className="font-semibold">Focus Time</span>
                  </>
                )}
              </div>

              {/* Timer Display */}
              <div className="relative mb-8">
                <div className="text-8xl font-bold text-foreground mb-4 font-mono">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                
                {/* Circular Progress */}
                <div className="relative w-64 h-64 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 120}`}
                      strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                      className={isBreak ? 'text-accent' : 'text-primary'}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground">
                        {Math.round(progress)}%
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {isActive ? 'In Progress' : 'Paused'}
                      </div>
                    </div>
                  </div>
                </div>

                <Progress value={progress} className="h-2" />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4 mb-6">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className="gap-2 px-8"
                >
                  {isActive ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetTimer}
                  size="lg"
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  Reset
                </Button>
              </div>

              <Button
                onClick={switchMode}
                variant="ghost"
                className="text-muted-foreground"
              >
                Switch to {isBreak ? 'Focus' : 'Break'} Mode
              </Button>
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground">
              Today's Progress
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {completedPomodoros}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-1">
                  {completedPomodoros * focusTime}
                </div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success mb-1">
                  {Math.round((completedPomodoros * focusTime) / 60 * 10) / 10}
                </div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-6 mt-6 bg-muted/30">
            <h3 className="font-semibold mb-3 text-card-foreground">How it works:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">1.</span>
                <span>Work on a task for 25 minutes (one Pomodoro)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">2.</span>
                <span>Take a 5-minute break</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">3.</span>
                <span>Repeat the cycle to maintain focus and productivity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">4.</span>
                <span>After 4 Pomodoros, take a longer 15-30 minute break</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Hidden audio element for completion sound */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRAETW6/o7qpWFw1Hmtzy1HsqBSh+zPLaizsKGGS36+mnUBUMUpzh8r5qHwU2jdXzzn0pBS5+zPPVhDkHH3G+7+KYRAETXK/n76pWFw1Hmtzy1HsqBSh+zPLaizsKGGS36+mnUBUMUpzh8r5qHwU2jdXzzn0pBS5+zPPVhDkHH3G+7+KYRAETXK/n76pWFw1Hmtzy1HsqBSh+zPLaizsKGGS36+mnUBUMUpzh8r5qHwU2jdXzzn0pBS5+zPPVhDkHH3G+7+KYRAETXK/n76pWFw1Hmtzy1HsqBSh+zPLaizsKGGS36+mnUBUMUpzh8r5qHwU2jdXzzn0pBS5+zPPVhDkHH3G+7+KYRAETXK/n76pWFw1Hmtzy1HsqBSh+zPLaizsKGGS36+mnUBUMUpzh8r5qHwU2jdXzzn0pBS5+zPPVhDkHH3G+7+KYRAETXK/n76pWFw1Hmtzy1HsqBSh+zPLaizsKGGS36+mnUBUMUpzh8r5qHwU2jdXzzn0pBS5+zPPVhDkHH3G+7+KYRAETXK/n76pWFw1Hmtzy1HsqBSh+zPLaizsKGGS36+mnUBUMUpzh8r5qHwU2jdXzzn0pBS5+zPPVhDkHH3G+7+KYRA=="
      />
    </div>
  );
};

export default Pomodoro;
