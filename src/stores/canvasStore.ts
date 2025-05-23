import { create } from 'zustand';
import { BuildingBlockType } from '../types/canvas';

export interface CanvasComponent {
  id: string;
  type: BuildingBlockType | string; // Allow composite types like 'asset-operating'
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
}

export const useCanvasStore = create<CanvasState>((set) => ({
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
    }))
}));