import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { LayoutDashboard, Package, Trash2, Plus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import "./AdminPage.css";

const ADMIN_EMAIL = "aarushjais407@gmail.com";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, menu, orders
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for adding new menu items
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "Pizza", description: "", image: "", outlet: "all" });

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersSnap = await getDocs(collection(db, "orders"));
      setOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const menuSnap = await getDocs(collection(db, "menu"));
      setMenuItems(menuSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) { toast.error("Name and price required"); return; }
    try {
      await addDoc(collection(db, "menu"), { ...newItem, price: Number(newItem.price) });
      toast.success("Item added successfully");
      setNewItem({ name: "", price: "", category: "Pizza", description: "", image: "", outlet: "all" });
      fetchData(); // refresh list
    } catch {
      toast.error("Failed to add item");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, "menu", id));
      toast.success("Item deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete item");
    }
  };

  if (authLoading) return <div className="admin-loading"><span className="spinner" /></div>;
  if (!user || user.email !== ADMIN_EMAIL) return <Navigate to="/" replace />;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <>
      <Navbar />
      <main className="admin-page fade-in">
        <div className="admin-sidebar">
          <h2>Admin Panel</h2>
          <nav className="admin-nav">
            <button className={`admin-tab ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button className={`admin-tab ${activeTab === "menu" ? "active" : ""}`} onClick={() => setActiveTab("menu")}>
              <Package size={18} /> Manage Menu
            </button>
            <button className={`admin-tab ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
              <LayoutDashboard size={18} /> Orders
            </button>
          </nav>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="admin-loading"><span className="spinner dark" /></div>
          ) : (
            <>
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="admin-dashboard">
                  <h1 className="admin-title">Overview</h1>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <h3>Total Orders</h3>
                      <p className="stat-value">{orders.length}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Total Revenue</h3>
                      <p className="stat-value text-primary">₹{totalRevenue}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Menu Items</h3>
                      <p className="stat-value">{menuItems.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Management Tab */}
              {activeTab === "menu" && (
                <div className="admin-menu">
                  <h1 className="admin-title">Menu Management</h1>
                  
                  <div className="add-item-card card">
                    <h3>Add New Item</h3>
                    <form onSubmit={handleAddItem} className="add-item-form">
                      <input type="text" placeholder="Item Name" className="form-input" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                      <input type="number" placeholder="Price (₹)" className="form-input" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                      <select className="form-input" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                        <option value="Pizza">Pizza</option>
                        <option value="Burgers">Burgers</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Combos">Combos</option>
                      </select>
                      <input type="text" placeholder="Image URL" className="form-input" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} />
                      <input type="text" placeholder="Description" className="form-input full-width" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                      <button type="submit" className="btn btn-primary"><Plus size={16} /> Add Item</button>
                    </form>
                  </div>

                  <div className="menu-list card">
                    <h3>Current Items</h3>
                    <div className="table-wrapper">
                      <table className="admin-table">
                        <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr></thead>
                        <tbody>
                          {menuItems.map(item => (
                            <tr key={item.id}>
                              <td>{item.name}</td>
                              <td><span className="badge category-badge">{item.category}</span></td>
                              <td className="font-bold">₹{item.price}</td>
                              <td><button className="del-btn" onClick={() => handleDeleteItem(item.id)}><Trash2 size={16} /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Management Tab */}
              {activeTab === "orders" && (
                <div className="admin-orders">
                  <h1 className="admin-title">Recent Orders</h1>
                  <div className="orders-list card">
                    <div className="table-wrapper">
                      <table className="admin-table">
                        <thead><tr><th>Order ID</th><th>Customer</th><th>Outlet</th><th>Total</th><th>Status</th></tr></thead>
                        <tbody>
                          {orders.map(o => (
                            <tr key={o.id}>
                              <td className="font-mono text-sm">{o.id.slice(0, 8)}</td>
                              <td>{o.address?.name || "Unknown"}</td>
                              <td>{o.outletName || "—"}</td>
                              <td className="font-bold">₹{o.total}</td>
                              <td><span className="badge success-badge">{o.status}</span></td>
                            </tr>
                          ))}
                          {orders.length === 0 && <tr><td colSpan="5" className="text-center py-4">No orders yet</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
