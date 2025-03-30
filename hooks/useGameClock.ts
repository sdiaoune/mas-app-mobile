import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export const useGameClock = () => {
  const { clock, isRunning, updateClock } = useGameStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const [minutes, seconds] = clock.split(':').map(Number);
        let newSeconds = seconds - 1;
        let newMinutes = minutes;

        if (newSeconds < 0) {
          if (newMinutes > 0) {
            newMinutes--;
            newSeconds = 59;
          } else {
            // Time's up
            clearInterval(intervalRef.current!);
            updateClock('00:00');
            return;
          }
        }

        updateClock(
          `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, clock]);

  return {
    currentTime: clock,
    isRunning,
  };
}; 