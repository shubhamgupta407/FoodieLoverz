import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOutlet } from "../context/OutletContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { CreditCard, Smartphone, Banknote, CheckCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import "./PaymentPage.css";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI / GPay / PhonePe", icon: <Smartphone size={22} />, desc: "Pay instantly via any UPI app" },
  { id: "card", label: "Credit / Debit Card", icon: <CreditCard size={22} />, desc: "Visa, Mastercard, Rupay accepted" },
  { id: "cod", label: "Cash on Delivery", icon: <Banknote size={22} />, desc: "Pay when food arrives at door" },
];

export default function PaymentPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { selectedOutlet } = useOutlet();
  const navigate = useNavigate();
  const { state } = useLocation();
  const address = state?.address || {};

  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [loading, setLoading] = useState(false);

  const deliveryFee = 40;
  const grandTotal = cartTotal + deliveryFee;

  const handlePay = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000)); // simulate processing
    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cartItems.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
        total: grandTotal,
        outlet: selectedOutlet?.id || "unknown",
        outletName: selectedOutlet?.name || "",
        address,
        paymentMethod: selectedMethod,
        status: "placed",
        createdAt: serverTimestamp(),
      });
      clearCart();
      navigate("/order-success", { state: { orderId: orderRef.id, outlet: selectedOutlet } });
    } catch {
      // Fallback if Firebase not configured
      const mockId = "ORD-" + Math.random().toString(36).substr(2, 8).toUpperCase();
      clearCart();
      navigate("/order-success", { state: { orderId: mockId, outlet: selectedOutlet } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="payment-page">
        <div className="container payment-container fade-in">
          <button className="back-btn" onClick={() => navigate("/address")}>
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="page-title">Payment</h1>

          <div className="payment-grid">
            <div className="payment-methods card">
              <h2>Choose Payment Method</h2>
              <div className="methods-list">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    id={`pay-${method.id}`}
                    className={`method-card ${selectedMethod === method.id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      hidden
                    />
                    <div className="method-icon">{method.icon}</div>
                    <div className="method-info">
                      <p className="method-label">{method.label}</p>
                      <p className="method-desc">{method.desc}</p>
                    </div>
                    {selectedMethod === method.id && <CheckCircle size={22} className="method-check" />}
                  </label>
                ))}
              </div>
            </div>

            <div className="payment-summary-col">
              {address.name && (
                <div className="payment-address card">
                  <h2>Delivering to</h2>
                  <p className="addr-name">{address.name}</p>
                  <p className="addr-detail">{address.address}, {address.city} - {address.pincode}</p>
                  <p className="addr-phone">📞 {address.phone}</p>
                </div>
              )}

              <div className="payment-bill card">
                <h2>Amount to Pay</h2>
                <div className="bill-row"><span>Item Total</span><span>₹{cartTotal}</span></div>
                <div className="bill-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
                <div className="bill-divider" />
                <div className="bill-row grand"><span>Total</span><span>₹{grandTotal}</span></div>
                <button
                  id="pay-now-btn"
                  className="btn btn-primary pay-btn"
                  onClick={handlePay}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner" /> Processing...</>
                  ) : (
                    `Pay ₹${grandTotal} →`
                  )}
                </button>
                <p className="secure-note">🔒 100% secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
