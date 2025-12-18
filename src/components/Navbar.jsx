import React from "react";
import { Link } from "react-router-dom"; // 1. Import Link

export default function Navbar({ cartCount, toggleCart }) {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div className="logo">
          {/* 2. Wrap the image in a Link component pointing to "/" */}
          <Link to="/">
            <img 
              src="/logo4(1).png" 
              alt="Whisk Logo" 
              style={{ height: "2rem", width: "auto" }} 
            />
          </Link>
        </div>
        <button className="cart-btn-trigger" onClick={toggleCart}>
          🛒 <span>Cart ({cartCount})</span>
        </button>
      </div>
    </nav>
  );
}