import { useCallback } from 'react';
import { cleanLogs } from '../utils/logCleaner';

export function useLogCleaner() {
  const clean = useCallback((text) => {
    return cleanLogs(text);
  }, []);

  return { clean };
}