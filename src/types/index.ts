export interface User {
  name: string;
  email: string;
  token: string;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  transactionDate: string;
  note: string;
}

export interface Budget {
  id: number;
  category: string;
  monthlyLimit: number;
  month: number;
  year: number;
}

export interface BudgetStatus {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  exceeded: boolean;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expenseByCategory: Record<string, number>;
}