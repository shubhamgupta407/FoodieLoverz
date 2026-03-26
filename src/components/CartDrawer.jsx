import { Minus, Plus, X, ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartDrawer.css";

export default function CartDrawer() {
  const { cartItems, cartTotal, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = cartItems.length > 0 ? 40 : 0;
  const grandTotal = cartTotal + deliveryFee;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="overlay" onClick={() => setIsCartOpen(false)} />
      <aside className="cart-drawer slide-in-right">
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={22} />
            <h2>Your Cart</h2>
          </div>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <span>Add some delicious items!</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">₹{item.price}</p>
                  </div>
                  <div className="cart-qty">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button className="cart-remove" onClick={() => removeFromCart(item.id)}>
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <div className="cart-footer">
              <button id="checkout-btn" className="btn btn-primary checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
