import { Link } from "react-router-dom";
import { ShoppingBag, MapPin, LogOut, User, Settings } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOutlet } from "../context/OutletContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Navbar.css";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { selectedOutlet } = useOutlet();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🍕</span>
          <span className="logo-text">FoodieLoverz</span>
        </Link>

        {selectedOutlet && (
          <div className="navbar-outlet">
            <MapPin size={15} />
            <span>{selectedOutlet.name}</span>
          </div>
        )}

        <div className="navbar-actions">
          {user && (
            <>
              {user.email === "aarushjais407@gmail.com" && (
                <Link to="/admin" className="admin-link-btn" title="Admin Panel">
                  <Settings size={18} /> Admin
                </Link>
              )}
              <div className="navbar-user">
                <User size={16} />
                <span>{user.email?.split("@")[0]}</span>
              </div>
              <button
                id="cart-btn"
                className="cart-btn"
                onClick={() => setIsCartOpen(true)}
                aria-label="Open cart"
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </button>
              <button className="btn btn-ghost logout-btn" onClick={handleLogout} title="Logout">
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
