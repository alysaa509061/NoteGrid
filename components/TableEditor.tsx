import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import { TableRow } from '@/types/Note';
import { calculateTotal, generateId, calculateWithFunction, CalculationConfig } from '@/utils/calculations';

interface TableEditorProps {
  table: TableRow[];
  onTableChange: (table: TableRow[]) => void;
  onTotalChange: (total: number) => void;
  calculationConfig?: CalculationConfig;
}

export default function TableEditor({ table, onTableChange, onTotalChange, calculationConfig }: TableEditorProps) {
  const [localTable, setLocalTable] = useState<TableRow[]>(table);

  useEffect(() => {
    setLocalTable(table);
  }, [table]);

  useEffect(() => {
    const total = calculateWithFunction(localTable, calculationConfig || { type: 'sum' });
    onTotalChange(total);
    onTableChange(localTable);
  }, [localTable, onTableChange, onTotalChange, calculationConfig]);

  const createEmptyRow = (): TableRow => ({
    id: generateId(),
    item: '',
    amount: '',
  });

  const addRow = () => {
    setLocalTable([...localTable, createEmptyRow()]);
  };

  const deleteRow = (rowId: string) => {
    if (localTable.length <= 1) {
      Alert.alert('Cannot Delete', 'At least one row is required.');
      return;
    }
    setLocalTable(localTable.filter(row => row.id !== rowId));
  };

  const updateRow = (rowId: string, field: 'item' | 'amount', value: string) => {
    setLocalTable(localTable.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  };

  const handleKeyPress = (rowId: string, field: 'item' | 'amount', key: string) => {
    if (key === 'Enter') {
      const currentIndex = localTable.findIndex(row => row.id === rowId);
      if (currentIndex === localTable.length - 1) {
        // If it's the last row, add a new row
        addRow();
      }
      // Focus would move to next row automatically in a real implementation
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Item</Text>
        <Text style={styles.headerText}>Amount</Text>
        <View style={styles.actionColumn} />
      </View>

      <ScrollView style={styles.tableContainer}>
        {localTable.map((row, index) => (
          <View key={row.id} style={styles.row}>
            <TextInput
              style={styles.itemInput}
              value={row.item}
              onChangeText={(value) => updateRow(row.id, 'item', value)}
              onSubmitEditing={() => handleKeyPress(row.id, 'item', 'Enter')}
              placeholder="Enter item"
              placeholderTextColor="#A7754D"
              selectionColor="#A7754D"
              returnKeyType="next"
            />
            <TextInput
              style={styles.amountInput}
              value={row.amount}
              onChangeText={(value) => updateRow(row.id, 'amount', value)}
              onSubmitEditing={() => handleKeyPress(row.id, 'amount', 'Enter')}
              placeholder="0.00"
              placeholderTextColor="#A7754D"
              keyboardType="numeric"
              selectionColor="#A7754D"
              returnKeyType="next"
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteRow(row.id)}
            >
              <Minus size={20} color="#F3DFA2" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={addRow}>
        <Plus size={20} color="#F3DFA2" />
        <Text style={styles.addButtonText}>Add Row</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#426B69',
  },
  headerText: {
    color: '#F3DFA2',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  actionColumn: {
    width: 40,
  },
  tableContainer: {
    flex: 1,
    maxHeight: 300,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#426B69',
  },
  itemInput: {
    flex: 1,
    color: '#F3DFA2',
    backgroundColor: '#231F20',
    borderWidth: 1,
    borderColor: '#426B69',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: '#F3DFA2',
    backgroundColor: '#231F20',
    borderWidth: 1,
    borderColor: '#426B69',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight: 8,
    textAlign: 'right',
  },
  deleteButton: {
    width: 40,
    height: 40,
    backgroundColor: '#426B69',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#426B69',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#F3DFA2',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
});