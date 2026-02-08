import React, { useEffect, useRef, useState } from "react";

export const ProctorCamera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
    setupCamera();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 w-48 h-36 bg-black rounded-lg border-2 border-blue-500 shadow-2xl overflow-hidden z-50">
      {!hasPermission ? (
        <div className="flex items-center justify-center h-full text-[10px] text-white text-center p-2">
          Waiting for camera...
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover mirror"
        />
      )}
      <div className="absolute top-2 left-2 flex items-center gap-1">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
        <span className="text-[10px] text-white font-bold bg-black/40 px-1 rounded">
          REC
        </span>
      </div>
    </div>
  );
};
