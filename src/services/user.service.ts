import apiClient from '../config/axios.config';
import { StandardResponse } from '../types/api.types';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
   mobile?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  confirmPassword?: string;
}

interface UpdateUserData {
  status?: boolean;
  role?: string;
}

export const userService = {
  getProfile: async (): Promise<StandardResponse<User>> => {
  const response = await apiClient.get<StandardResponse<User>>('/protected/profile');
  return response.data;
},

  updateProfile: async (data: UpdateProfileData): Promise<StandardResponse<User>> => {
    const response = await apiClient.put<StandardResponse<User>>('/user/profile', data);
    return response.data;
  },

  // User Management APIs
  getAllUsers: async (): Promise<StandardResponse<User[]>> => {
    const response = await apiClient.get<StandardResponse<User[]>>('/user-management/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<StandardResponse<User>> => {
    const response = await apiClient.get<StandardResponse<User>>(`/user-management/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserData): Promise<StandardResponse<User>> => {
    const response = await apiClient.put<StandardResponse<User>>(`/user-management/users/${id}`, data);
    return response.data;
  },

  updateUserStatus: async (id: string, status: boolean): Promise<StandardResponse<User>> => {
    const response = await apiClient.put<StandardResponse<User>>(`/user-management/users/${id}/status`, { status });
    return response.data;
  },

  updateUserRole: async (id: string, role: string): Promise<StandardResponse<User>> => {
    const response = await apiClient.put<StandardResponse<User>>(`/user-management/users/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id: string): Promise<StandardResponse<null>> => {
    const response = await apiClient.delete<StandardResponse<null>>(`/user-management/users/${id}`);
    return response.data;
  },

  createAdminUser: async (data: any): Promise<StandardResponse<User>> => {
    const response = await apiClient.post<StandardResponse<User>>(`/user-management/admin`, data);
    return response.data;
  },

  createCmsUser: async (data: any): Promise<StandardResponse<User>> => {
    const response = await apiClient.post<StandardResponse<User>>(`/user-management/cms`, data);
    return response.data;
  },
};