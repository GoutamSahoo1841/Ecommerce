'use client'

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  rating: number
  reviews: number
  inStock: boolean
  badge?: string
  colors?: string[]
  sizes?: string[]
}

export interface CartItem extends Product {
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

export interface WishlistItem extends Product {}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  date: string
  shippingAddress: {
    name: string
    address: string
    city: string
    zip: string
  }
}

interface StoreState {
  cart: CartItem[]
  wishlist: WishlistItem[]
  recentlyViewed: Product[]
  orders: Order[]
  user: {
    name: string
    email: string
    avatar?: string
  } | null
}

type StoreAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'ADD_TO_RECENTLY_VIEWED'; payload: Product }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_USER'; payload: StoreState['user'] }
  | { type: 'LOAD_STATE'; payload: Partial<StoreState> }

const initialState: StoreState = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  orders: [],
  user: null,
}

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.cart.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.selectedColor === action.payload.selectedColor &&
          item.selectedSize === action.payload.selectedSize
      )
      if (existingIndex > -1) {
        const newCart = [...state.cart]
        newCart[existingIndex].quantity += action.payload.quantity
        return { ...state, cart: newCart }
      }
      return { ...state, cart: [...state.cart, action.payload] }
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((item) => item.id !== action.payload) }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'ADD_TO_WISHLIST': {
      const exists = state.wishlist.some((item) => item.id === action.payload.id)
      if (exists) return state
      return { ...state, wishlist: [...state.wishlist, action.payload] }
    }
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.payload),
      }
    case 'ADD_TO_RECENTLY_VIEWED': {
      const filtered = state.recentlyViewed.filter(
        (item) => item.id !== action.payload.id
      )
      return {
        ...state,
        recentlyViewed: [action.payload, ...filtered].slice(0, 10),
      }
    }
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'LOAD_STATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const StoreContext = createContext<{
  state: StoreState
  dispatch: React.Dispatch<StoreAction>
  cartTotal: number
  cartCount: number
} | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  useEffect(() => {
    const stored = localStorage.getItem('nova-store')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        dispatch({ type: 'LOAD_STATE', payload: parsed })
      } catch (e) {
        console.error('Failed to load state:', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('nova-store', JSON.stringify(state))
  }, [state])

  const cartTotal = state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const cartCount = state.cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <StoreContext.Provider value={{ state, dispatch, cartTotal, cartCount }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
