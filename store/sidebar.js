import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUIStore = create(
  persist(
    (set) => ({
      isCollapsed: true,
      isMobileMenuOpen: false,
      toggleSidebar: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
    }),
    {
      name: "sidebar-storage", // unique name for localStorage key
      getStorage: () => localStorage, // use localStorage for persistence
      partialize: (state) => ({ isCollapsed: state.isCollapsed }), // Only persist desktop sidebar state
    }
  )
);
