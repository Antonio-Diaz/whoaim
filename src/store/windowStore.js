import { create } from 'zustand';

const DEFAULT_WINDOWS = {
  profile:    { title: 'My Computer', isOpen: false, isMinimized: false, isMaximized: false, x: 80,  y: 60,  width: 420, height: 300, zIndex: 10 },
  curriculum: { title: 'Curriculum.txt - Notepad', isOpen: false, isMinimized: false, isMaximized: false, x: 140, y: 80,  width: 540, height: 440, zIndex: 10 },
  projects:   { title: 'Projects', isOpen: false, isMinimized: false, isMaximized: false, x: 200, y: 100, width: 580, height: 400, zIndex: 10 },
  skills:     { title: 'Skills', isOpen: false, isMinimized: false, isMaximized: false, x: 160, y: 90,  width: 500, height: 380, zIndex: 10 },
  contact:    { title: 'Contact - Outlook Express', isOpen: false, isMinimized: false, isMaximized: false, x: 120, y: 70,  width: 460, height: 340, zIndex: 10 },
  recycle:    { title: 'Recycle Bin', isOpen: false, isMinimized: false, isMaximized: false, x: 100, y: 80,  width: 380, height: 240, zIndex: 10 },
};

export const useWindowStore = create((set, get) => ({
  windows: { ...DEFAULT_WINDOWS },
  maxZIndex: 10,
  startMenuOpen: false,

  openWindow: (id) => {
    const state = get();
    const newZ = state.maxZIndex + 1;
    set((s) => ({
      maxZIndex: newZ,
      startMenuOpen: false,
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], isOpen: true, isMinimized: false, zIndex: newZ },
      },
    }));
  },

  closeWindow: (id) => {
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...DEFAULT_WINDOWS[id], isOpen: false },
      },
    }));
  },

  minimizeWindow: (id) => {
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], isMinimized: true },
      },
    }));
  },

  maximizeWindow: (id) => {
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], isMaximized: !s.windows[id].isMaximized },
      },
    }));
  },

  focusWindow: (id) => {
    const state = get();
    const newZ = state.maxZIndex + 1;
    set((s) => ({
      maxZIndex: newZ,
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], isMinimized: false, zIndex: newZ },
      },
    }));
  },

  updateWindowPosition: (id, x, y) => {
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], x, y },
      },
    }));
  },

  updateWindowSize: (id, width, height) => {
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], width, height },
      },
    }));
  },

  toggleStartMenu: () => {
    set((s) => ({ startMenuOpen: !s.startMenuOpen }));
  },

  closeStartMenu: () => {
    set({ startMenuOpen: false });
  },
}));
