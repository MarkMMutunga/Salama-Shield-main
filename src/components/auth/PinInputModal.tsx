// src/components/auth/PinInputModal.tsx
/**
 * Salama Shield - Personal Safety Application
 * 
 * @author Mark Mikile Mutunga
 * @email markmiki03@gmail.com
 * @phone +254 707 678 643
 * @copyright © 2025 Mark Mikile Mutunga. All rights reserved.
 * 
 * This file contains the PIN authentication modal component.
 * Unauthorized copying or distribution of this file is strictly prohibited.
 */
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppContext } from '@/contexts/AppContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { PIN_LENGTH } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";

export default function PinInputModal() {
  const {
    isPinModalOpen,
    pinModalMode,
    closePinModal,
    setPinAndUnlock,
    attemptUnlock,
    isPinSet,
    isUnlocked,
    lockApp,
  } = useAppContext();
  const { t } = useLocalization();
  const { toast } = useToast();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isPinModalOpen) {
      setPin('');
      setConfirmPin('');
      setError('');
    }
  }, [isPinModalOpen]);
  
  // Close modal if user becomes unlocked through other means or if no PIN is set and they are on 'enter' mode
  useEffect(() => {
    if (isUnlocked && isPinModalOpen) {
      closePinModal();
    }
    if (!isPinSet && pinModalMode === 'enter' && isPinModalOpen) {
      // This case shouldn't happen if logic in openPinModal is correct, but as a safeguard:
      closePinModal();
      lockApp(); // Ensure app is locked and user is on disguise page
    }
  }, [isUnlocked, isPinSet, pinModalMode, isPinModalOpen, closePinModal, lockApp]);


  const handleSubmit = () => {
    if (pin.length !== PIN_LENGTH) {
      setError(t('pinRequiredMessage'));
      return;
    }

    if (pinModalMode === 'set') {
      if (pin !== confirmPin) {
        setError(t('pinMismatchError'));
        return;
      }
      setPinAndUnlock(pin);
      toast({ title: t('pinSetSuccess') });
    } else { // 'enter' mode
      if (!attemptUnlock(pin)) {
        setError(t('pinIncorrectError'));
        setPin(''); // Clear pin on incorrect attempt
      } else {
        // Unlock success is handled in attemptUnlock, modal will close
      }
    }
  };

  if (!isPinModalOpen || isUnlocked) { // Do not render if not open or if already unlocked
    return null;
  }

  return (
    <Dialog open={isPinModalOpen} onOpenChange={(isOpen) => !isOpen && closePinModal()}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{pinModalMode === 'set' ? t('setPinTitle') : t('enterPinTitle')}</DialogTitle>
          <DialogDescription>
            {pinModalMode === 'set' ? t('pinRequiredMessage') : t('enterPinTitle')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pin" className="text-right col-span-1">
              {t('pinLabel')}
            </Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.slice(0, PIN_LENGTH))}
              maxLength={PIN_LENGTH}
              className="col-span-3"
              placeholder={t('pinPlaceholder')}
              autoFocus
            />
          </div>
          {pinModalMode === 'set' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPin" className="text-right col-span-1">
                {t('confirmPinLabel')}
              </Label>
              <Input
                id="confirmPin"
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.slice(0, PIN_LENGTH))}
                maxLength={PIN_LENGTH}
                className="col-span-3"
                placeholder={t('pinPlaceholder')}
              />
            </div>
          )}
          {error && <p className="text-sm text-destructive text-center col-span-4">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={closePinModal}>{t('cancelButton')}</Button>
          <Button type="submit" onClick={handleSubmit} disabled={pin.length !== PIN_LENGTH || (pinModalMode === 'set' && confirmPin.length !== PIN_LENGTH)}>
            {pinModalMode === 'set' ? t('saveButton') : t('submitButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
