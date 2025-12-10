import React from "react";
import { useNavigate } from "react-router-dom";

export default function MenuCard({ item }) {
  const navigate = useNavigate();

  const minPrice = item.variants
    ? Math.min(...item.variants.map((v) => v.price))
    : 0;

  const openDetail = () => {
    navigate(`/item/${item.id}`);
  };

  return (
    <div className="menu-card" onClick={openDetail}>
      <div>
        <div
          className="card-img-placeholder"
          style={{ backgroundImage: `url(${item.image})` }}
        ></div>

        <div className="item-header">
          <h3>{item.name}</h3>
        </div>

        {item.category && (
          <p className="item-category">{item.category}</p>
        )}

        <p style={{ color: "#777", fontSize: "0.9rem" }}>
          {item.description}
        </p>
      </div>

      <div className="menu-card-footer">
        <span className="price-pill">From ₹{minPrice}</span>
        <button
          className="secondary-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openDetail();
          }}
        >
          View options
        </button>
      </div>
    </div>
  );
}
