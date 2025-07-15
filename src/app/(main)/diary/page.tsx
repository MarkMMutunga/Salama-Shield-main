// src/app/(main)/diary/page.tsx
/**
 * Salama Shield - Personal Safety Application
 * 
 * @author Mark Mikile Mutunga
 * @email markmiki03@gmail.com
 * @phone +254 707 678 643
 * @copyright © 2025 Mark Mikile Mutunga. All rights reserved.
 * 
 * This file contains the encrypted diary page for storing evidence
 * and personal notes. Unauthorized copying or distribution
 * of this file is strictly prohibited.
 */
"use client";

import { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, BookText, Image as ImageIcon, Mic, Trash2, FileText } from 'lucide-react';
import { useAppContext, DiaryEntry } from '@/contexts/AppContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image'; // For displaying uploaded images

export default function DiaryPage() {
  const { diaryEntries, addDiaryEntry, deleteDiaryEntry } = useAppContext();
  const { t } = useLocalization();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryType, setEntryType] = useState<'text' | 'photo' | 'voice'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);


  const openModal = () => {
    setEntryType('text');
    setTitle('');
    setContent('');
    setFileDataUrl(null);
    setFileName(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (entryType === 'photo') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFileDataUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (entryType === 'voice') {
        // For voice, we'd ideally handle recording. For now, just store file name.
        // If it was a real file upload, could use URL.createObjectURL(file)
        setFileDataUrl("Simulated voice recording data for: " + file.name); // Placeholder
      }
    }
  };

  const handleSubmit = () => {
    if (!title) {
      toast({ title: "Validation Error", description: "Title cannot be empty.", variant: "destructive" });
      return;
    }
    if (entryType === 'text' && !content) {
      toast({ title: "Validation Error", description: "Content cannot be empty for text notes.", variant: "destructive" });
      return;
    }
     if ((entryType === 'photo' || entryType === 'voice') && !fileDataUrl) {
      toast({ title: "Validation Error", description: "Please select a file for photo/voice entry.", variant: "destructive" });
      return;
    }

    addDiaryEntry({ type: entryType, title, content: entryType === 'text' ? content : undefined, dataUrl: fileDataUrl || undefined });
    toast({ title: t('entryAddedSuccess')});
    closeModal();
  };
  
  const getEntryIcon = (type: DiaryEntry['type']) => {
    if (type === 'photo') return <ImageIcon className="h-5 w-5 text-primary" />;
    if (type === 'voice') return <Mic className="h-5 w-5 text-primary" />;
    return <FileText className="h-5 w-5 text-primary" />;
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('diaryTitle')}</CardTitle>
          <CardDescription>{t('diaryDescription')}</CardDescription>
          <p className="text-xs text-muted-foreground mt-1">{t('disclaimerPrivateLog')}</p>
        </CardHeader>
        <CardContent>
          <Button onClick={openModal} className="mb-6 w-full sm:w-auto">
            <PlusCircle className="mr-2 h-5 w-5" /> {t('addDiaryEntryButton')}
          </Button>
          {diaryEntries.length === 0 && (
            <p className="text-muted-foreground">{t('diaryDescription')}</p>
          )}
          <div className="space-y-4">
            {diaryEntries.map((entry) => (
              <Card key={entry.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getEntryIcon(entry.type)}
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteDiaryEntry(entry.id)} aria-label={t('deleteButton')}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {entry.type === 'text' && <p className="text-sm whitespace-pre-wrap">{entry.content}</p>}
                  {entry.type === 'photo' && entry.dataUrl && (
                    <Image src={entry.dataUrl} alt={entry.title} width={200} height={200} className="rounded-md max-w-full h-auto" data-ai-hint="evidence photo" />
                  )}
                  {entry.type === 'voice' && (
                    <div className="flex items-center gap-2">
                       <Mic className="h-4 w-4"/> <p className="text-sm">{fileName || t('voiceType')}</p>
                    </div>
                   
                  )}
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(entry.timestamp), 'MMM d, yyyy HH:mm')}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addDiaryEntryButton')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="entry-title">{t('entryTitleLabel')}</Label>
              <Input id="entry-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('entryTitleLabel')} />
            </div>
            <div>
              <Label htmlFor="entry-type">{t('entryTypeLabel')}</Label>
              <Select value={entryType} onValueChange={(value: 'text' | 'photo' | 'voice') => setEntryType(value)}>
                <SelectTrigger id="entry-type">
                  <SelectValue placeholder={t('entryTypeLabel')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">{t('textType')}</SelectItem>
                  <SelectItem value="photo">{t('photoType')}</SelectItem>
                  <SelectItem value="voice">{t('voiceType')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {entryType === 'text' && (
              <div>
                <Label htmlFor="content">{t('entryContentLabel')}</Label>
                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder={t('entryContentLabel')} />
              </div>
            )}
            {entryType === 'photo' && (
              <div>
                <Label htmlFor="photo-upload">{t('uploadPhotoLabel')}</Label>
                <Input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} />
                {fileDataUrl && <Image src={fileDataUrl} alt="Preview" width={100} height={100} className="mt-2 rounded" data-ai-hint="preview image"/>}
              </div>
            )}
            {entryType === 'voice' && (
              <div>
                <Label htmlFor="voice-upload">{t('recordVoiceLabel')}</Label>
                <Input id="voice-upload" type="file" accept="audio/*" onChange={handleFileChange} />
                 {fileName && <p className="text-sm mt-1">Selected: {fileName}</p>}
                {/* Actual recording UI would be more complex */}
                <Button variant="outline" className="mt-2 w-full" disabled>{t('recordVoiceLabel')}</Button>
              </div>
            )}
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
