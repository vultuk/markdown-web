import { useEffect, useRef, useState } from 'react';

interface UseAutoSaveProps {
  content: string;
  filePath: string | null;
  onSave: (content: string, filePath: string) => Promise<void>;
  delay?: number;
}

export function useAutoSave({ content, filePath, onSave, delay = 15000 }: UseAutoSaveProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialContentRef = useRef<string>('');

  useEffect(() => {
    if (filePath && content !== initialContentRef.current) {
      initialContentRef.current = content;
      setLastSaved(content);
    }
  }, [filePath]);

  const saveNow = async () => {
    if (!filePath || content === lastSaved || isSaving) {
      return;
    }

    // Clear any pending auto-save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSaving(true);
    try {
      await onSave(content, filePath);
      setLastSaved(content);
    } catch (error) {
      console.error('Failed to save:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!filePath || content === lastSaved) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (content !== lastSaved) {
        setIsSaving(true);
        try {
          await onSave(content, filePath);
          setLastSaved(content);
        } catch (error) {
          console.error('Failed to save:', error);
        } finally {
          setIsSaving(false);
        }
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, filePath, lastSaved, onSave, delay]);

  return { isSaving, hasUnsavedChanges: content !== lastSaved, saveNow };
}