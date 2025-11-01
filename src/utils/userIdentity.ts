/**
 * User Identity Management
 * Generates and maintains a persistent userId across sessions and channels (text chat + voice)
 */

const USER_ID_KEY = 'aiprl_user_id';
const CONVERSATION_ID_KEY = 'aiprl_conversation_id';

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get or create a persistent user ID
 * This ID will be shared across text chat and voice agent
 */
export function getUserId(): string {
  try {
    // Try to get existing userId from localStorage
    let userId = localStorage.getItem(USER_ID_KEY);
    
    if (!userId) {
      // Generate new userId if none exists
      userId = generateUserId();
      localStorage.setItem(USER_ID_KEY, userId);
      console.log('[UserIdentity] Created new userId:', userId);
    } else {
      console.log('[UserIdentity] Retrieved existing userId:', userId);
    }
    
    return userId;
  } catch (error) {
    // Fallback if localStorage is not available
    console.error('[UserIdentity] localStorage not available:', error);
    return generateUserId();
  }
}

/**
 * Store conversation ID returned from backend
 */
export function setConversationId(conversationId: string): void {
  try {
    localStorage.setItem(CONVERSATION_ID_KEY, conversationId);
    console.log('[UserIdentity] Stored conversationId:', conversationId);
  } catch (error) {
    console.error('[UserIdentity] Failed to store conversationId:', error);
  }
}

/**
 * Get stored conversation ID
 */
export function getConversationId(): string | null {
  try {
    return localStorage.getItem(CONVERSATION_ID_KEY);
  } catch (error) {
    console.error('[UserIdentity] Failed to retrieve conversationId:', error);
    return null;
  }
}

/**
 * Clear user identity (for testing or logout)
 */
export function clearUserIdentity(): void {
  try {
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(CONVERSATION_ID_KEY);
    console.log('[UserIdentity] Cleared user identity');
  } catch (error) {
    console.error('[UserIdentity] Failed to clear user identity:', error);
  }
}

/**
 * Get user identity info for debugging
 */
export function getUserIdentityInfo() {
  return {
    userId: getUserId(),
    conversationId: getConversationId(),
  };
}



