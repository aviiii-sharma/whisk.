import React, { useState } from "react";
import { Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MenuCard from "./components/MenuCard";
import CartDrawer from "./components/CartDrawer";
import ItemDetail from "./components/ItemDetail";

import menuData from "./data/menu.json";

const VENDOR_WHATSAPP_NUMBER = "918960464391";

/**
 * Main category config:
 * - id: used in URL (/category/:id)
 * - label: text shown on category card
 * - description: subtitle
 * - matchCategories: values from menu.json `category` field
 */
export const CATEGORY_CONFIG = [
  {
    id: "cakes",
    label: "Cakes & Jar Cakes",
    description: "Birthday cakes, jar cakes, bento cakes & more.",
    matchCategories: ["Cakes", "Pastry","Jar Cakes", "Custom Cakes", "Dry Cakes & Misc", "Specials"]
  },
  {
    id: "sweets",
    label: "Sweets & Ladoo",
    description: "Traditional laddoos, barfi and festive sweets.",
    matchCategories: ["Sweets", "Sweets (Ladoo)"]
  },
  {
    id: "cookies",
    label: "Cookies",
    description: "Tea-time favourites in many flavours.",
    matchCategories: ["Cookies"]
  },
  {
    id: "namkeen",
    label: "Namkeen & Snacks",
    description: "Crispy, savoury snacks for every mood.",
    matchCategories: ["Namkeen", "Savory Snacks"]
  },
  {
    id: "gifts",
    label: "Custom Cakes & Gift Packs",
    description: "Curated boxes for festivals & occasions.",
    matchCategories: ["Misc & Gift Packs"]
  }
];

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
  });

  // Add Item with selected variant + quantity
  const addToCart = (product, variant, quantity = 1, flavourLabel = null) => {
  const keyParts = [product.id, variant.label, flavourLabel].filter(Boolean);
  const cartItemId = keyParts.join("-");

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartItemId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            name: product.name,
            variantLabel: variant.label,
            flavourLabel: flavourLabel,
            unitPrice: variant.price,
            quantity,
          },
        ];
      }
    });

    setIsCartOpen(true); // open cart after adding
  };

  // Update quantity in cart (by cart item id)
  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  // WhatsApp Logic
  const handleCheckout = () => {
    if (cart.length === 0) return;

    let message = `*New Order Request* %0A%0A`;
    cart.forEach((item) => {
  const flavourText = item.flavourLabel ? `, ${item.flavourLabel}` : "";
  message += `• ${item.quantity} x ${item.name}${flavourText} (${item.variantLabel}) - ₹${
    item.unitPrice * item.quantity
  }%0A`;
});

    message += `%0A*Total: ₹${total}* %0A%0A`;
    message += `*Name:* ${customerDetails.name || "N/A"}%0A`;
    message += `*Details:* ${customerDetails.address || "N/A"}%0A`;

    const url = `https://wa.me/${VENDOR_WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <div className="app">
      <Navbar cartCount={cart.length} toggleCart={() => setIsCartOpen(true)} />

      <Routes>
        {/* Home + category view */}
        <Route
          path="/"
          element={<HomePage menuData={menuData} />}
        />
        <Route
          path="/category/:categoryId"
          element={<HomePage menuData={menuData} />}
        />

        {/* Item detail page */}
        <Route
          path="/item/:itemId"
          element={<ItemPage menuData={menuData} addToCart={addToCart} />}
        />

        {/* Fallback */}
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

/* ------------ Home Page (list + categories) ------------ */

function HomePage({ menuData }) {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const activeCategoryId = categoryId || null;
  const activeCategoryConfig = activeCategoryId
    ? CATEGORY_CONFIG.find((c) => c.id === activeCategoryId)
    : null;

  // Filter visible items based on selected category
  let visibleItems = menuData;
  if (activeCategoryConfig) {
    visibleItems = menuData.filter((item) =>
      activeCategoryConfig.matchCategories.includes(item.category)
    );
  }

  const currentHeading =
    activeCategoryConfig?.label || "All items";

  return (
    <>
      <Hero />

      <main className="container">
        <CategorySection
          activeId={activeCategoryId}
          onSelect={(id) => {
            if (id === activeCategoryId) {
              navigate("/"); // toggle off, show all
            } else {
              navigate(`/category/${id}`);
            }
          }}
        />

        <section id="menu-section">
          <h2 style={{ marginBottom: "1.5rem" }}>{currentHeading}</h2>
          <div className="menu-grid">
            {visibleItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
            {visibleItems.length === 0 && (
              <p style={{ color: "#777" }}>
                No items found in this category yet.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

function CategorySection({ activeId, onSelect }) {
  return (
    <section className="category-section">
      <h2 className="section-title">Browse by category</h2>
      <div className="category-grid">
        {CATEGORY_CONFIG.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={
              "category-card" +
              (cat.id === activeId ? " category-card-active" : "")
            }
            onClick={() => onSelect(cat.id)}
          >
            <div className="category-card-content">
              <h3>{cat.label}</h3>
              <p>{cat.description}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ------------ Item Page (detail) ------------ */

function ItemPage({ menuData, addToCart }) {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const idNum = Number(itemId);
  const item = menuData.find((i) => i.id === idNum);

  if (!item) {
    return (
      <main className="container">
        <div style={{ padding: "2rem 0" }}>
          <button
            className="back-link"
            type="button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h2>Item not found</h2>
          <p style={{ marginTop: "0.5rem" }}>
            This product doesn&apos;t exist or was removed.
          </p>
        </div>
      </main>
    );
  }

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

export default App;
