import { useEffect, useState } from "react";
import { logService } from "../services/logService";

export const useSecureEnvironment = (tolerance: number) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [violations, setViolations] = useState<number>(0);

  useEffect(() => {
    // Handle Fullscreen Lcgic
    const handleFullscreen = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);

      if (!isFull) {
        setViolations((v) => v + 1);
        logService.capture("FULLSCREEN_EXITED", {
          currentViolationCount: violations + 1,
        });
      } else {
        logService.capture("FULLSCREEN_ENTERED");
      }
    };

    // Handle Tab/Focus Changes (New)
    const handleVisibility = () => {
      if (document.hidden) {
        setViolations((v) => {
          const newCount = v + 1;
          logService.capture("TAB_SWITCH_DETECTED", {
            state: "hidden",
            violationCount: newCount,
          });
          return newCount;
        });
      } else {
        logService.capture("TAB_REGAINED", { state: "visible" });
      }
    };

    // Prevent copy/paste/context with metadata
    const block = (e: Event) => {
      e.preventDefault();
      logService.capture(`PREVENTED_${e.type.toUpperCase()}` as any, {
        targetTag: (e.target as HTMLElement)?.tagName,
        timestamp: Date.now(),
      });
    };

    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("copy", block);
    document.addEventListener("paste", block);
    document.addEventListener("contextmenu", block);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("contextmenu", block);
    };
  }, []);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen().catch(() => {
      alert("Permission denied or browser blocked fullscreen.");
    });
  };

  return {
    isFullscreen,
    violations,
    enterFullscreen,
    isExceeded: violations >= tolerance,
  };
};
