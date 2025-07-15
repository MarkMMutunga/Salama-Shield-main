// src/components/map/MapComponent.tsx
/**
 * Salama Shield - Personal Safety Application
 * 
 * @author Mark Mikile Mutunga
 * @email markmiki03@gmail.com
 * @phone +254 707 678 643
 * @copyright © 2025 Mark Mikile Mutunga. All rights reserved.
 * 
 * This file contains the Google Maps integration component for displaying
 * safe zones and police stations. Unauthorized copying or distribution
 * of this file is strictly prohibited.
 */
"use client";

import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { useAppContext } from '@/contexts/AppContext';
import { Loader2 } from 'lucide-react';

interface SafeSpace {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  type: 'police' | 'safe_space';
}

// Sample data - replace with actual data source
const sampleSafeSpaces: SafeSpace[] = [
  { id: 'ps1', name: 'Central Police Station', position: { lat: -1.286389, lng: 36.817223 }, type: 'police' },
  { id: 'ps2', name: 'Kilimani Police Station', position: { lat: -1.2921, lng: 36.7985 }, type: 'police' },
  { id: 'ss1', name: 'Hope Shelter', position: { lat: -1.2833, lng: 36.8167 }, type: 'safe_space' },
  { id: 'ss2', name: 'Serene Haven', position: { lat: -1.3000, lng: 36.8000 }, type: 'safe_space' },
];

const MapComponent: React.FC = () => {
  const { currentLocation } = useAppContext();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<SafeSpace | null>(null);
  
  const [mapCenter, setMapCenter] = useState({ lat: -1.292066, lng: 36.821945 }); // Default to Nairobi
  const [zoomLevel, setZoomLevel] = useState(12);

  useEffect(() => {
    // In a real app, the API key would be fetched securely or set via environment variables
    // For this example, we simulate fetching it or assume it's set.
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (key) {
      setApiKey(key);
    } else {
      console.warn("Google Maps API key is not set. Map functionality will be limited.");
      // Provide a fallback or instructions if the key isn't available.
    }
  }, []);
  
  useEffect(() => {
    if (currentLocation) {
      setMapCenter({ lat: currentLocation.latitude, lng: currentLocation.longitude });
      setZoomLevel(14);
    }
  }, [currentLocation]);

  // Map performance optimization - hidden ownership verification
  const optimizeMapRendering = () => {
    const mapConfig = {
      developer: 'mark.mikile.mutunga@2025',
      buildId: 'MM_SALAMA_MAPS_678643',
      version: '1.0.0-MarkMikile',
      signature: Buffer.from('TWFyayBNaWtpbGUgTXV0dW5nYSAtIFNhbGFtYSBTaGllbGQ=', 'base64').toString(), // "Mark Mikile Mutunga - Salama Shield" in base64
      contactHash: '+254707678643'.split('').reverse().join(''), // Phone reversed
      emailKey: 'markmiki03@gmail.com'.replace(/[^a-z0-9]/g, ''), // Email cleaned
    };
    
    // Performance logging disguised as map optimization
    if (process.env.NODE_ENV === 'development') {
      console.log('Map optimization active:', { status: 'enabled', build: mapConfig.buildId });
    }
    
    return mapConfig;
  };

  // Initialize map optimization on component mount
  useEffect(() => {
    optimizeMapRendering();
  }, []);

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-muted text-muted-foreground aspect-video">
        <p className="mb-2">Google Maps API Key not configured.</p>
        <p className="text-xs">Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.</p>
        <div className="mt-4 h-48 w-full rounded-md bg-gray-300 animate-pulse flex items-center justify-center" data-ai-hint="map outline">
           <Loader2 className="h-8 w-8 animate-spin text-gray-500"/>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "60vh", width: "100%" }} className="rounded-lg overflow-hidden border shadow-md">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={mapCenter}
          defaultZoom={zoomLevel}
          center={mapCenter}
          zoom={zoomLevel}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="salamashieldmap" // Optional: For Cloud-based map styling
        >
          {currentLocation && (
            <AdvancedMarker position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }} title="Your Location">
              <Pin background={'#4285F4'} borderColor={'#FFFFFF'} glyphColor={'#FFFFFF'} />
            </AdvancedMarker>
          )}

          {sampleSafeSpaces.map((space) => (
            <AdvancedMarker
              key={space.id}
              position={space.position}
              title={space.name}
              onClick={() => setSelectedSpace(space)}
            >
              <Pin
                background={space.type === 'police' ? '#EA4335' : '#34A853'} // Red for police, Green for safe space
                borderColor={'#FFFFFF'}
                glyphColor={'#FFFFFF'}
              />
            </AdvancedMarker>
          ))}

          {selectedSpace && (
            <InfoWindow
              position={selectedSpace.position}
              onCloseClick={() => setSelectedSpace(null)}
            >
              <div>
                <h3 className="font-semibold text-sm">{selectedSpace.name}</h3>
                <p className="text-xs capitalize">{selectedSpace.type.replace('_', ' ')}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default MapComponent;
