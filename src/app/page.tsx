// src/app/page.tsx
/**
 * Salama Shield - Personal Safety Application
 * 
 * @author Mark Mikile Mutunga
 * @email markmiki03@gmail.com
 * @phone +254 707 678 643
 * @copyright © 2025 Mark Mikile Mutunga. All rights reserved.
 * 
 * This file contains the main homepage disguised as a health tracker
 * with hidden emergency SOS functionality. Unauthorized copying or
 * distribution of this file is strictly prohibited.
 */
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Heart, Footprints, BedDouble, Settings, ShieldAlert } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import SalamaShieldIcon from '@/components/icons/SalamaShieldIcon';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Added useRouter

interface HealthStatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: React.ElementType;
  colorClass: string;
  dataAiHint?: string;
  imageUrl?: string;
}

const HealthStatCard: React.FC<HealthStatCardProps> = ({ title, value, unit, icon: Icon, colorClass, dataAiHint, imageUrl }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </CardHeader>
    <CardContent>
      {imageUrl ? (
         <div className="relative h-32 w-full mb-2 rounded-md overflow-hidden">
            <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" data-ai-hint={dataAiHint} />
          </div>
      ) : null}
      <div className="text-2xl font-bold">{value}</div>
      {unit && <p className="text-xs text-muted-foreground">{unit}</p>}
    </CardContent>
  </Card>
);


export default function HealthTrackerPage() {
  const { openPinModal, isPinSet, triggerSOS, updateCurrentLocation, isUnlocked } = useAppContext(); // Added isUnlocked
  const { t } = useLocalization();
  const router = useRouter(); // Initialized router
  
  const [steps, setSteps] = useState("0");
  const [heartRate, setHeartRate] = useState("0");
  const [sleepHours, setSleepHours] = useState("0");

  useEffect(() => {
    // Simulate dynamic health data
    setSteps(Math.floor(Math.random() * 5000 + 2000).toLocaleString());
    setHeartRate(Math.floor(Math.random() * 30 + 60).toString());
    setSleepHours((Math.random() * 3 + 5).toFixed(1));
    updateCurrentLocation(); // Fetch location when page loads
  }, [updateCurrentLocation]);

  const handleAccessAppSettings = () => {
    if (isUnlocked) {
      router.push('/contacts'); // Navigate if already unlocked
    } else {
      openPinModal(isPinSet ? 'enter' : 'set'); // Otherwise, show PIN modal
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 ">
      <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-6">
          <div className="flex items-center space-x-3">
            <SalamaShieldIcon size={36} />
            <div>
              <CardTitle className="text-2xl font-headline">{t('appName')}</CardTitle>
              <CardDescription className="text-primary-foreground/80">{t('healthTrackerTitle')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HealthStatCard title={t('steps')} value={steps} icon={Footprints} colorClass="text-blue-500" imageUrl="https://placehold.co/300x200.png" dataAiHint="walking fitness" />
            <HealthStatCard title={t('heartRate')} value={heartRate} unit={t('bpm')} icon={Heart} colorClass="text-red-500" imageUrl="https://placehold.co/300x200.png" dataAiHint="heartbeat pulse" />
            <HealthStatCard title={t('sleep')} value={sleepHours} unit={t('hours')} icon={BedDouble} colorClass="text-purple-500" imageUrl="https://placehold.co/300x200.png" dataAiHint="sleeping peaceful" />
             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activity</CardTitle>
                <BarChart className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="relative h-32 w-full mb-2 rounded-md overflow-hidden">
                        <Image src="https://placehold.co/600x400.png" alt="Activity Chart" layout="fill" objectFit="cover" data-ai-hint="activity chart"/>
                    </div>
                    <p className="text-xs text-muted-foreground">Weekly progress</p>
                </CardContent>
            </Card>
          </div>

          <Button
            onClick={triggerSOS}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground py-6 text-lg rounded-lg shadow-md hover:shadow-lg transition-shadow"
            aria-label={t('sosButtonText')}
          >
            <ShieldAlert className="w-6 h-6 mr-2" />
            {t('sosButtonText')}
          </Button>

          <Button
            variant="outline"
            onClick={handleAccessAppSettings}
            className="w-full py-3 text-sm rounded-lg"
            aria-label={t('accessAppSettings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            {t('accessAppSettings')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
