import { useNavigate } from "react-router-dom";
import { useOutlet, OUTLETS } from "../context/OutletContext";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import { ChevronRight, Star, Clock, Truck } from "lucide-react";
import "./LandingPage.css";

export default function LandingPage() {
  const { setSelectedOutlet } = useOutlet();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const handleSelect = (outlet) => {
    setSelectedOutlet(outlet);
    clearCart();
    navigate("/menu");
  };

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>
        {/* Hero */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="container hero-content fade-in">
            <div className="hero-badge">🔥 Free delivery on first order</div>
            <h1 className="hero-title">
              Order <span className="gradient-text">Delicious</span><br />
              Food, Delivered Fast
            </h1>
            <p className="hero-subtitle">
              Authentic flavours from 4 cities across India. Fresh, hot, and at your doorstep.
            </p>
            <div className="hero-stats">
              {[
                { icon: <Star size={16} />, label: "4.8 Rating" },
                { icon: <Clock size={16} />, label: "30 min ETA" },
                { icon: <Truck size={16} />, label: "Free delivery" },
              ].map(({ icon, label }) => (
                <div key={label} className="hero-stat">
                  {icon}
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outlets */}
        <section className="outlets-section">
          <div className="container">
            <div className="section-header">
              <h2>Choose Your City</h2>
              <p>Select an outlet to explore the menu</p>
            </div>
            <div className="outlets-grid">
              {OUTLETS.map((outlet) => (
                <div key={outlet.id} className="outlet-card" onClick={() => handleSelect(outlet)}>
                  <div className="outlet-img-wrap">
                    <img src={outlet.image} alt={outlet.name} />
                    <div className="outlet-overlay">
                      <button id={`outlet-${outlet.id}`} className="outlet-cta">
                        Order Now <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="outlet-info">
                    <div className="outlet-name-row">
                      <span className="outlet-emoji">{outlet.emoji}</span>
                      <div>
                        <h3 className="outlet-name">{outlet.name}</h3>
                        <p className="outlet-sub">{outlet.subtitle}</p>
                      </div>
                    </div>
                    <div className="outlet-meta">
                      <span>⭐ 4.8</span>
                      <span>· 25-35 min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="why-section">
          <div className="container">
            <div className="section-header">
              <h2>Why FoodieLoverz?</h2>
            </div>
            <div className="why-grid">
              {[
                { emoji: "⚡", title: "Lightning Fast", desc: "30 min or less guaranteed delivery to your door" },
                { emoji: "🌟", title: "Premium Quality", desc: "Hand-picked ingredients, crafted by expert chefs" },
                { emoji: "🔒", title: "Safe & Secure", desc: "Hygienic packaging, contact-free delivery" },
                { emoji: "💰", title: "Best Prices", desc: "No hidden charges, transparent pricing always" },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="why-card">
                  <span className="why-emoji">{emoji}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-brand">
            <span>🍕</span> FoodieLoverz
          </div>
          <p>© 2026 FoodieLoverz. Powered by Petpooja POS.</p>
        </div>
      </footer>
    </>
  );
}
