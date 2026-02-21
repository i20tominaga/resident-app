// User and Authentication Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'resident' | 'staff';
  buildingId: string;
  floorNumber?: number;
  unitNumber?: string;
  facilitiesOfInterest: string[];
  timePreferences: TimePreference[];
  createdAt: Date;
}

export interface TimePreference {
  startHour: number;
  endHour: number;
  label: string;
}

// Building and Facility Types
export interface Building {
  id: string;
  name: string;
  address: string;
  totalFloors: number;
  totalUnits: number;
  managementCompany: string;
  features: Facility[];
}

export interface Facility {
  id: string;
  name: string;
  buildingId: string;
  floor?: number;
  type: 'parking' | 'gym' | 'lobby' | 'common' | 'rooftop' | 'other';
  description?: string;
}

// Construction/Inspection Event Types
export interface ConstructionEvent {
  id: string;
  buildingId: string;
  title: string;
  description: string;
  type: 'construction' | 'inspection' | 'maintenance' | 'repair';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  affectedFloors: number[];
  affectedFacilities: string[];
  affectedAreas: string[];
  noiseLevel?: 'low' | 'medium' | 'high';
  accessRestrictions: boolean;
  details: string;
  contractor?: string;
  contactPerson?: string;
  contactPhone?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  title: string;
  message: string;
  type: 'event_update' | 'new_event' | 'event_cancelled' | 'schedule_change';
  isRead: boolean;
  createdAt: Date;
}

// FAQ Types
export interface FAQ {
  id: string;
  buildingId: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Question/Inquiry Types
export interface Inquiry {
  id: string;
  userId: string;
  buildingId: string;
  title: string;
  message: string;
  category: string;
  status: 'new' | 'in_progress' | 'resolved';
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Summary Types
export interface DashboardSummary {
  upcomingEvents: ConstructionEvent[];
  ongoingEvents: ConstructionEvent[];
  notifications: Notification[];
  personalizedRelevance: RelevanceScore[];
}

export interface RelevanceScore {
  eventId: string;
  score: number;
  reasons: string[];
}
