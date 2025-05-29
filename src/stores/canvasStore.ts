import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CanvasComponent {
  id: string;
  type: string; // Allow composite types like 'asset-operating'
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  type: string;
}

interface CanvasState {
  components: CanvasComponent[];
  connections: Connection[];
  addComponent: (component: CanvasComponent) => void;
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
  removeComponent: (id: string) => void;
  addConnection: (connection: Connection) => void;
  removeConnection: (id: string) => void;
  // New utility functions
  resetCanvas: () => void;
  exportCanvas: () => string;
  importCanvas: (jsonData: string) => boolean;
}

// Storage key for localStorage
const CANVAS_STORAGE_KEY = 'canvas-store';

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      components: [],
      connections: [],
      
      addComponent: (component) => 
        set((state) => ({
          components: [...state.components, component]
        })),
        
      updateComponent: (id, updates) =>
        set((state) => ({
          components: state.components.map((component) =>
            component.id === id ? { ...component, ...updates } : component
          )
        })),
        
      removeComponent: (id) =>
        set((state) => ({
          components: state.components.filter((component) => component.id !== id),
          connections: state.connections.filter(
            (connection) => connection.from !== id && connection.to !== id
          )
        })),
        
      addConnection: (connection) =>
        set((state) => ({
          connections: [...state.connections, connection]
        })),
        
      removeConnection: (id) =>
        set((state) => ({
          connections: state.connections.filter((connection) => connection.id !== id)
        })),
      
      // Reset the canvas to empty state
      resetCanvas: () => 
        set(() => ({
          components: [],
          connections: []
        })),
      
      // Export canvas data as JSON string
      exportCanvas: () => {
        try {
          const state = get();
          const exportData = {
            components: state.components,
            connections: state.connections,
          };
          return JSON.stringify(exportData, null, 2);
        } catch (error) {
          console.error('Error exporting canvas data:', error);
          return '{}';
        }
      },
      
      // Import canvas data from JSON string
      importCanvas: (jsonData: string) => {
        try {
          const parsedData = JSON.parse(jsonData);
          
          // Validate the imported data structure
          if (!parsedData.components || !Array.isArray(parsedData.components) || 
              !parsedData.connections || !Array.isArray(parsedData.connections)) {
            throw new Error('Invalid canvas data format');
          }
          
          set(() => ({
            components: parsedData.components,
            connections: parsedData.connections
          }));
          
          return true;
        } catch (error) {
          console.error('Error importing canvas data:', error);
          return false;
        }
      }
    }),
    {
      name: CANVAS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only persist these state fields
      partialize: (state) => ({
        components: state.components,
        connections: state.connections,
      }),
      // Handle storage errors gracefully
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Canvas state successfully hydrated from localStorage');
        } else {
          console.warn('Failed to rehydrate canvas state from localStorage');
        }
      },
    }
  )
);
