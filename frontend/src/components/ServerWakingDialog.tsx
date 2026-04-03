import { useEffect, useRef, useState } from 'react';
import { useServerStore } from '../stores/serverStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const HEALTH_URL = `${API_BASE}/health`;
const POLL_INTERVAL = 5000;

export default function ServerWakingDialog() {
  const { isServerDown, setServerDown } = useServerStore();
  const [dots, setDots] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotsRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isServerDown) return;

    // Animated dots
    dotsRef.current = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);

    // Poll health endpoint
    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(HEALTH_URL, { cache: 'no-store' });
        if (res.ok) {
          setServerDown(false);
        }
      } catch {
        // still down
      }
    }, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (dotsRef.current) clearInterval(dotsRef.current);
    };
  }, [isServerDown, setServerDown]);

  if (!isServerDown) return null;

  // Strip trailing /api to get the base render.com URL
  const iframeSrc = API_BASE.replace(/\/api$/, '');

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-white">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 px-6 py-5 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛒</span>
          <h1 className="text-lg font-semibold text-gray-800">Server is waking up{dots}</h1>
        </div>
        <p className="text-sm text-gray-500 text-center">
          The server spun down due to inactivity. It should be ready in about 30–60 seconds.
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
          <span className="text-xs text-amber-600 font-medium">Checking every 5 seconds{dots}</span>
        </div>
      </div>

      {/* Iframe showing render.com wake page */}
      <iframe
        src={iframeSrc}
        title="Server status"
        className="flex-1 w-full border-none"
      />
    </div>
  );
}
