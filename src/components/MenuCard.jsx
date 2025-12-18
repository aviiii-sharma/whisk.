import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MenuCard({ item }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const images =
    item.images && item.images.length > 1
      ? item.images
      : [item.image, item.image]; // fallback to same image

  const openDetail = () => navigate(`/item/${item.id}`);

  // Choose the first 2 images for crossfade
  const baseImage = images[0];
  const hoverImage = images[1];

  return (
    <div
      className="menu-card"
      onClick={openDetail}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE WRAPPER */}
      <div className="card-img-wrapper">
        {/* Bottom (default) image */}
        <div
          className="card-img base"
          style={{ backgroundImage: `url(${baseImage})` }}
        ></div>

        {/* Top (hover) image — fades in */}
        <div
          className="card-img hover-img"
          style={{
            backgroundImage: `url(${hoverImage})`,
            opacity: hovered ? 1 : 0
          }}
        ></div>
      </div>

      {/* Normal content */}
      <div className="item-header">
        <h3 style={{ marginTop: "0.6rem" }}>{item.name}</h3>
      </div>

      {item.category && (
        <p className="item-category">{item.category}</p>
      )}

      <p style={{ color: "#777", fontSize: "0.9rem" }}>
        {item.description}
      </p>

      <div className="menu-card-footer">
        <span className="price-pill">
          From ₹{Math.min(...item.variants.map(v => v.price))}
        </span>

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
