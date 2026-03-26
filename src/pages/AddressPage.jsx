import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { User, Phone, MapPin, Building2, Hash, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import "./AddressPage.css";

export default function AddressPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", address: "", city: "", pincode: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, address, city, pincode } = form;
    if (!name || !phone || !address || !city || !pincode) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "addresses"), {
        userId: user.uid,
        ...form,
        createdAt: serverTimestamp(),
      });
      navigate("/payment", { state: { addressId: docRef.id, address: form } });
    } catch (err) {
      // If Firebase not configured, proceed with local address
      navigate("/payment", { state: { address: form } });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", placeholder: "Raj Kumar", icon: <User size={18} /> },
    { name: "phone", label: "Phone Number", placeholder: "+91 98765 43210", icon: <Phone size={18} /> },
    { name: "address", label: "Street Address", placeholder: "123, MG Road, Apt 4B", icon: <MapPin size={18} /> },
    { name: "city", label: "City", placeholder: "Mumbai", icon: <Building2 size={18} /> },
    { name: "pincode", label: "Pincode", placeholder: "400001", icon: <Hash size={18} /> },
  ];

  return (
    <>
      <Navbar />
      <main className="address-page">
        <div className="container address-container fade-in">
          <button className="back-btn" onClick={() => navigate("/checkout")}>
            <ArrowLeft size={18} /> Back to Checkout
          </button>
          <h1 className="page-title">Delivery Address</h1>
          <p className="page-subtitle">Where should we deliver your food?</p>

          <div className="address-card card">
            <form onSubmit={handleSubmit} id="address-form">
              <div className="address-grid">
                {fields.map(({ name, label, placeholder, icon }) => (
                  <div key={name} className={`form-group ${name === "address" ? "full-width" : ""}`}>
                    <label className="form-label">{label}</label>
                    <div className="input-icon-wrap">
                      <span className="input-icon">{icon}</span>
                      <input
                        id={`field-${name}`}
                        name={name}
                        type={name === "phone" ? "tel" : name === "pincode" ? "number" : "text"}
                        className="form-input input-with-icon"
                        placeholder={placeholder}
                        value={form[name]}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button id="save-address-btn" type="submit" className="btn btn-primary save-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : "Save & Continue →"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
