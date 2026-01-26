import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '@/types/Note';

const STORAGE_KEY = 'matrixview_notes';

export const saveNotes = async (notes: Note[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

export const loadNotes = async (): Promise<Note[]> => {
  try {
    const notesJson = await AsyncStorage.getItem(STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    const notes = await loadNotes();
    const updatedNotes = notes.filter(note => note.id !== noteId);
    await saveNotes(updatedNotes);
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};