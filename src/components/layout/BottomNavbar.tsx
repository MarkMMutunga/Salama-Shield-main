// src/components/layout/BottomNavbar.tsx
/**
 * Salama Shield - Personal Safety Application
 * 
 * @author Mark Mikile Mutunga
 * @email markmiki03@gmail.com
 * @phone +254 707 678 643
 * @copyright © 2025 Mark Mikile Mutunga. All rights reserved.
 * 
 * This file contains the bottom navigation component.
 * Unauthorized copying or distribution of this file is strictly prohibited.
 */
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BookLock, MapPin, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/contexts/LocalizationContext';

const navItems = [
  { href: '/contacts', labelKey: 'navbarContacts', icon: Users },
  { href: '/diary', labelKey: 'navbarDiary', icon: BookLock },
  { href: '/map', labelKey: 'navbarMap', icon: MapPin },
  { href: '/settings', labelKey: 'navbarSettings', icon: Settings },
];

export default function BottomNavbar() {
  const pathname = usePathname();
  const { t } = useLocalization();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="container mx-auto flex justify-around items-center h-16 max-w-md">
        {/* Home/SOS Disguise Screen Link */}
        <Link href="/" passHref legacyBehavior>
          <a className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
            pathname === '/' ? 'text-primary-foreground bg-primary' : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent/20'
          )}>
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">{t('healthTrackerTitle')}</span>
          </a>
        </Link>

        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link href={item.href} key={item.href} passHref legacyBehavior>
              <a className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
                isActive ? 'text-primary-foreground bg-primary' : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent/20'
              )}>
                <item.icon className="w-6 h-6" />
                <span className="text-xs mt-1">{t(item.labelKey as any)}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
