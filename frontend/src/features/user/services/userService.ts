import { apiClient } from "@/services/apiClient";
import { User } from "@/features/auth/schemas/auth";

export interface UserProfileUpdateRequest {
  fullName?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}

export const userService = {
  /**
   * Update current user profile
   */
  async updateProfile(data: UserProfileUpdateRequest): Promise<User> {
    const response = await apiClient.put<User>("/api/users/me", data);
    return response.data;
  },

  /**
   * Change current user password
   */
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>("/api/users/change-password", data);
    return response.data;
  },
};
