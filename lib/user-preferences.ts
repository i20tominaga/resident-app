import { User, TimePreference } from './types';

/**
 * User preference storage and management
 * In a real app, this would be backed by a database
 */

const STORAGE_KEY = 'user_preferences';

export interface UserPreferences {
  userId: string;
  facilitiesOfInterest: string[];
  timePreferences: TimePreference[];
  notificationSettings: {
    eventUpdates: boolean;
    newEvents: boolean;
    scheduleChanges: boolean;
    highNoiseEvents: boolean;
    newFAQ: boolean;
  };
  minRelevanceScore: number; // 0-100, threshold for personalized events
}

/**
 * Load user preferences from storage
 */
export function loadUserPreferences(userId: string): UserPreferences | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const prefs = JSON.parse(stored);
    return prefs.userId === userId ? prefs : null;
  } catch {
    return null;
  }
}

/**
 * Save user preferences to storage
 */
export function saveUserPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    console.error('Failed to save user preferences');
  }
}

/**
 * Create default preferences for a user
 */
export function createDefaultPreferences(userId: string, user?: User): UserPreferences {
  return {
    userId,
    facilitiesOfInterest: user?.facilitiesOfInterest || [],
    timePreferences: user?.timePreferences || [],
    notificationSettings: {
      eventUpdates: true,
      newEvents: true,
      scheduleChanges: true,
      highNoiseEvents: true,
      newFAQ: false,
    },
    minRelevanceScore: 20, // Default: show events with relevance >= 20%
  };
}

/**
 * Update specific notification settings
 */
export function updateNotificationSettings(
  userId: string,
  settings: Partial<UserPreferences['notificationSettings']>
): UserPreferences {
  const existing = loadUserPreferences(userId) || createDefaultPreferences(userId);
  const updated = {
    ...existing,
    notificationSettings: {
      ...existing.notificationSettings,
      ...settings,
    },
  };
  saveUserPreferences(updated);
  return updated;
}

/**
 * Add facility to interests
 */
export function addFacilityOfInterest(userId: string, facilityId: string): UserPreferences {
  const existing = loadUserPreferences(userId) || createDefaultPreferences(userId);
  if (!existing.facilitiesOfInterest.includes(facilityId)) {
    existing.facilitiesOfInterest.push(facilityId);
    saveUserPreferences(existing);
  }
  return existing;
}

/**
 * Remove facility from interests
 */
export function removeFacilityOfInterest(userId: string, facilityId: string): UserPreferences {
  const existing = loadUserPreferences(userId) || createDefaultPreferences(userId);
  existing.facilitiesOfInterest = existing.facilitiesOfInterest.filter(id => id !== facilityId);
  saveUserPreferences(existing);
  return existing;
}

/**
 * Add time preference
 */
export function addTimePreference(
  userId: string,
  preference: TimePreference
): UserPreferences {
  const existing = loadUserPreferences(userId) || createDefaultPreferences(userId);
  // Check if preference already exists
  const exists = existing.timePreferences.some(
    p => p.startHour === preference.startHour && p.endHour === preference.endHour
  );
  if (!exists) {
    existing.timePreferences.push(preference);
    saveUserPreferences(existing);
  }
  return existing;
}

/**
 * Remove time preference
 */
export function removeTimePreference(
  userId: string,
  index: number
): UserPreferences {
  const existing = loadUserPreferences(userId) || createDefaultPreferences(userId);
  existing.timePreferences = existing.timePreferences.filter((_, i) => i !== index);
  saveUserPreferences(existing);
  return existing;
}

/**
 * Update relevance threshold
 */
export function updateRelevanceThreshold(userId: string, score: number): UserPreferences {
  const existing = loadUserPreferences(userId) || createDefaultPreferences(userId);
  existing.minRelevanceScore = Math.max(0, Math.min(100, score));
  saveUserPreferences(existing);
  return existing;
}

/**
 * Get all preferences with defaults
 */
export function getUserPreferences(userId: string): UserPreferences {
  return loadUserPreferences(userId) || createDefaultPreferences(userId);
}
