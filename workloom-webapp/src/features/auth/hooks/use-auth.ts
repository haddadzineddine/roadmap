import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoginCredentials, RegisterCredentials } from '../types/auth.type';
import { authAPI } from '../api/auth';

export const useAuth = () => {
  const { data: session, status } = useSession();

  const queryClient = useQueryClient();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const registeredUser = await authAPI.register(credentials);

      // After successful registration, automatically sign in
      const signInResult = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error('Registration successful but login failed');
      }

      return registeredUser;
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      queryClient.clear();
      router.push('/');
    },
  });

  const login = (credentials: LoginCredentials) => {
    return loginMutation.mutate(credentials);
  };

  const register = (credentials: RegisterCredentials) => {
    return registerMutation.mutate(credentials);
  };

  const logout = () => {
    return logoutMutation.mutate();
  };

  return {
    user: session?.user,
    session,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    login,
    register,
    logout,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  };
};
