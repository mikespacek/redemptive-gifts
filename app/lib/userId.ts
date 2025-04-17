/**
 * Utilities for managing anonymous user IDs
 */

// Generate a random ID for anonymous users
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