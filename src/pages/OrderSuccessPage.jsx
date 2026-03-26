import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./OrderSuccessPage.css";

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderId, outlet } = state || {};

  useEffect(() => {
    if (!orderId) navigate("/");
  }, []);

  return (
    <main className="success-page">
      <div className="success-card fade-in">
        <div className="success-anim">
          <div className="checkmark-circle">
            <svg viewBox="0 0 52 52" className="checkmark-svg">
              <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
        </div>

        <h1>Order Confirmed! 🎉</h1>
        <p className="success-sub">Your food is being prepared</p>

        <div className="order-detail-card">
          <div className="order-detail-row">
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>
          <div className="order-detail-row">
            <span>Outlet</span>
            <strong>{outlet?.emoji} FoodieLoverz {outlet?.name || "—"}</strong>
          </div>
          <div className="order-detail-row">
            <span>Estimated Delivery</span>
            <strong>⏱️ 25–35 minutes</strong>
          </div>
          <div className="order-detail-row">
            <span>Status</span>
            <strong className="status-badge">✅ Placed</strong>
          </div>
        </div>

        <div className="petpooja-notice">
          <span>🖥️</span>
          <p>Order sent to restaurant via <strong>Petpooja POS</strong></p>
        </div>

        <button
          id="back-home-btn"
          className="btn btn-primary back-home-btn"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}
