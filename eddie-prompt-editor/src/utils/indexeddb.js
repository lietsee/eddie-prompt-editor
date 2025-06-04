import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';

const db = new Dexie('PromptEditorDB');

db.version(1).stores({
  prompts: 'id, title, updatedAt, rating',
});

export const promptsDB = {
  async getAll() {
    try {
      return await db.prompts.orderBy('updatedAt').reverse().toArray();
    } catch (error) {
      console.error('Error getting prompts:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      return await db.prompts.get(id);
    } catch (error) {
      console.error('Error getting prompt by id:', error);
      throw error;
    }
  },

  async save(promptData) {
    try {
      const now = Date.now();
      const prompt = {
        ...promptData,
        id: promptData.id || uuidv4(),
        createdAt: promptData.createdAt || now,
        updatedAt: now,
        rating: promptData.rating || null,
        tags: promptData.tags || [],
      };

      await db.prompts.put(prompt);
      return prompt;
    } catch (error) {
      console.error('Error saving prompt:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await db.prompts.delete(id);
    } catch (error) {
      console.error('Error deleting prompt:', error);
      throw error;
    }
  },

  async search(query) {
    try {
      if (!query) return await this.getAll();
      
      const lowerQuery = query.toLowerCase();
      return await db.prompts
        .filter(prompt => 
          prompt.title.toLowerCase().includes(lowerQuery) ||
          prompt.content.toLowerCase().includes(lowerQuery)
        )
        .toArray();
    } catch (error) {
      console.error('Error searching prompts:', error);
      throw error;
    }
  },

  async updateRating(id, rating) {
    try {
      await db.prompts.update(id, { rating, updatedAt: Date.now() });
    } catch (error) {
      console.error('Error updating rating:', error);
      throw error;
    }
  },
};

export default db;