import { apiClient } from "@/services/apiClient";

export interface UserItem {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  lockedUsers: number;
  newThisWeek: number;
  adminUsers: number;
  regularUsers: number;
  staffUsers: number;
  guideUsers: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CreateUserData {
  username: string;
  password?: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  status?: string;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  status?: string;
  password?: string;
}

export const adminUserService = {
  getUsers: async (params?: {
    keyword?: string;
    role?: string;
    status?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageResponse<UserItem>> => {
    const response = await apiClient.get<PageResponse<UserItem>>("/api/admin/users", { params });
    return response.data;
  },

  getUserStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>("/api/admin/users/stats");
    return response.data;
  },

  getUserById: async (id: number): Promise<UserItem> => {
    const response = await apiClient.get<UserItem>(`/api/admin/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserData): Promise<UserItem> => {
    const response = await apiClient.post<UserItem>("/api/admin/users", data);
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserData): Promise<UserItem> => {
    const response = await apiClient.put<UserItem>(`/api/admin/users/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<UserItem> => {
    const response = await apiClient.patch<UserItem>(`/api/admin/users/${id}/status`, { status });
    return response.data;
  },

  updateRole: async (id: number, role: string): Promise<UserItem> => {
    const response = await apiClient.patch<UserItem>(`/api/admin/users/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/admin/users/${id}`);
  },
};
