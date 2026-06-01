import { create } from 'zustand'

export interface Product {
  id: number
  name: string
  nameEn: string
  effect: string
  effectEn: string
  price: number
  gradient: string
}

interface CartItem extends Product {
  qty: number
}

interface AppStore {
  // Cart
  items: CartItem[]
  cartOpen: boolean
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  total: () => number
  count: () => number
  setCartOpen: (v: boolean) => void

  // Toast
  toastMsg: string | null
  showToast: (msg: string) => void
}

export const useStore = create<AppStore>((set, get) => ({
  items: [],
  cartOpen: false,

  setCartOpen: (v) => set({ cartOpen: v }),

  addItem: (product) => {
    const items = get().items
    const existing = items.find((i) => i.id === product.id)
    if (existing) {
      set({
        items: items.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        ),
      })
    } else {
      set({ items: [...items, { ...product, qty: 1 }] })
    }
  },

  removeItem: (id) =>
    set({ items: get().items.filter((i) => i.id !== id) }),

  total: () =>
    get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

  count: () =>
    get().items.reduce((sum, i) => sum + i.qty, 0),

  toastMsg: null,
  showToast: (msg) => {
    set({ toastMsg: msg })
    setTimeout(() => set({ toastMsg: null }), 2500)
  },
}))
