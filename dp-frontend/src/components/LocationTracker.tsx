import { useEffect } from 'react';
import { useLocationStore } from '../stores/locationStore';
import { useLocationTracking, useUpdateLocation } from '../hooks/useLocationTracking';

export default function LocationTracker() {
  const { currentLocation, isTracking, error } = useLocationStore();
  const updateLocation = useUpdateLocation();

  // Start tracking on component mount
  useLocationTracking();

  // Send location to backend whenever it changes
  useEffect(() => {
    if (currentLocation && !updateLocation.isPending) {
      updateLocation.mutate(currentLocation);
    }
  }, [currentLocation]);

  if (!isTracking) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-sm font-semibold text-yellow-700">📍 Location tracking not active</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <p className="text-sm font-semibold text-red-700">❌ {error}</p>
      </div>
    );
  }

  if (!currentLocation) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <p className="text-sm font-semibold text-blue-700">📍 Getting your location...</p>
      </div>
    );
  }

  const accuracy = currentLocation.accuracy?.toFixed(0) || 'N/A';
  const speed = currentLocation.speed ? (currentLocation.speed * 3.6).toFixed(1) : '0'; // Convert m/s to km/h
  const timeAgo = Math.floor((Date.now() - currentLocation.timestamp) / 1000);

  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-green-700">📍 Location Active</p>
          <div className="mt-2 space-y-1 text-xs text-green-600">
            <p>
              <span className="font-mono">
                {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </span>
            </p>
            <p>Accuracy: ±{accuracy}m | Speed: {speed} km/h</p>
            <p>Updated {timeAgo}s ago</p>
          </div>
        </div>
        {updateLocation.isPending && <span className="animate-spin">⏳</span>}
      </div>
    </div>
  );
}
