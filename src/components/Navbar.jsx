import React from "react";

export default function Navbar({ cartCount, toggleCart }) {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div className="logo">
          whisk<span style={{ color: "var(--primary)" }}>.</span>
        </div>
        <button className="cart-btn-trigger" onClick={toggleCart}>
          🛒 <span>Cart ({cartCount})</span>
        </button>
      </div>
    </nav>
  );
}
