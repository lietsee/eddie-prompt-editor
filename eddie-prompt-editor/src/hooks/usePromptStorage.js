import { useState, useEffect, useCallback } from 'react';
import { promptsDB } from '../utils/indexeddb';

export function usePromptStorage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPrompts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await promptsDB.getAll();
      setPrompts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load prompts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const savePrompt = useCallback(async (promptData) => {
    try {
      const saved = await promptsDB.save(promptData);
      await loadPrompts();
      return saved;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadPrompts]);

  const deletePrompt = useCallback(async (id) => {
    try {
      await promptsDB.delete(id);
      await loadPrompts();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadPrompts]);

  const updateRating = useCallback(async (id, rating) => {
    try {
      await promptsDB.updateRating(id, rating);
      await loadPrompts();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadPrompts]);

  const searchPrompts = useCallback(async (query) => {
    try {
      const results = await promptsDB.search(query);
      setPrompts(results);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Search failed:', err);
    }
  }, []);

  const getPromptById = useCallback(async (id) => {
    try {
      return await promptsDB.getById(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    prompts,
    loading,
    error,
    savePrompt,
    deletePrompt,
    updateRating,
    searchPrompts,
    getPromptById,
    reload: loadPrompts,
  };
}