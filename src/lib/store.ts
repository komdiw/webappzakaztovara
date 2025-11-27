import { create } from 'zustand'

export interface OrderItem {
  id: string
  url: string
  photo: string | null
  quantity: number
  color: string
  size: string
  price: number
}

interface OrderStore {
  items: OrderItem[]
  addItem: () => void
  updateItem: (id: string, field: keyof OrderItem, value: any) => void
  removeItem: (id: string) => void
  clearItems: () => void
  getTotalAmount: () => number
}

export const useOrderStore = create<OrderStore>()((set, get) => ({
  items: [
    {
      id: '1',
      url: '',
      photo: null,
      quantity: 1,
      color: '',
      size: '',
      price: 0
    }
  ],
  
  addItem: () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      url: '',
      photo: null,
      quantity: 1,
      color: '',
      size: '',
      price: 0
    }
    set((state) => ({
      items: [...state.items, newItem]
    }))
  },
  
  updateItem: (id: string, field: keyof OrderItem, value: any) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  },
  
  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.length > 1 ? state.items.filter((item) => item.id !== id) : state.items
    }))
  },
  
  clearItems: () => {
    set({
      items: [
        {
          id: '1',
          url: '',
          photo: null,
          quantity: 1,
          color: '',
          size: '',
          price: 0
        }
      ]
    })
  },
  
  getTotalAmount: () => {
    const { items } = get()
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }
}))