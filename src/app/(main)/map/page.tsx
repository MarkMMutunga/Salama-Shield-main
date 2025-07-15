// src/app/(main)/map/page.tsx
/**
 * Salama Shield - Personal Safety Application
 * 
 * @author Mark Mikile Mutunga
 * @email markmiki03@gmail.com
 * @phone +254 707 678 643
 * @copyright © 2025 Mark Mikile Mutunga. All rights reserved.
 * 
 * This file contains the safe zones map page showing police stations
 * and safe spaces. Unauthorized copying or distribution
 * of this file is strictly prohibited.
 */
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocalization } from '@/contexts/LocalizationContext';
import MapComponent from '@/components/map/MapComponent'; // Ensure this path is correct
import { List, ListItem } from "@/components/ui/list"; // Assuming you have a List component, or use ul/li
import { ShieldCheck, Building } from "lucide-react";


// Sample data, same as in MapComponent for consistency in list view
const sampleSafeSpacesList = [
  { id: 'ps1', name: 'Central Police Station', type: 'police' },
  { id: 'ps2', name: 'Kilimani Police Station', type: 'police' },
  { id: 'ss1', name: 'Hope Shelter', type: 'safe_space' },
  { id: 'ss2', name: 'Serene Haven', type: 'safe_space' },
];


export default function MapPage() {
  const { t } = useLocalization();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('mapTitle')}</CardTitle>
          <CardDescription>{t('mapDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <MapComponent />
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><Building className="mr-2 h-5 w-5 text-primary"/>{t('policeStations')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sampleSafeSpacesList.filter(s => s.type === 'police').map(station => (
                <li key={station.id} className="p-3 bg-muted/50 rounded-md text-sm">{station.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-green-600"/>{t('safeSpaces')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sampleSafeSpacesList.filter(s => s.type === 'safe_space').map(space => (
                <li key={space.id} className="p-3 bg-muted/50 rounded-md text-sm">{space.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
