import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOutlet } from "../context/OutletContext";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import { ChevronRight, ShoppingBag, ArrowLeft } from "lucide-react";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount } = useCart();
  const { selectedOutlet } = useOutlet();
  const navigate = useNavigate();

  const deliveryFee = 40;
  const grandTotal = cartTotal + deliveryFee;

  if (cartItems.length === 0) {
    navigate("/menu");
    return null;
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="checkout-page">
        <div className="container checkout-container">
          <button className="back-btn" onClick={() => navigate("/menu")}>
            <ArrowLeft size={18} /> Back to Menu
          </button>
          <h1 className="page-title">Order Summary</h1>

          <div className="checkout-grid">
            <div className="checkout-items card">
              <div className="checkout-card-header">
                <ShoppingBag size={20} color="var(--primary)" />
                <h2>Your Items ({cartCount})</h2>
              </div>
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-item-info">
                    <p className="checkout-item-name">{item.name}</p>
                    <p className="checkout-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="checkout-item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="checkout-summary-col">
              <div className="checkout-outlet card">
                <p className="outlet-label">Delivering from</p>
                <p className="outlet-value">
                  {selectedOutlet?.emoji} FoodieLoverz {selectedOutlet?.name}
                </p>
                <p className="outlet-addr">{selectedOutlet?.subtitle}</p>
              </div>

              <div className="checkout-total card">
                <h2>Bill Details</h2>
                <div className="bill-row"><span>Item Total</span><span>₹{cartTotal}</span></div>
                <div className="bill-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
                <div className="bill-divider" />
                <div className="bill-row grand"><span>Grand Total</span><span>₹{grandTotal}</span></div>
                <button
                  id="continue-address-btn"
                  className="btn btn-primary continue-btn"
                  onClick={() => navigate("/address")}
                >
                  Continue to Address <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
