import apiClient from './apiClient';

export const getServices = () => apiClient.get('/services/');
export const getAllServices = () => apiClient.get('/services/all');
