import apiClient from './apiClient';

export interface CreateExpenseDto {
  name: string;
  category: string;
  amount: number;
  expense_date: string;
  description?: string;
  notes?: string;
}

export interface UpdateExpenseDto {
  name?: string;
  category?: string;
  amount?: number;
  expense_date?: string;
  notes?: string;
}

export interface ExpenseFilters {
  category?: string;
  date_from?: string;
  date_to?: string;
}

export const getExpenses = (filters?: ExpenseFilters) =>
  apiClient.get('/expenses/', { params: filters });

export const createExpense = (data: CreateExpenseDto) =>
  apiClient.post('/expenses/', data);

export const updateExpense = (id: string, data: UpdateExpenseDto) =>
  apiClient.put(`/expenses/${id}`, data);

export const deleteExpense = (id: string) =>
  apiClient.delete(`/expenses/${id}`);
