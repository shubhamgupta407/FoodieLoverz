import { useState, useEffect } from "react";
import { collection, query, where, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useOutlet } from "../context/OutletContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import FoodCard from "../components/FoodCard";
import { Search } from "lucide-react";
import "./MenuPage.css";

// Local fallback menu data (used when Firebase not configured)
const LOCAL_MENU = [
  { id: "1", name: "Paneer Pizza", price: 299, category: "Pizza", description: "Creamy paneer, bell peppers & mozzarella on a golden base", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format", outlet: "all" },
  { id: "2", name: "Margherita", price: 249, category: "Pizza", description: "Classic tomato base, fresh mozzarella, basil leaves", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format", outlet: "all" },
  { id: "3", name: "Veg Burger", price: 149, category: "Burgers", description: "Crispy veggie patty, lettuce, tomato, house sauce", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format", outlet: "all" },
  { id: "4", name: "Chicken Burger", price: 199, category: "Burgers", description: "Juicy grilled chicken, jalapeños, special mayo", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format", outlet: "all" },
  { id: "5", name: "Cold Coffee", price: 99, category: "Beverages", description: "Chilled cold brew with milk froth and caramel drizzle", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format", outlet: "all" },
  { id: "6", name: "Mango Lassi", price: 89, category: "Beverages", description: "Fresh Alphonso mango blended with creamy yogurt", image: "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=600&auto=format", outlet: "all" },
  { id: "7", name: "Cheese Combo", price: 399, category: "Combos", description: "Margherita pizza + Veg burger + Cold coffee", image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&auto=format", outlet: "all" },
  { id: "8", name: "Family Feast", price: 599, category: "Combos", description: "2 pizzas + 2 burgers + 4 beverages of your choice", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format", outlet: "all" },
  { id: "9", name: "BBQ Chicken Pizza", price: 349, category: "Pizza", description: "Smoky BBQ sauce, grilled chicken, red onions, cheddar", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format", outlet: "all" },
  { id: "10", name: "Fresh Lime Soda", price: 69, category: "Beverages", description: "Freshly squeezed lime, mint, topped with sparkling soda", image: "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=600&auto=format", outlet: "all" },
];

const CATEGORIES = ["All", "Pizza", "Burgers", "Beverages", "Combos"];

export default function MenuPage() {
  const { selectedOutlet } = useOutlet();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!selectedOutlet) { navigate("/"); return; }
    fetchMenu();
  }, [selectedOutlet]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "menu"),
        where("outlet", "in", [selectedOutlet.id, "all"])
      );
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (items.length > 0) {
        setMenuItems(items);
      } else {
        // Attempt to auto-seed if collection is empty
        try {
          const allSnap = await getDocs(collection(db, "menu"));
          if (allSnap.empty) {
            const batch = writeBatch(db);
            LOCAL_MENU.forEach((item) => {
              const docRef = doc(collection(db, "menu"));
              batch.set(docRef, item);
            });
            await batch.commit();
            
            // Re-fetch after seeding
            const newSnap = await getDocs(q);
            setMenuItems(newSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
            return;
          }
        } catch (e) {
          console.error("Auto-seed failed", e);
        }
        
        // Fallback to local data if Firebase not configured
        setMenuItems(LOCAL_MENU);
      }
    } catch {
      setMenuItems(LOCAL_MENU);
    } finally {
      setLoading(false);
    }
  };

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="menu-page">
        <div className="menu-hero">
          <div className="container">
            <h1>
              {selectedOutlet?.emoji} {selectedOutlet?.name} Menu
            </h1>
            <p>{selectedOutlet?.subtitle}</p>
            <div className="search-wrap">
              <Search size={20} className="search-icon" />
              <input
                id="menu-search"
                type="text"
                className="search-input"
                placeholder="Search pizzas, burgers, beverages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="container menu-body">
          <div className="category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`cat-${cat.toLowerCase()}`}
                className={`cat-tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="menu-loading">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="menu-empty">
              <p>🍽️ No items found</p>
              <span>Try a different search or category</span>
            </div>
          ) : (
            <div className="menu-grid">
              {filtered.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
