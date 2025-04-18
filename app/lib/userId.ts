/**
 * Utilities for managing user information
 */

// User information interface
export interface UserInfo {
  userId: string;
  fullName?: string;
  email?: string;
  firstName?: string;
}

// Generate a random ID for users
export function generateUserId(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Store user ID in local storage
export function storeUserId(userId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('redemptiveGiftsUserId', userId);
  }
}

// Store user information in local storage
export function storeUserInfo(userInfo: UserInfo): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('redemptiveGiftsUserInfo', JSON.stringify(userInfo));
    // Also store the userId separately for backward compatibility
    localStorage.setItem('redemptiveGiftsUserId', userInfo.userId);
  }
}

// Clear user information but keep the ID
export function clearUserInfo(): void {
  if (typeof window !== 'undefined') {
    // Remove the user info but keep the ID for tracking purposes
    localStorage.removeItem('redemptiveGiftsUserInfo');
  }
}

// Extract first name from full name
export function extractFirstName(fullName: string): string {
  return fullName.split(' ')[0] || fullName;
}

// Retrieve user ID from local storage or generate a new one
export function getUserId(): string {
  if (typeof window !== 'undefined') {
    const storedId = localStorage.getItem('redemptiveGiftsUserId');
    if (storedId) {
      return storedId;
    }
    const newId = generateUserId();
    storeUserId(newId);
    return newId;
  }
  return generateUserId(); // Fallback for SSR
}

// Retrieve user information from local storage
export function getUserInfo(): UserInfo | null {
  if (typeof window !== 'undefined') {
    const storedInfo = localStorage.getItem('redemptiveGiftsUserInfo');
    if (storedInfo) {
      return JSON.parse(storedInfo) as UserInfo;
    }

    // If we only have the userId (backward compatibility)
    const userId = getUserId();
    return { userId };
  }
  return null; // Fallback for SSR
}