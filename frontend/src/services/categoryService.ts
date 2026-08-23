import { apiClient } from './apiClient';
import type { Category } from '@/constants/mockData';

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  name: string;
  description: string;
}

export function mapCategoryResponseToCategory(res: CategoryResponse): Category {
  return {
    id: res.id,
    name: res.name,
    description: res.description || '',
    active: true,
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get<CategoryResponse[]>('/api/categories');
    return response.data.map(mapCategoryResponseToCategory);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function getAdminCategories(): Promise<CategoryResponse[]> {
  const response = await apiClient.get<CategoryResponse[]>('/api/admin/categories');
  return response.data;
}

export async function getAdminCategoryById(id: number): Promise<CategoryResponse> {
  const response = await apiClient.get<CategoryResponse>(`/api/admin/categories/${id}`);
  return response.data;
}

export async function createCategory(data: CategoryRequest): Promise<CategoryResponse> {
  const response = await apiClient.post<CategoryResponse>('/api/admin/categories', data);
  return response.data;
}

export async function updateCategory(id: number, data: CategoryRequest): Promise<CategoryResponse> {
  const response = await apiClient.put<CategoryResponse>(`/api/admin/categories/${id}`, data);
  return response.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/api/admin/categories/${id}`);
}

export const categoryService = {
  getCategories,
  getAdminCategories,
  getAdminCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
