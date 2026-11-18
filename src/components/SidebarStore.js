import { create } from 'zustand'

const KEY = 'bb-sidebar-collapsed'

/** Collapsed state of the desktop sidebar, remembered per browser. */
export const useSidebarStore = create((set) => ({
  collapsed: false,
  hydrate: () => {
    try {
      set({ collapsed: window.localStorage.getItem(KEY) === '1' })
    } catch {}
  },
  toggle: () =>
    set((state) => {
      const collapsed = !state.collapsed
      try {
        window.localStorage.setItem(KEY, collapsed ? '1' : '0')
      } catch {}
      return { collapsed }
    }),
}))
