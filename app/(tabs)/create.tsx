import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Save, Trash2 } from 'lucide-react-native';
import { Note, TableRow } from '@/types/Note';
import { loadNotes, saveNotes } from '@/utils/storage';
import { calculateTotal, generateId, formatCurrency, formatDateTime, calculateWithFunction, CalculationConfig } from '@/utils/calculations';
import TableEditor from '@/components/TableEditor';
import SplitCalculator from '@/components/SplitCalculator';
import CalculationSelector from '@/components/CalculationSelector';

export default function CreateNoteScreen() {
  const [title, setTitle] = useState<string>('');
  const [createdAt] = useState<string>(new Date().toISOString());
  const [table, setTable] = useState<TableRow[]>([
    ...Array(10).fill(null).map(() => ({
      id: generateId(),
      item: '',
      amount: '',
    }))
  ]);
  const [total, setTotal] = useState<number>(0);
  const [split, setSplit] = useState<{ people: number; perPerson: number } | undefined>();
  const [calculationConfig, setCalculationConfig] = useState<CalculationConfig>({ type: 'sum' });

  const clearTable = () => {
    Alert.alert(
      'Clear Table',
      'Are you sure you want to clear all table data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: resetForm,
        },
      ]
    );
  };

  const saveNote = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your note.');
      return;
    }

    // Filter out empty rows
    const filteredTable = table.filter(row => row.item.trim() || row.amount.trim());
    
    if (filteredTable.length === 0) {
      Alert.alert('Empty Table', 'Please add at least one item to save the note.');
      return;
    }

    // Recalculate total with current configuration before saving
    const finalTotal = calculateWithFunction(filteredTable, calculationConfig);

    const note: Note = {
      id: generateId(),
      title: title.trim(),
      createdAt,
      table: filteredTable,
      total: finalTotal,
      split,
    };

    try {
      const existingNotes = await loadNotes();
      const updatedNotes = [note, ...existingNotes];
      await saveNotes(updatedNotes);
      
      Alert.alert(
        'Note Saved',
        'Your note has been saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save note. Please try again.');
      console.error('Save error:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    const newTable = Array(10).fill(null).map(() => ({
      id: generateId(),
      item: '',
      amount: '',
    }));
    setTable(newTable);
    setTotal(0);
    setSplit(undefined);
    setCalculationConfig({ type: 'sum' });
    
    // Navigate back to notes list after successful save
    router.push('/(tabs)/');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Note</Text>
          <Text style={styles.dateTime}>{formatDateTime(createdAt)}</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleLabel}>Title</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter note title"
            placeholderTextColor="#A7754D"
            selectionColor="#A7754D"
          />
        </View>

        <View style={styles.calculationContainer}>
          <CalculationSelector
            config={calculationConfig}
            onConfigChange={setCalculationConfig}
          />
        </View>
        <View style={styles.tableContainer}>
          <TableEditor
            table={table}
            onTableChange={setTable}
            onTotalChange={setTotal}
            calculationConfig={calculationConfig}
          />
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>
            {calculationConfig.type === 'average' ? 'Average' :
             calculationConfig.type === 'count' ? 'Count' :
             calculationConfig.type === 'subtract' ? 'Value - Sum' : 'Total'}
          </Text>
          <Text style={styles.totalAmount}>
            {calculationConfig.type === 'count' ? total.toString() : `₹${formatCurrency(total)}`}
          </Text>
        </View>

        <SplitCalculator 
          total={total}
          onSplitChange={setSplit}
        />

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.clearButton} onPress={clearTable}>
            <Trash2 size={20} color="#F3DFA2" />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
            <Save size={20} color="#F3DFA2" />
            <Text style={styles.saveButtonText}>Save Note</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#231F20',
  },
  scrollView: {
    flex: 1,
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
  dateTime: {
    color: '#A7754D',
    fontSize: 16,
    marginTop: 4,
  },
  titleContainer: {
    padding: 20,
  },
  titleLabel: {
    color: '#F3DFA2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titleInput: {
    color: '#F3DFA2',
    backgroundColor: '#231F20',
    borderWidth: 2,
    borderColor: '#426B69',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  calculationContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tableContainer: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#426B69',
    borderRadius: 8,
    backgroundColor: '#231F20',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    backgroundColor: '#426B69',
    borderRadius: 8,
  },
  totalLabel: {
    color: '#F3DFA2',
    fontSize: 24,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#F3DFA2',
    fontSize: 32,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#426B69',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#A7754D',
  },
  clearButtonText: {
    color: '#F3DFA2',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#426B69',
    paddingVertical: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#F3DFA2',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});