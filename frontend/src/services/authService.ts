import apiClient from './apiClient';

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    phone: string;
    role: string;
  };
}

export interface UserData {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export const loginUser = async (payload: LoginPayload): Promise<LoginResponseData> => {
  const response = await apiClient.post<LoginResponseData>('/auth/login', payload);
  return response.data;
};

export const getMe = async (): Promise<UserData> => {
  const response = await apiClient.get<UserData>('/auth/me');
  return response.data;
};
