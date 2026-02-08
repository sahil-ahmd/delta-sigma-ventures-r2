import { useEffect, useState } from 'react';
import { logService } from '../services/logService';

export const useSecureEnvironment = (tolerance: number) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [violations, setViolations] = useState<number>(0);

  useEffect(() => {
    const handleFullscreen = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      
      if (!isFull) {
        setViolations(v => v + 1);
        logService.capture('FULLSCREEN_EXITED', { currentViolationCount: violations + 1 });
      } else {
        logService.capture('FULLSCREEN_ENTERED');
      }
    };

    const block = (e: Event) => {
      e.preventDefault();
      logService.capture(`PREVENTED_${e.type.toUpperCase()}` as any);
    };

    document.addEventListener('fullscreenchange', handleFullscreen);
    document.addEventListener('copy', block);
    document.addEventListener('paste', block);
    document.addEventListener('contextmenu', block);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreen);
      document.removeEventListener('copy', block);
      document.removeEventListener('paste', block);
      document.removeEventListener('contextmenu', block);
    };
  }, [violations]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen().catch(() => {
      alert("Permission denied or browser blocked fullscreen.");
    });
  };

  return { isFullscreen, violations, enterFullscreen, isExceeded: violations >= tolerance };
};