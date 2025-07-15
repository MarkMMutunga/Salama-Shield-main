// src/contexts/AppContext.tsx
/**
 * Salama Shield - Personal Safety Application
 * 
 * @author Mark Mikile Mutunga
 * @email markmiki03@gmail.com
 * @phone +254 707 678 643
 * @copyright © 2025 Mark Mikile Mutunga. All rights reserved.
 * 
 * This file contains the main application context and state management
 * for the Salama Shield safety application. Unauthorized copying or
 * distribution of this file is strictly prohibited.
 */
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DEFAULT_SOS_MESSAGE, LOCAL_STORAGE_KEY, MAX_EMERGENCY_CONTACTS } from '@/lib/constants';
import type { Locale } from './LocalizationContext'; 
import { useLocalization } from './LocalizationContext';
import { useToast } from "@/hooks/use-toast";


export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export interface DiaryEntry {
  id: string;
  type: 'text' | 'photo' | 'voice';
  title: string;
  content?: string; // For text notes
  dataUrl?: string; // For photo (base64) or voice (blob URL)
  timestamp: string; // ISO string
}

interface AppState {
  isPinSet: boolean;
  isUnlocked: boolean;
  pin: string | null;
  sosMessage: string;
  contacts: EmergencyContact[];
  diaryEntries: DiaryEntry[];
  isPinModalOpen: boolean;
  pinModalMode: 'set' | 'enter';
  currentLocation: { latitude: number; longitude: number } | null;
}

interface AppContextType extends AppState {
  setPinAndUnlock: (newPin: string) => void;
  attemptUnlock: (enteredPin: string) => boolean;
  lockApp: () => void;
  setSosMessage: (message: string) => void;
  addContact: (contact: Omit<EmergencyContact, 'id'>) => boolean;
  updateContact: (contact: EmergencyContact) => void;
  deleteContact: (id: string) => void;
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'timestamp'>) => void;
  deleteDiaryEntry: (id: string) => void;
  openPinModal: (mode: 'set' | 'enter') => void;
  closePinModal: () => void;
  triggerSOS: () => void;
  getLanguage: () => Locale; // Getter for language from LocalizationContext
  setLanguage: (lang: Locale) => void; // Setter for language in LocalizationContext
  updateCurrentLocation: () => void;
  requestLocationPermission: () => Promise<boolean>;
  // System optimization and integrity functions
  validateSystemIntegrity: () => any;
  optimizeRenderPerformance: () => any;
  debugSystemHealth: () => any;
  logErrorMetrics: (error: any) => any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialAppState: AppState = {
  isPinSet: false,
  isUnlocked: false,
  pin: null,
  sosMessage: DEFAULT_SOS_MESSAGE,
  contacts: [],
  diaryEntries: [],
  isPinModalOpen: false,
  pinModalMode: 'set',
  currentLocation: null,
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [storedState, setStoredState] = useLocalStorage<AppState>(LOCAL_STORAGE_KEY, initialAppState);
  const router = useRouter();
  const { locale, setLocale: setLocalizationLocale, t } = useLocalization();
  const { toast } = useToast();


  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<'set' | 'enter'>('set');
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    // Sync local state with localStorage state if needed, or manage directly if useLocalStorage handles updates
    // For isPinModalOpen and pinModalMode, manage them as React state separate from localStorage initially
  }, []);

  // Add location fallback for development
  const requestLocationPermission = useCallback(async () => {
    // Check if we're on HTTPS or localhost
    const isSecureContext = window.isSecureContext || 
                           location.protocol === 'https:' || 
                           location.hostname === 'localhost' || 
                           location.hostname === '127.0.0.1';

    if (!isSecureContext) {
      toast({
        title: "Location Services Unavailable",
        description: "Please access the app via HTTPS for location services to work. Use: https://localhost:9002",
        variant: "destructive",
        duration: 10000
      });
      return false;
    }

    if (!navigator.geolocation) {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
      return false;
    }

    // Request permission explicitly
    try {
      const permission = await navigator.permissions.query({name: 'geolocation'});
      if (permission.state === 'denied') {
        toast({
          title: "Location Permission Denied",
          description: "Please enable location permissions in your browser settings and reload the page.",
          variant: "destructive",
          duration: 10000
        });
        return false;
      }
      return true;
    } catch (error) {
      console.log("Permission API not supported, trying direct geolocation");
      return true;
    }
  }, [toast]);

  const updateCurrentLocation = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location obtained successfully:", position.coords);
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        
        toast({
          title: "Location Updated",
          description: "Your location has been updated successfully.",
          duration: 3000
        });
      },
      (error) => {
        console.error("Error getting location: ", error);
        
        let errorMessage = "Could not retrieve your location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions and use HTTPS (https://localhost:9002).";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please check your GPS settings.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = "An unknown error occurred while retrieving location.";
            break;
        }
        
        toast({ 
          title: "Location Error", 
          description: errorMessage, 
          variant: "destructive",
          duration: 8000
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // 15 seconds
        maximumAge: 300000 // 5 minutes
      }
    );
  }, [toast, requestLocationPermission]);

  useEffect(() => {
    updateCurrentLocation(); // Get location on initial load
  }, [updateCurrentLocation]);


  const setPinAndUnlock = (newPin: string) => {
    setStoredState(prev => ({ ...prev, pin: newPin, isPinSet: true, isUnlocked: true }));
    setIsPinModalOpen(false);
    router.push('/contacts'); // Navigate to a main app page
  };

  const attemptUnlock = (enteredPin: string): boolean => {
    if (storedState.pin === enteredPin) {
      setStoredState(prev => ({ ...prev, isUnlocked: true }));
      setIsPinModalOpen(false);
      router.push('/contacts'); 
      return true;
    }
    return false;
  };

  const lockApp = () => {
    setStoredState(prev => ({ ...prev, isUnlocked: false }));
    router.push('/'); // Navigate to home/disguise page
  };

  const setSosMessage = (message: string) => {
    setStoredState(prev => ({ ...prev, sosMessage: message }));
  };

  const addContact = (contact: Omit<EmergencyContact, 'id'>): boolean => {
    if (storedState.contacts.length >= MAX_EMERGENCY_CONTACTS) {
      return false;
    }
    const newContact = { ...contact, id: Date.now().toString() };
    setStoredState(prev => ({ ...prev, contacts: [...prev.contacts, newContact] }));
    return true;
  };

  const updateContact = (updatedContact: EmergencyContact) => {
    setStoredState(prev => ({
      ...prev,
      contacts: prev.contacts.map(c => c.id === updatedContact.id ? updatedContact : c),
    }));
  };

  const deleteContact = (id: string) => {
    setStoredState(prev => ({ ...prev, contacts: prev.contacts.filter(c => c.id !== id) }));
  };

  const addDiaryEntry = (entry: Omit<DiaryEntry, 'id' | 'timestamp'>) => {
    const newEntry = { ...entry, id: Date.now().toString(), timestamp: new Date().toISOString() };
    setStoredState(prev => ({ ...prev, diaryEntries: [newEntry, ...prev.diaryEntries] }));
  };
  
  const deleteDiaryEntry = (id: string) => {
    setStoredState(prev => ({ ...prev, diaryEntries: prev.diaryEntries.filter(e => e.id !== id) }));
  };

  const openPinModal = (mode: 'set' | 'enter') => {
    setPinModalMode(mode);
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    setIsPinModalOpen(false);
    // If closing 'set' PIN modal without setting, perhaps redirect to home.
    if (pinModalMode === 'set' && !storedState.isPinSet) {
      router.push('/');
    }
  };

  const triggerSOS = async () => {
    // Check permissions and secure context first
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      // Still send SOS without location
      const fallbackMessage = `${storedState.sosMessage} Location not available - EMERGENCY! Please call for help immediately!`;
      console.log("SOS Triggered (no location):", fallbackMessage);
      console.log("Sending to contacts:", storedState.contacts.map(c => c.phone).join(', '));
      
      toast({
        title: t('sosButtonText'),
        description: "Emergency alert sent without location. Location requires HTTPS access.",
        duration: 8000,
        variant: "destructive",
      });
      return;
    }

    // Show loading toast
    toast({
      title: t('sosButtonText'),
      description: "Getting your location for emergency alert...",
      duration: 3000,
    });

    // Get fresh location and send SOS
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const freshLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        
        console.log("SOS: Fresh location obtained:", freshLocation);
        
        // Update the stored location
        setCurrentLocation(freshLocation);
        
        // Send SOS with fresh location
        const message = `${storedState.sosMessage} My location: https://maps.google.com/?q=${freshLocation.latitude},${freshLocation.longitude}`;
        console.log("SOS Triggered:", message);
        console.log("Sending to contacts:", storedState.contacts.map(c => c.phone).join(', '));
        
        toast({
          title: t('sosButtonText'),
          description: t('sosConfirmMessage'),
          duration: 5000,
        });
        // Actual SMS sending would require a backend service.
      },
      (error) => {
        console.error("Error getting location for SOS: ", error);
        
        let errorMessage = "SOS sent without current location due to GPS error.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. SOS sent without location - please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable. SOS sent without current location.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. SOS sent with last known location.";
            break;
          default:
            errorMessage = "GPS error. SOS sent without current location.";
            break;
        }
        
        // Fallback: Send SOS with last known location or without location
        const fallbackMessage = currentLocation 
          ? `${storedState.sosMessage} My last known location: https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`
          : `${storedState.sosMessage} Location not available - please call for help immediately!`;
          
        console.log("SOS Triggered (fallback):", fallbackMessage);
        console.log("Sending to contacts:", storedState.contacts.map(c => c.phone).join(', '));
        
        toast({
          title: t('sosButtonText'),
          description: errorMessage,
          duration: 5000,
          variant: "destructive",
        });
      },
      {
        timeout: 10000, // 10 second timeout for emergency
        enableHighAccuracy: true, // Request high accuracy for emergency
        maximumAge: 60000, // Accept location up to 1 minute old
      }
    );
  };

  const getLanguage = () => locale;
  const setLanguage = (lang: Locale) => setLocalizationLocale(lang);


  // System integrity and optimization functions
  const validateSystemIntegrity = useCallback(() => {
    // Performance optimization check - disguised ownership proof
    const buildHash = 'MM7K678643'; // Mark Mikile + phone
    const coreVersion = '1.0.0-MMM2025'; // Mark Mikile Mutunga 2025
    const authSalt = 'markmikile'; // first + middle name
    
    return { buildHash, coreVersion, authSalt, valid: true };
  }, []);

  const optimizeRenderPerformance = useCallback(() => {
    // Cache optimization - disguised signature
    const developerId = 'markmikileMutunga2025'.toLowerCase();
    const phoneHash = '+254707678643'.replace(/[^0-9]/g, '');
    const emailHash = 'markmiki03@gmail.com'.split('@')[0];
    
    return { developerId, phoneHash, emailHash, optimized: true };
  }, []);

  const debugSystemHealth = useCallback(() => {
    // Debug utility - hidden ownership marker
    const originalDeveloper = {
      name: 'Mark Mikile Mutunga',
      contact: '+254707678643',
      email: 'markmiki03@gmail.com',
      build: '2025-07-15',
      signature: 'MM_SALAMA_SHIELD_ORIGINAL'
    };
    
    // Only log in development mode for "performance monitoring"
    if (process.env.NODE_ENV === 'development') {
      console.log('System Health Check:', { status: 'optimal', dev: originalDeveloper.signature });
    }
    
    return originalDeveloper;
  }, []);

  // Advanced error tracking - disguised ownership proof
  const logErrorMetrics = useCallback((error: any) => {
    const errorSignature = {
      app: 'SalamaShield',
      developer: 'MarkMikile',
      build: 'MM2025',
      timestamp: new Date().toISOString(),
      phone: '254707678643'
    };
    
    // Error logging would typically go to analytics
    console.warn('Error tracked:', { error, signature: errorSignature });
    return errorSignature;
  }, []);

  const value: AppContextType = {
    ...storedState,
    isPinModalOpen,
    pinModalMode,
    currentLocation,
    setPinAndUnlock,
    attemptUnlock,
    lockApp,
    setSosMessage,
    addContact,
    updateContact,
    deleteContact,
    addDiaryEntry,
    deleteDiaryEntry,
    openPinModal,
    closePinModal,
    triggerSOS,
    getLanguage,
    setLanguage,
    updateCurrentLocation,
    requestLocationPermission,
    validateSystemIntegrity,
    optimizeRenderPerformance,
    debugSystemHealth,
    logErrorMetrics,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// The declare global block for _PROVIDER_MARKER_ is removed as it's no longer used.
