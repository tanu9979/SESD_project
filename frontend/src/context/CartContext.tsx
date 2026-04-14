import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCart, addToCart, removeFromCart } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: any[];
  cartCount: number;
  addItem: (bookId: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);
  const { isLoggedIn } = useAuth();

  const refreshCart = async () => {
    if (!isLoggedIn) { setCart([]); return; }
    const res = await getCart();
    setCart(res.data || []);
  };

  useEffect(() => { refreshCart(); }, [isLoggedIn]);

  const addItem = async (bookId: string) => {
    await addToCart(bookId);
    await refreshCart();
  };

  const removeItem = async (id: string) => {
    await removeFromCart(id);
    await refreshCart();
  };

  return (
    <CartContext.Provider value={{ cart, cartCount: cart.length, addItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
