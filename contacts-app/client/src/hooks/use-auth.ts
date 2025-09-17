import { useState, useEffect } from 'react';
import type { User } from '@shared/schema';

const COOKIE_DURATION = 20; // minutes

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    readCookie();
  }, []);

  const saveCookie = (userData: User) => {
    const minutes = COOKIE_DURATION;
    const date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    const expires = `;expires=${date.toUTCString()};path=/`;
    
    // Set separate cookies for each field with proper path
    document.cookie = `firstName=${userData.firstName}${expires}`;
    document.cookie = `lastName=${userData.lastName}${expires}`;
    document.cookie = `userId=${userData.id}${expires}`;
    
    console.log("Cookies set:", { firstName: userData.firstName, lastName: userData.lastName, userId: userData.id });
    setUser(userData);
  };

  const readCookie = () => {
    setIsLoading(true);
    let userId = -1;
    let firstName = "";
    let lastName = "";

    // Helper function to get cookie value by name
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return "";
    };

    firstName = getCookie("firstName") || "";
    lastName = getCookie("lastName") || "";
    const userIdStr = getCookie("userId") || "";
    userId = userIdStr ? parseInt(userIdStr) : -1;

    console.log("Reading cookies:", { firstName, lastName, userId });

    if (userId > 0 && firstName && lastName) {
      console.log("Valid user found in cookies");
      setUser({ id: userId, firstName, lastName });
    } else {
      console.log("No valid user in cookies");
      setUser(null);
    }
    setIsLoading(false);
  };

  const logout = () => {
    // Clear all auth cookies
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    setUser(null);
  };

  return {
    user,
    isLoading,
    login: saveCookie,
    logout,
  };
}
