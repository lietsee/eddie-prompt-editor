import { useState, useEffect, useCallback, useRef } from 'react';
import { extractNouns } from '../utils/nlpProcessor';

export function useNlpSuggest(text, enabled = true) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  const processSuggestions = useCallback(async (inputText) => {
    if (!inputText || !enabled) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const nouns = await extractNouns(inputText);
      setSuggestions(nouns);
    } catch (err) {
      setError(err.message);
      console.error('Failed to extract nouns:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      processSuggestions(text);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [text, processSuggestions]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    loading,
    error,
    clearSuggestions,
  };
}