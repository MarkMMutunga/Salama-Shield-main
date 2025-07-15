// src/app/(main)/contacts/page.tsx
/**
 * Salama Shield - Personal Safety Application
 * 
 * @author Mark Mikile Mutunga
 * @email markmiki03@gmail.com
 * @phone +254 707 678 643
 * @copyright © 2025 Mark Mikile Mutunga. All rights reserved.
 * 
 * This file contains the emergency contacts management page.
 * Unauthorized copying or distribution of this file is strictly prohibited.
 */
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, User, Trash2, Edit3, Phone } from 'lucide-react';
import { useAppContext, EmergencyContact } from '@/contexts/AppContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { MAX_EMERGENCY_CONTACTS } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";

export default function ContactsPage() {
  const { contacts, addContact, updateContact, deleteContact } = useAppContext();
  const { t } = useLocalization();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const openModal = (contact: EmergencyContact | null = null) => {
    if (contact) {
      setEditingContact(contact);
      setName(contact.name);
      setPhone(contact.phone);
    } else {
      setEditingContact(null);
      setName('');
      setPhone('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
    setName('');
    setPhone('');
  };

  const handleSubmit = () => {
    if (!name || !phone) {
      toast({ title: "Validation Error", description: "Name and phone cannot be empty.", variant: "destructive" });
      return;
    }

    if (editingContact) {
      updateContact({ ...editingContact, name, phone });
      toast({ title: t('contactUpdatedSuccess')});
    } else {
      if (contacts.length >= MAX_EMERGENCY_CONTACTS) {
        toast({ title: t('maxContactsReached'), variant: "destructive" });
        return;
      }
      const success = addContact({ name, phone });
      if (success) {
        toast({ title: t('contactAddedSuccess')});
      } else {
         toast({ title: t('maxContactsReached'), variant: "destructive" });
      }
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('contactsTitle')}</CardTitle>
          <CardDescription>{t('contactsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {contacts.length < MAX_EMERGENCY_CONTACTS && (
            <Button onClick={() => openModal()} className="mb-6 w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> {t('addContactButton')}
            </Button>
          )}
          {contacts.length === 0 && (
            <p className="text-muted-foreground">{t('contactsDescription')}</p>
          )}
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2 sm:mb-0">
                  <User className="h-10 w-10 text-primary mr-4 p-2 bg-primary/10 rounded-full" />
                  <div>
                    <p className="font-semibold text-lg">{contact.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center"><Phone className="w-3 h-3 mr-1.5"/>{contact.phone}</p>
                  </div>
                </div>
                <div className="flex space-x-2 self-end sm:self-center">
                  <Button variant="outline" size="icon" onClick={() => openModal(contact)} aria-label={t('editButton')}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => { deleteContact(contact.id); toast({ title: t('contactDeletedSuccess') });}} aria-label={t('deleteButton')}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingContact ? t('editButton') : t('addContactButton')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">{t('contactNameLabel')}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('contactNameLabel')} />
            </div>
            <div>
              <Label htmlFor="phone">{t('contactPhoneLabel')}</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('contactPhoneLabel')} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">{t('cancelButton')}</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>{t('saveButton')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
