import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import { Calculator, ChevronDown } from 'lucide-react-native';
import { CalculationType, CalculationConfig } from '@/utils/calculations';

interface CalculationSelectorProps {
  config: CalculationConfig;
  onConfigChange: (config: CalculationConfig) => void;
}

const calculationTypes: { type: CalculationType; label: string; needsValue: boolean }[] = [
  { type: 'sum', label: 'Sum', needsValue: false },
  { type: 'subtract', label: 'Sub (Value - Sum)', needsValue: true },
  { type: 'percentage', label: 'Percentage Breakdown', needsValue: false },
  { type: 'average', label: 'Average', needsValue: false },
  { type: 'count', label: 'Count Items', needsValue: false },
];

export default function CalculationSelector({ config, onConfigChange }: CalculationSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [subtractValue, setSubtractValue] = useState(config.subtractValue?.toString() || '');

  const currentType = calculationTypes.find(t => t.type === config.type);
  const needsValue = currentType?.needsValue || false;

  const handleTypeSelect = (type: CalculationType) => {
    const newConfig: CalculationConfig = { type };
    if (type === 'subtract' && subtractValue) {
      newConfig.subtractValue = parseFloat(subtractValue) || 0;
    }
    onConfigChange(newConfig);
    setShowModal(false);
  };

  const handleSubtractValueChange = (value: string) => {
    setSubtractValue(value);
    const numValue = parseFloat(value) || 0;
    onConfigChange({ ...config, subtractValue: numValue });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selector} onPress={() => setShowModal(true)}>
        <Calculator size={20} color="#F3DFA2" />
        <Text style={styles.selectorText}>{currentType?.label || 'Sum'}</Text>
        <ChevronDown size={20} color="#F3DFA2" />
      </TouchableOpacity>

      {needsValue && (
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Value:</Text>
          <TextInput
            style={styles.valueInput}
            value={subtractValue}
            onChangeText={handleSubtractValueChange}
            placeholder="0.00"
            placeholderTextColor="#A7754D"
            keyboardType="numeric"
            selectionColor="#A7754D"
          />
        </View>
      )}

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Calculation</Text>
            {calculationTypes.map((type) => (
              <TouchableOpacity
                key={type.type}
                style={[
                  styles.modalOption,
                  config.type === type.type && styles.modalOptionSelected
                ]}
                onPress={() => handleTypeSelect(type.type)}
              >
                <Text style={[
                  styles.modalOptionText,
                  config.type === type.type && styles.modalOptionTextSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#426B69',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#426B69',
  },
  selectorText: {
    color: '#F3DFA2',
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  valueLabel: {
    color: '#F3DFA2',
    fontSize: 16,
    marginRight: 12,
  },
  valueInput: {
    color: '#F3DFA2',
    backgroundColor: '#231F20',
    borderWidth: 1,
    borderColor: '#426B69',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 100,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#231F20',
    borderRadius: 12,
    padding: 20,
    minWidth: 250,
    borderWidth: 1,
    borderColor: '#426B69',
  },
  modalTitle: {
    color: '#F3DFA2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalOptionSelected: {
    backgroundColor: '#426B69',
  },
  modalOptionText: {
    color: '#F3DFA2',
    fontSize: 16,
  },
  modalOptionTextSelected: {
    fontWeight: 'bold',
  },
});