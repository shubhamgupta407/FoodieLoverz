import { Plus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import "./FoodCard.css";

export default function FoodCard({ item }) {
  const { addToCart, cartItems } = useCart();
  const [adding, setAdding] = useState(false);

  const inCart = cartItems.find((i) => i.id === item.id);

  const handleAdd = () => {
    addToCart(item);
    setAdding(true);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <div className="food-card">
      <div className="food-img-wrap">
        <img src={item.image} alt={item.name} className="food-img" loading="lazy" />
        <span className="food-badge">{item.category}</span>
      </div>
      <div className="food-info">
        <h3 className="food-name">{item.name}</h3>
        <p className="food-desc">{item.description}</p>
        <div className="food-footer">
          <span className="food-price">₹{item.price}</span>
          <button
            id={`add-${item.id}`}
            className={`add-btn ${adding ? "added" : ""}`}
            onClick={handleAdd}
          >
            {adding ? (
              <>
                <Check size={16} />
                Added
              </>
            ) : (
              <>
                <Plus size={16} />
                Add
              </>
            )}
          </button>
        </div>
        {inCart && (
          <div className="in-cart-indicator">
            {inCart.quantity} in cart
          </div>
        )}
      </div>
    </div>
  );
}
