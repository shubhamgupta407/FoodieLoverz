import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
