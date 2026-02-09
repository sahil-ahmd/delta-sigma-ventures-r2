import { useEffect, useState } from "react";
import { logService } from "../services/logService";

export const useSecureEnvironment = (tolerance: number) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [violations, setViolations] = useState<number>(0);

  useEffect(() => {
    const isTestMode =
      new URLSearchParams(window.location.search).get("debug") === "true";

    // Handle Fullscreen Lcgic
    const handleFullscreen = () => {
        const isFull = !!document.fullscreenElement;
        setIsFullscreen(isFull);
      
        // ONLY count as a violation if the test has already successfully 
        // entered fullscreen at least once before.
        if (!isFull) { // Add an 'isStarted' check here
          setViolations((v) => {
            const newCount = v + 1;
            logService.capture("FULLSCREEN_EXITED", { violationCount: newCount });
            return newCount;
          });
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
      if (!isTestMode) {
        e.preventDefault();
        logService.capture(`PREVENTED_${e.type.toUpperCase()}` as any, {
          targetTag: (e.target as HTMLElement)?.tagName,
          timestamp: Date.now(),
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("visibilitychange", handleVisibility);

    if (!isTestMode) {
      document.addEventListener("copy", block);
      document.addEventListener("paste", block);
      document.addEventListener("contextmenu", block);
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("contextmenu", block);
    };
  }, []);

  const enterFullscreen = () => {
    const isTestMode = new URLSearchParams(window.location.search).get('debug') === 'true';
    if (isTestMode) return;

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
