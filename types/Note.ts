export interface TableRow {
  id: string;
  item: string;
  amount: string;
}

export interface Note {
  id: string;
  title: string;
  createdAt: string;
  table: TableRow[];
  total: number;
  split?: {
    people: number;
    perPerson: number;
  };
}