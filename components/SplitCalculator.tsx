import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { calculatePerPersonSplit, formatCurrency } from '@/utils/calculations';

interface SplitCalculatorProps {
  total: number;
  onSplitChange: (split: { people: number; perPerson: number } | undefined) => void;
}

export default function SplitCalculator({ total, onSplitChange }: SplitCalculatorProps) {
  const [people, setPeople] = useState<string>('');
  
  useEffect(() => {
    const numPeople = parseInt(people) || 0;
    if (numPeople > 0) {
      const perPerson = calculatePerPersonSplit(total, numPeople);
      onSplitChange({ people: numPeople, perPerson });
    } else {
      onSplitChange(undefined);
    }
  }, [people, total, onSplitChange]);

  const numPeople = parseInt(people) || 0;
  const perPerson = numPeople > 0 ? calculatePerPersonSplit(total, numPeople) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Split Calculator (Optional)</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number of people:</Text>
        <TextInput
          style={styles.input}
          value={people}
          onChangeText={setPeople}
          placeholder="0"
          placeholderTextColor="#A7754D"
          keyboardType="numeric"
          selectionColor="#A7754D"
        />
      </View>
      {numPeople > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Per person: ₹{formatCurrency(perPerson)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#231F20',
    padding: 16,
    borderWidth: 1,
    borderColor: '#426B69',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    color: '#F3DFA2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#F3DFA2',
    fontSize: 16,
    flex: 1,
  },
  input: {
    color: '#F3DFA2',
    backgroundColor: '#231F20',
    borderWidth: 1,
    borderColor: '#426B69',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 80,
    textAlign: 'right',
  },
  resultContainer: {
    backgroundColor: '#426B69',
    padding: 12,
    borderRadius: 4,
  },
  resultText: {
    color: '#F3DFA2',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});