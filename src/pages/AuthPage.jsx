import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, UtensilsCrossed } from "lucide-react";
import toast from "react-hot-toast";
import "./AuthPage.css";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Welcome back! 🍕");
      } else {
        await signup(email, password);
        toast.success("Account created! Let's eat! 🎉");
      }
    } catch (err) {
      toast.error(err.message?.replace("Firebase: ", "") || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-logo-icon">🍕</span>
          <h1>FoodieLoverz</h1>
          <p>Your favourite food, delivered fast</p>
        </div>
        <div className="auth-features">
          {["🚀 Super fast delivery", "🍔 100+ menu items", "📍 4 city outlets", "💳 Easy payments"].map((f) => (
            <div key={f} className="auth-feature">{f}</div>
          ))}
        </div>
        <div className="auth-food-emoji">
          {["🍕", "🍔", "🥤", "🍟", "🌮"].map((e, i) => (
            <span key={i} className="floating-emoji" style={{ animationDelay: `${i * 0.3}s` }}>{e}</span>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card fade-in">
          <div className="auth-header">
            <UtensilsCrossed size={32} color="var(--primary)" />
            <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
            <p>{mode === "login" ? "Sign in to continue ordering" : "Join FoodieLoverz today"}</p>
          </div>

          <div className="auth-tabs">
            <button
              id="login-tab"
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Sign In
            </button>
            <button
              id="signup-tab"
              className={`auth-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  id="email-input"
                  type="email"
                  className="form-input input-with-icon"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  id="password-input"
                  type={showPw ? "text" : "password"}
                  className="form-input input-with-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              className="btn btn-primary auth-btn"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button className="auth-switch-btn" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
