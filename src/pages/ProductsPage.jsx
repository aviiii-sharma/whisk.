import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuCard from "../components/MenuCard";
import { CATEGORY_CONFIG } from "../App";

export default function ProductsPage({ menuData }) {
  const navigate = useNavigate();

  const [activeCategoryId, setActiveCategoryId] = useState(
    CATEGORY_CONFIG[0].id
  );

  const activeCategory = CATEGORY_CONFIG.find(
    (c) => c.id === activeCategoryId
  );

  const filteredItems = menuData.filter((item) =>
    activeCategory.matchCategories.includes(item.category)
  );

  return (
    <main className="container">
      {/* Back */}
      

      <h1 style={{ marginTop: "0.6rem" }}>All Products</h1>
      <p style={{ color: "#777", fontSize: "0.9rem", marginBottom: "0.6rem" }}>
        Browse our complete menu by category
      </p>

      {/* CATEGORY TABS */}
      <div className="category-tabs">
        {CATEGORY_CONFIG.map((cat) => {
  const Icon = cat.icon;

  return (
    <button
      key={cat.id}
      className={
        "category-tab-card " +
        (cat.id === activeCategoryId ? "active" : "")
      }
      onClick={() => setActiveCategoryId(cat.id)}
    >
      <Icon className="category-icon-svg" />
      <span className="category-label">{cat.label}</span>
    </button>
  );
})}

      </div>

      {/* PRODUCTS */}
      <div className="menu-grid" style={{ marginTop: "1.5rem" }}>
        {filteredItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}

        {filteredItems.length === 0 && (
          <p style={{ color: "#777" }}>
            No products found in this category.
          </p>
        )}
      </div>
    </main>
  );
}
