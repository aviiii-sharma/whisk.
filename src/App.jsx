import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MenuCard from "./components/MenuCard";
import CartDrawer from "./components/CartDrawer";
import ItemDetail from "./components/ItemDetail";
import ProductsPage from "./pages/ProductsPage";


import menuData from "./data/menu.json";

const VENDOR_WHATSAPP_NUMBER = "918960464391";

/* ===================== CATEGORY CONFIG ===================== */

export const CATEGORY_CONFIG = [
  {
    id: "cakes",
    label: "Cakes & Desserts",
    description: "Birthday cakes, jar cakes & desserts",
    matchCategories: ["Cakes", "Jar Cakes", "Dry Cakes & Misc", "Specials"],
  },
  {
    id: "sweets",
    label: "Traditional Sweets",
    description: "Ladoo, barfi & festive sweets",
    matchCategories: ["Sweets", "Sweets (Ladoo)"],
  },
  {
    id: "cookies",
    label: "Cookies & Biscuits",
    description: "Tea time cookies & baked snacks",
    matchCategories: ["Cookies"],
  },
  {
    id: "namkeen",
    label: "Namkeen & Snacks",
    description: "Savory & crunchy snacks",
    matchCategories: ["Namkeen", "Savory Snacks"],
  },
  {
    id: "gifts",
    label: "Gift Packs",
    description: "Assorted gift boxes",
    matchCategories: ["Misc & Gift Packs"],
  },
];

/* ===================== APP ===================== */

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
  });

  /* ---------- CART LOGIC ---------- */

  const addToCart = (product, variant, quantity, flavourLabel = null) => {
    const id = `${product.id}-${variant.label}-${flavourLabel || "default"}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }

      return [
        ...prev,
        {
          id,
          name: product.name,
          variantLabel: variant.label,
          flavourLabel,
          unitPrice: variant.price,
          quantity,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;

    let message = "*New Order Request*%0A%0A";

    cart.forEach((item) => {
      const flavourText = item.flavourLabel
        ? ` (${item.flavourLabel})`
        : "";
      message += `• ${item.quantity} x ${item.name}${flavourText} - ₹${
        item.unitPrice * item.quantity
      }%0A`;
    });

    message += `%0A*Total: ₹${total}*%0A`;
    message += `Name: ${customerDetails.name || "N/A"}%0A`;
    message += `Address: ${customerDetails.address || "N/A"}`;

    window.open(
      `https://wa.me/${VENDOR_WHATSAPP_NUMBER}?text=${message}`,
      "_blank"
    );
  };

  return (
    <div className="app">
      <Navbar cartCount={cart.length} toggleCart={() => setIsCartOpen(true)} />

      <Routes>
  {/* HOME */}
  <Route path="/" element={<HomePage menuData={menuData} />} />

  {/* CATEGORY */}
  <Route
    path="/category/:categoryId"
    element={<HomePage menuData={menuData} />}
  />

  {/* ALL PRODUCTS PAGE */}
  <Route
    path="/products"
    element={<ProductsPage menuData={menuData} />}
  />

  {/* ITEM DETAIL */}
  <Route
    path="/item/:itemId"
    element={<ItemPage menuData={menuData} addToCart={addToCart} />}
  />

  {/* FALLBACK */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        total={total}
        customerDetails={customerDetails}
        setCustomerDetails={setCustomerDetails}
        handleCheckout={handleCheckout}
      />
    </div>
  );
}

/* ===================== HOME PAGE ===================== */

function HomePage({ menuData }) {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const activeCategoryConfig = categoryId
    ? CATEGORY_CONFIG.find((c) => c.id === categoryId)
    : null;

  const bestSellers =
    menuData.filter((i) => i.isBestSeller).length > 0
      ? menuData.filter((i) => i.isBestSeller).slice(0, 6)
      : menuData.slice(0, 6);

  let visibleItems = menuData;
  if (activeCategoryConfig) {
    visibleItems = menuData.filter((item) =>
      activeCategoryConfig.matchCategories.includes(item.category)
    );
  }

  return (
    <>
      {!categoryId && <Hero />}

      <main className="container">
        {/* HOME VIEW */}
        {!categoryId && (
          <>
            <section className="home-section">
              <div className="section-header">
                <h2>Best Sellers ⭐</h2>
                <button
  className="link-btn"
  onClick={() => navigate("/products")}
>
  View all →
</button>


              </div>

              <div className="menu-grid">
                {bestSellers.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            
            <WhatsAppInfo />
          </>
        )}

        {/* CATEGORY VIEW */}
        
      </main>
    </>
  );
}

/* ===================== ITEM PAGE ===================== */

function ItemPage({ menuData, addToCart }) {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const item = menuData.find((i) => i.id === Number(itemId));
  if (!item) return <Navigate to="/" replace />;

  return (
    <main className="container">
      <ItemDetail
        item={item}
        addToCart={addToCart}
        onBack={() => navigate(-1)}
      />
    </main>
  );
}

/* ===================== EXTRA SECTIONS ===================== */


function WhatsAppInfo() {
  return (
    <section className="info-section highlight">
      <h2>Order Confirmation</h2>
      <p>
        All orders are confirmed directly on WhatsApp. Delivery and payment
        details are handled personally by the vendor.
      </p>
    </section>
  );
}

export default App;
