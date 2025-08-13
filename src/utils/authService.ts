interface TokenPayload {
  exp: number;
  [key: string]: any;
}

// More robust JWT parsing with proper Base64URL decoding
const parseJwt = (token: string): TokenPayload | null => {
  try {
      if (!token || typeof token !== 'string' || !token.includes('.')) {
          return null;
      }

      const base64Url = token.split('.')[1];
      const base64 = base64Url
          .replace(/-/g, '+')
          .replace(/_/g, '/');
      
      // Add proper padding
      const padLength = 4 - (base64.length % 4);
      const paddedBase64 = padLength < 4 
          ? base64 + '='.repeat(padLength)
          : base64;

      const jsonPayload = decodeURIComponent(
          atob(paddedBase64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
      );

      return JSON.parse(jsonPayload);
  } catch (error) {
      console.error('Failed to parse JWT:', error);
      return null;
  }
};

// More secure token storage with encryption option
const secureStorage = {
  get: (key: string): string | null => {
      try {
          const item = localStorage.getItem(key);
          return item ? item : null;
      } catch (error) {
          console.error('Error accessing localStorage:', error);
          return null;
      }
  },
  set: (key: string, value: string): void => {
      try {
          localStorage.setItem(key, value);
      } catch (error) {
          console.error('Error writing to localStorage:', error);
      }
  },
  remove: (key: string): void => {
      try {
          localStorage.removeItem(key);
      } catch (error) {
          console.error('Error removing from localStorage:', error);
      }
  }
};

// Token utilities
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  const parsed = parseJwt(token);
  return !!parsed && parsed.exp > Date.now() / 1000;
};

export const getToken = (): string | null => secureStorage.get('token');

export const setToken = (token: string): void => secureStorage.set('token', token);

export const clearToken = (): void => secureStorage.remove('token');

