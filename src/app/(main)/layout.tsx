// src/app/(main)/layout.tsx
"use client";

import { useEffect, ReactNode, useState } from 'react'; // Added useState
import { useRouter, usePathname } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { Loader2 } from 'lucide-react';


export default function MainAppLayout({ children }: { children: ReactNode }) {
  const { isUnlocked, isPinSet, openPinModal, isPinModalOpen } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false); // New state to track client-side mount

  useEffect(() => {
    setHasMounted(true); // Set to true after the component mounts on the client
  }, []);

  useEffect(() => {
    if (!hasMounted) { // Don't run PIN logic until mounted and client state is stable
      return;
    }

    // If PIN modal is already open, or if unlocked, do nothing here.
    // The modal itself will handle logic.
    if (isPinModalOpen || isUnlocked) {
      return;
    }

    // If not unlocked and modal is not open, decide to open modal.
    if (!isPinSet) {
      openPinModal('set');
    } else {
      openPinModal('enter');
    }
  }, [isUnlocked, isPinSet, openPinModal, isPinModalOpen, pathname, hasMounted]); // Added hasMounted to dependencies

  if (!hasMounted) {
    // Render this loader on the server and for the initial client render.
    // This ensures the server and client match for the first paint.
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // After mounting, client-side state (isUnlocked, isPinModalOpen) is reliable.
  // Now, decide whether to show the loader or the main content.
  if (!isUnlocked && !isPinModalOpen) {
    // This case implies we're waiting for the effect above to run and open the modal,
    // or the user is navigating away (e.g. modal closed without unlock).
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is not unlocked, PinInputModal is expected to be covering the screen.
  // Content is rendered underneath, ready for when unlock happens.
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Potential header content here if needed, e.g. page title */}
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 pb-24 sm:pb-20"> {/* Adjusted padding for content and navbar */}
        {children}
      </main>
      <BottomNavbar />
    </div>
  );
}
