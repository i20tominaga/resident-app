import { User, Building, ConstructionEvent, FAQ, Notification } from './types';

// Cache for loaded data
const dataCache: {
  buildings?: Building[];
  users?: User[];
  events?: ConstructionEvent[];
  faqs?: FAQ[];
  notifications?: Notification[];
} = {};

// Convert string dates to Date objects
const convertDatesToObjects = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(convertDatesToObjects);
  }
  
  if (obj !== null && typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        // Convert ISO date strings to Date objects
        converted[key] = new Date(value);
      } else if (value !== null && typeof value === 'object') {
        converted[key] = convertDatesToObjects(value);
      } else {
        converted[key] = value;
      }
    }
    return converted;
  }
  
  return obj;
};

// Load buildings data
export async function loadBuildings(): Promise<Building[]> {
  if (dataCache.buildings) {
    return dataCache.buildings;
  }

  try {
    const response = await fetch('/data/buildings.json');
    if (!response.ok) throw new Error('Failed to load buildings');
    const data = await response.json();
    dataCache.buildings = convertDatesToObjects(data.buildings);
    return dataCache.buildings;
  } catch (error) {
    console.error('Error loading buildings:', error);
    return [];
  }
}

// Load users data
export async function loadUsers(): Promise<User[]> {
  if (dataCache.users) {
    return dataCache.users;
  }

  try {
    const response = await fetch('/data/users.json');
    if (!response.ok) throw new Error('Failed to load users');
    const data = await response.json();
    dataCache.users = convertDatesToObjects(data.users);
    return dataCache.users;
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

// Load construction events data
export async function loadEvents(): Promise<ConstructionEvent[]> {
  if (dataCache.events) {
    return dataCache.events;
  }

  try {
    const response = await fetch('/data/events.json');
    if (!response.ok) throw new Error('Failed to load events');
    const data = await response.json();
    dataCache.events = convertDatesToObjects(data.events);
    return dataCache.events;
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
}

// Load FAQs data
export async function loadFAQs(): Promise<FAQ[]> {
  if (dataCache.faqs) {
    return dataCache.faqs;
  }

  try {
    const response = await fetch('/data/faqs.json');
    if (!response.ok) throw new Error('Failed to load FAQs');
    const data = await response.json();
    dataCache.faqs = convertDatesToObjects(data.faqs);
    return dataCache.faqs;
  } catch (error) {
    console.error('Error loading FAQs:', error);
    return [];
  }
}

// Load notifications data
export async function loadNotifications(): Promise<Notification[]> {
  if (dataCache.notifications) {
    return dataCache.notifications;
  }

  try {
    const response = await fetch('/data/notifications.json');
    if (!response.ok) throw new Error('Failed to load notifications');
    const data = await response.json();
    dataCache.notifications = convertDatesToObjects(data.notifications);
    return dataCache.notifications;
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await loadUsers();
  return users.find(u => u.email === email);
}

// Get events for a building
export async function getEventsByBuilding(buildingId: string): Promise<ConstructionEvent[]> {
  const events = await loadEvents();
  return events.filter(e => e.buildingId === buildingId);
}

// Get FAQs for a building
export async function getFAQsByBuilding(buildingId: string): Promise<FAQ[]> {
  const faqs = await loadFAQs();
  return faqs.filter(f => f.buildingId === buildingId).sort((a, b) => a.order - b.order);
}

// Get notifications for a user
export async function getNotificationsByUser(userId: string): Promise<Notification[]> {
  const notifications = await loadNotifications();
  return notifications.filter(n => n.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Invalidate cache (useful for updates)
export function invalidateCache() {
  dataCache.buildings = undefined;
  dataCache.users = undefined;
  dataCache.events = undefined;
  dataCache.faqs = undefined;
  dataCache.notifications = undefined;
}
