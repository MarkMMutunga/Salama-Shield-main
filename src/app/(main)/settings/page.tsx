// src/app/(main)/settings/page.tsx
/**
 * Salama Shield - Personal Safety Application
 * 
 * @author Mark Mikile Mutunga
 * @email markmiki03@gmail.com
 * @phone +254 707 678 643
 * @copyright © 2025 Mark Mikile Mutunga. All rights reserved.
 * 
 * This file contains the application settings and configuration page.
 * Unauthorized copying or distribution of this file is strictly prohibited.
 */
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useAppContext } from '@/contexts/AppContext';
import type { Locale } from '@/contexts/LocalizationContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { PIN_LENGTH } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const {
    sosMessage,
    setSosMessage,
    getLanguage,
    setLanguage,
    pin: currentStoredPin, // Renamed to avoid conflict
    setPinAndUnlock, // Use this to change PIN too, it effectively sets and unlocks
    isPinSet,
  } = useAppContext();
  const { t } = useLocalization();
  const { toast } = useToast();

  const [localSosMessage, setLocalSosMessage] = useState(sosMessage);
  const [isPinChangeModalOpen, setIsPinChangeModalOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');

  const handleSaveSosMessage = () => {
    setSosMessage(localSosMessage);
    toast({ title: "Settings Saved", description: "SOS message updated." });
  };

  const handleLanguageChange = (newLang: Locale) => {
    setLanguage(newLang);
    toast({ title: "Settings Saved", description: `Language changed to ${newLang === 'en' ? 'English' : 'Kiswahili'}.` });
  };

  const handleChangePin = () => {
    if (!isPinSet) { // Should not happen if change PIN is offered, but good check
      toast({ title: "Error", description: "No PIN set. Cannot change.", variant: "destructive"});
      return;
    }
    if (currentPin !== currentStoredPin) {
      setPinChangeError(t('pinIncorrectError'));
      return;
    }
    if (newPin.length !== PIN_LENGTH) {
      setPinChangeError(t('pinRequiredMessage'));
      return;
    }
    if (newPin !== confirmNewPin) {
      setPinChangeError(t('pinMismatchError'));
      return;
    }
    setPinAndUnlock(newPin); // This updates the PIN and keeps user unlocked
    toast({ title: t('pinChangedSuccess')});
    setIsPinChangeModalOpen(false);
    setCurrentPin('');
    setNewPin('');
    setConfirmNewPin('');
    setPinChangeError('');
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('settingsTitle')}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('languageLabel')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={getLanguage()} onValueChange={(value: Locale) => handleLanguageChange(value)}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder={t('languageLabel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('english')}</SelectItem>
              <SelectItem value="sw">{t('kiswahili')}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('sosPresetMessageLabel')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={localSosMessage}
            onChange={(e) => setLocalSosMessage(e.target.value)}
            placeholder={t('sosPresetMessageLabel')}
            rows={4}
          />
          <Button onClick={handleSaveSosMessage}>{t('saveButton')}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('changePinButton')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isPinChangeModalOpen} onOpenChange={setIsPinChangeModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={!isPinSet}>{t('changePinButton')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('changePinButton')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="currentPin">{t('currentPinLabel')}</Label>
                  <Input id="currentPin" type="password" value={currentPin} onChange={(e) => setCurrentPin(e.target.value.slice(0, PIN_LENGTH))} maxLength={PIN_LENGTH} />
                </div>
                <div>
                  <Label htmlFor="newPin">{t('newPinLabel')}</Label>
                  <Input id="newPin" type="password" value={newPin} onChange={(e) => setNewPin(e.target.value.slice(0, PIN_LENGTH))} maxLength={PIN_LENGTH} />
                </div>
                <div>
                  <Label htmlFor="confirmNewPin">{t('confirmNewPinLabel')}</Label>
                  <Input id="confirmNewPin" type="password" value={confirmNewPin} onChange={(e) => setConfirmNewPin(e.target.value.slice(0, PIN_LENGTH))} maxLength={PIN_LENGTH} />
                </div>
                {pinChangeError && <p className="text-sm text-destructive">{pinChangeError}</p>}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={() => { setCurrentPin(''); setNewPin(''); setConfirmNewPin(''); setPinChangeError(''); }}>{t('cancelButton')}</Button>
                </DialogClose>
                <Button onClick={handleChangePin}>{t('saveButton')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
