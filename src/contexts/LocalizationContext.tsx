// src/contexts/LocalizationContext.tsx
/**
 * Salama Shield - Personal Safety Application
 * 
 * @author Mark Mikile Mutunga
 * @email markmiki03@gmail.com
 * @phone +254 707 678 643
 * @copyright © 2025 Mark Mikile Mutunga. All rights reserved.
 * 
 * This file contains the localization context for multi-language support.
 * Unauthorized copying or distribution of this file is strictly prohibited.
 */
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import enMessages from '@/locales/en.json';
import swMessages from '@/locales/sw.json';

export type Locale = 'en' | 'sw';
type Messages = typeof enMessages;

interface LocalizationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Messages, fallback?: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const messages: Record<Locale, Messages> = {
  en: enMessages,
  sw: swMessages,
};

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en'); // Default to English

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = useCallback((key: keyof Messages, fallback?: string): string => {
    return messages[locale][key] || fallback || key;
  }, [locale]);

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
