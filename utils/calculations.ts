import { TableRow } from '@/types/Note';

export type CalculationType = 'sum' | 'subtract' | 'percentage' | 'average' | 'count';

export interface CalculationConfig {
  type: CalculationType;
  subtractValue?: number;
}

export const calculateTotal = (table: TableRow[]): number => {
  return table.reduce((sum, row) => {
    const amount = parseFloat(row.amount) || 0;
    return sum + amount;
  }, 0);
};

export const calculateWithFunction = (table: TableRow[], config: CalculationConfig): number => {
  const amounts = table
    .map(row => parseFloat(row.amount) || 0)
    .filter(amount => amount !== 0);

  if (amounts.length === 0) return 0;

  switch (config.type) {
    case 'sum':
      return amounts.reduce((sum, amount) => sum + amount, 0);
    
    case 'subtract': {
      const sum = amounts.reduce((sum, amount) => sum + amount, 0);
      const subtractValue = config.subtractValue || 0;
      return subtractValue - sum;
    }
    
    case 'percentage': {
      const sum = amounts.reduce((sum, amount) => sum + amount, 0);
      return sum; // Will be displayed as percentage breakdown
    }
    
    case 'average': {
      const avg = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
      return Math.round(avg * 100) / 100;
    }
    
    case 'count':
      return amounts.length;
    
    default:
      return amounts.reduce((sum, amount) => sum + amount, 0);
  }
};

export const calculatePerPersonSplit = (total: number, people: number): number => {
  if (people <= 0) return 0;
  return Math.round((total / people) * 100) / 100;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount: number): string => {
  return amount.toFixed(2);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};