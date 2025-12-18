import React, { useState, useRef } from "react";

export default function ItemDetail({ item, onBack, addToCart }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const hasFlavours = Array.isArray(item.flavours) && item.flavours.length > 0;
  const [selectedFlavourIndex, setSelectedFlavourIndex] = useState(0);

  /* ---------- Images ---------- */
  const images =
    item.images && item.images.length > 0 ? item.images : [item.image];

  const carouselRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentImageIndex(index);
  };

  /* ---------- Product ---------- */
  const selectedVariant = item.variants[selectedVariantIndex];
  const selectedFlavour =
    hasFlavours && item.flavours[selectedFlavourIndex]
      ? item.flavours[selectedFlavourIndex]
      : null;

  const totalPrice = selectedVariant.price * quantity;

  const handleAdd = () => {
    addToCart(
      item,
      selectedVariant,
      quantity,
      selectedFlavour ? selectedFlavour.label : null
    );
  };

  return (
    <div className="item-detail-page">

      <div className="item-detail-container">
        {/* LEFT: IMAGES */}
        <div className="item-images">
          <div
            className="smooth-carousel"
            ref={carouselRef}
            onScroll={handleScroll}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="smooth-slide"
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
          </div>

          <div className="carousel-dots">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === currentImageIndex ? "active" : ""}`}
                onClick={() =>
                  carouselRef.current.scrollTo({
                    left: idx * carouselRef.current.clientWidth,
                    behavior: "smooth",
                  })
                }
              />
            ))}
          </div>
        </div>

        {/* RIGHT: INFO */}
        <div className="item-info-card">
          <div className="item-header">
            <h1>{item.name}</h1>
            {item.category && (
              <span className="item-category-pill">{item.category}</span>
            )}
          </div>

          <p className="item-description">{item.description}</p>

          {/* PRICE */}
          <div className="price-row">
            <span className="price-label">Price</span>
            <strong className="price-value">₹{selectedVariant.price}</strong>
          </div>

          {/* FLAVOURS */}
          {hasFlavours && (
  <div className="option-block">
    <h4>Choose flavour</h4>
    <div className="chip-row">
      {item.flavours.map((flavour, idx) => (
        <button
          key={flavour.label}
          type="button"
          className={
            "chip-btn chip-animated " +
            (idx === selectedFlavourIndex ? "chip-selected" : "")
          }
          onClick={() => setSelectedFlavourIndex(idx)}
        >
          {flavour.label}
        </button>
      ))}
    </div>
  </div>
)}


          {/* SIZE */}
          <div className="option-block">
  <h4>Size / Weight</h4>
  <div className="chip-row">
    {item.variants.map((variant, idx) => (
      <button
        key={variant.label}
        type="button"
        className={
          "chip-btn chip-animated " +
          (idx === selectedVariantIndex ? "chip-selected" : "")
        }
        onClick={() => setSelectedVariantIndex(idx)}
      >
        {variant.label}
      </button>
    ))}
  </div>
</div>


          {/* QUANTITY */}
          <div className="option-block">
  <h4>Quantity</h4>
  <div className="qty-pill">
    <button
      className="qty-action"
      disabled={quantity === 1}
      onClick={() => setQuantity(q => Math.max(1, q - 1))}
    >
      −
    </button>

    <span className="qty-count">{quantity}</span>

    <button
      className="qty-action"
      onClick={() => setQuantity(q => q + 1)}
    >
      +
    </button>
  </div>
</div>

        </div>
      </div>

      {/* STICKY FOOTER (Mobile-first) */}
      <div className="item-detail-footer-sticky">
        <div>
          <span>Total</span>
          <strong> ₹{totalPrice}</strong>
        </div>
        <button className="primary-btn" onClick={handleAdd}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
