import apiClient from './apiClient';

export const getReportSummary = (from: string, to: string) =>
  apiClient.get('/reports/summary', { params: { from, to } });

export const getSalesChart = (from: string, to: string) =>
  apiClient.get('/reports/sales-chart', { params: { from, to } });

export const getExpenseBreakdown = (from: string, to: string) =>
  apiClient.get('/reports/expense-breakdown', { params: { from, to } });

export const getTopServices = (from: string, to: string) =>
  apiClient.get('/reports/top-services', { params: { from, to } });

export const exportBillsCsv = (from: string, to: string) =>
  apiClient.get('/reports/export/bills', { params: { from, to }, responseType: 'blob' });

export const exportExpensesCsv = (from: string, to: string) =>
  apiClient.get('/reports/export/expenses', { params: { from, to }, responseType: 'blob' });
