import { create } from 'zustand';

// Notification types
export type NotificationType = 'success' | 'error' | 'info';

// Notification interface
export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  read: boolean;
  duration?: number;
}

// Store interface
interface NotificationState {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType, duration?: number) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  dismissAll: () => void;
  clearAll: () => void;
  unreadCount: () => number;
}

// Generate unique ID for notifications
const generateId = () => Math.random().toString(36).substring(2, 9);

// Default notification duration in milliseconds
export const DEFAULT_NOTIFICATION_DURATION = 5000;

// Create the notification store
export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  
  // Add a new notification and return its ID
  addNotification: (message, type, duration) => {
    const id = generateId();
    const notification: Notification = {
      id,
      message,
      type,
      timestamp: Date.now(),
      read: false,
      duration: duration || DEFAULT_NOTIFICATION_DURATION
    };
    
    set((state) => ({
      notifications: [...state.notifications, notification]
    }));
    
    return id;
  },
  
  // Remove a notification by ID
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id)
    }));
  },
  
  // Mark a notification as read
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    }));
  },
  
  // Dismiss all notifications (mark all as read)
  dismissAll: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({ ...notification, read: true }))
    }));
  },
  
  // Clear all notifications
  clearAll: () => {
    set({ notifications: [] });
  },
  
  // Get count of unread notifications
  unreadCount: () => {
    return get().notifications.filter(notification => !notification.read).length;
  }
}));

// Helper functions to create different types of notifications
export const notification = {
  success: (message: string, duration?: number) => {
    return useNotificationStore.getState().addNotification(message, 'success', duration);
  },
  error: (message: string, duration?: number) => {
    return useNotificationStore.getState().addNotification(message, 'error', duration);
  },
  info: (message: string, duration?: number) => {
    return useNotificationStore.getState().addNotification(message, 'info', duration);
  }
};
