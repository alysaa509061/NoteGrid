import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Trash2, Copy, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { Note } from '@/types/Note';
import { loadNotes, deleteNote, saveNotes } from '@/utils/storage';
import { formatDateTime, formatCurrency } from '@/utils/calculations';

export default function NotesListScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotesData = async () => {
    setLoading(true);
    const loadedNotes = await loadNotes();
    // Sort by creation date, newest first
    const sortedNotes = loadedNotes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setNotes(sortedNotes);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotesData();
    }, [])
  );

  const handleDeleteNote = async (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteNote(noteId);
            await loadNotesData();
          },
        },
      ]
    );
  };

  const handleCopyNote = async (note: Note) => {
    const noteText = formatNoteForSharing(note);
    
    Alert.alert(
      'Export Note',
      'Choose export option:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Copy Total Only',
          onPress: () => {
            Share.share({
              message: `Total: ₹${formatCurrency(note.total)}${note.split ? `\nPer person: ₹${formatCurrency(note.split.perPerson)} (${note.split.people} people)` : ''}`,
            });
          },
        },
        {
          text: 'Copy Full Note',
          onPress: () => {
            Share.share({
              message: noteText,
            });
          },
        },
      ]
    );
  };

  const formatNoteForSharing = (note: Note): string => {
    let text = `${note.title}\n${formatDateTime(note.createdAt)}\n\n`;
    
    note.table.forEach(row => {
      if (row.item || row.amount) {
        text += `${row.item || 'Item'}: ₹${row.amount || '0.00'}\n`;
      }
    });
    
    text += `\nTotal: ₹${formatCurrency(note.total)}`;
    
    if (note.split) {
      text += `\nSplit between ${note.split.people} people: ₹${formatCurrency(note.split.perPerson)} each`;
    }
    
    return text;
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <View style={styles.noteItem}>
      <TouchableOpacity
        style={styles.noteContent}
        onLongPress={() => handleCopyNote(item)}
      >
        <View style={styles.noteHeader}>
          <Text style={styles.noteTitle}>{item.title || 'Untitled Note'}</Text>
          <Text style={styles.noteTotal}>₹{formatCurrency(item.total)}</Text>
        </View>
        <Text style={styles.noteDate}>{formatDateTime(item.createdAt)}</Text>
        {item.split && (
          <Text style={styles.noteSplit}>
            Split: ₹{formatCurrency(item.split.perPerson)} each ({item.split.people} people)
          </Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.noteActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCopyNote(item)}
        >
          <Copy size={20} color="#F3DFA2" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteNote(item.id)}
        >
          <Trash2 size={20} color="#F3DFA2" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading notes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MatrixView</Text>
        <Text style={styles.headerSubtitle}>{notes.length} notes</Text>
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No notes yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Tap "New Note" to create your first note
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#231F20',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#426B69',
  },
  headerTitle: {
    color: '#F3DFA2',
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#A7754D',
    fontSize: 16,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#231F20',
  },
  loadingText: {
    color: '#F3DFA2',
    fontSize: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    color: '#F3DFA2',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateSubtext: {
    color: '#A7754D',
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  noteItem: {
    flexDirection: 'row',
    backgroundColor: '#231F20',
    borderWidth: 1,
    borderColor: '#426B69',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  noteContent: {
    flex: 1,
    padding: 16,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitle: {
    color: '#F3DFA2',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  noteTotal: {
    color: '#F3DFA2',
    fontSize: 20,
    fontWeight: 'bold',
  },
  noteDate: {
    color: '#A7754D',
    fontSize: 14,
    marginBottom: 4,
  },
  noteSplit: {
    color: '#A7754D',
    fontSize: 14,
  },
  noteActions: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#426B69',
  },
  actionButton: {
    padding: 8,
    marginVertical: 4,
  },
});