import { api } from '@/lib/api-client';
import { AuthResponse, LoginCredentials, RegisterCredentials, RegisterResponse, User } from '../types/auth.type';

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/login', credentials);

    return {
      accessToken: data.accessToken,
      uuid: data.user.uuid,
      name: data.user.name,
      email: data.user.email,
    }
  },

  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    const { data } = await api.post('/users', credentials);

    return {
      message: data.message,
      data: data.data,
    }
  },

  logout: (): Promise<void> => {
    return api.post('/auth/logout');
  },

  getMe: (): Promise<User> => {
    return api.get('/users/me');
  },

  refreshToken: (): Promise<{ token: string }> => {
    return api.post('/auth/refresh');
  },
};
