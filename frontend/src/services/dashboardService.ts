import apiClient from './apiClient';

export const getDashboardSummary = () =>
  apiClient.get('/dashboard/summary');

export const getLowStockItems = () =>
  apiClient.get('/dashboard/low-stock');

export const getWeeklyRevenue = () =>
  apiClient.get('/dashboard/weekly-revenue');
