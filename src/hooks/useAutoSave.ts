import { useEffect, useRef, useState } from 'react';

interface UseAutoSaveProps {
  content: string;
  filePath: string | null;
  onSave: (content: string, filePath: string) => Promise<void>;
  delay?: number;
  paused?: boolean;
}

export function useAutoSave({ content, filePath, onSave, delay = 15000, paused = false }: UseAutoSaveProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialContentRef = useRef<string>('');
  const needsResetRef = useRef(false);

  // When the file path changes mark that we need to capture the new initial content
  useEffect(() => {
    if (filePath) {
      needsResetRef.current = true;
    } else {
      // No file selected – clear references
      initialContentRef.current = '';
      setLastSaved('');
      needsResetRef.current = false;
    }
  }, [filePath]);

  // Capture the initial content for a file once it has loaded
  useEffect(() => {
    if (filePath && needsResetRef.current) {
      initialContentRef.current = content;
      setLastSaved(content);
      needsResetRef.current = false;
    }
  }, [content, filePath]);

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
    if (paused) {
      // Clear any pending timers while paused
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }
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
  }, [content, filePath, lastSaved, onSave, delay, paused]);

  return { isSaving, hasUnsavedChanges: content !== lastSaved, saveNow };
}
