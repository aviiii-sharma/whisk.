import React, { useState, useRef } from "react";

export default function ItemDetail({ item, onBack, addToCart }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const hasFlavours = Array.isArray(item.flavours) && item.flavours.length > 0;
  const [selectedFlavourIndex, setSelectedFlavourIndex] = useState(0);

  /* ----------------------------------------------------
      IMAGE CAROUSEL – SCROLLABLE + SWIPE + SNAP
  ----------------------------------------------------- */

  const images =
    item.images && item.images.length > 0 ? item.images : [item.image];

  const carouselRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleScroll = (e) => {
    const el = e.target;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentImageIndex(index);
  };

  // Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!carouselRef.current) return;

    if (touchStartX - touchEndX > 50) {
      // Swipe left → next image
      carouselRef.current.scrollBy({
        left: carouselRef.current.clientWidth,
        behavior: "smooth",
      });
    } else if (touchEndX - touchStartX > 50) {
      // Swipe right → previous image
      carouselRef.current.scrollBy({
        left: -carouselRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  /* ----------------------------------------------------
      PRODUCT OPTIONS
  ----------------------------------------------------- */
  const selectedVariant = item.variants[selectedVariantIndex];
  const selectedFlavour =
    hasFlavours && item.flavours[selectedFlavourIndex]
      ? item.flavours[selectedFlavourIndex]
      : null;

  const handleAdd = () => {
    addToCart(
      item,
      selectedVariant,
      quantity,
      selectedFlavour ? selectedFlavour.label : null
    );
  };

  /* ----------------------------------------------------
      RETURN JSX
  ----------------------------------------------------- */

  return (
    <div className="item-detail">
      <button className="back-link" type="button" onClick={onBack}>
        ← Back
      </button>

      <div className="item-detail-layout">
        {/* -------------- IMAGE CAROUSEL --------------- */}
        <div className="item-detail-image">
          <div
            className="carousel-scroll-container"
            ref={carouselRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="carousel-image-slide"
                style={{ backgroundImage: `url(${img})` }}
              ></div>
            ))}
          </div>

          {/* dots */}
          <div className="carousel-dots">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={"dot " + (idx === currentImageIndex ? "active" : "")}
                onClick={() => {
                  if (carouselRef.current) {
                    carouselRef.current.scrollTo({
                      left: idx * carouselRef.current.clientWidth,
                      behavior: "smooth",
                    });
                  }
                }}
              ></span>
            ))}
          </div>
        </div>

        {/* -------------- PRODUCT INFO --------------- */}
        <div className="item-detail-info">
          <h1>{item.name}</h1>
          {item.category && (
            <p className="item-category">{item.category}</p>
          )}

          <p className="item-description">{item.description}</p>

          {/* Flavours */}
          {hasFlavours && (
            <div className="item-detail-section">
              <label className="field-label">Choose flavour</label>
              <div className="chip-row">
                {item.flavours.map((flavour, idx) => (
                  <button
                    key={flavour.label}
                    type="button"
                    className={
                      "chip-btn" +
                      (idx === selectedFlavourIndex ? " chip-btn-active" : "")
                    }
                    onClick={() => setSelectedFlavourIndex(idx)}
                  >
                    {flavour.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          <div className="item-detail-section">
            <label className="field-label">Choose size / weight</label>
            <div className="chip-row">
              {item.variants.map((variant, idx) => (
                <button
                  key={variant.label}
                  type="button"
                  className={
                    "chip-btn" +
                    (idx === selectedVariantIndex ? " chip-btn-active" : "")
                  }
                  onClick={() => setSelectedVariantIndex(idx)}
                >
                  {variant.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="item-detail-section">
            <label className="field-label">Quantity</label>
            <div className="qty-row">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <div className="item-detail-footer">
            <div className="item-detail-price">
              <span>Total</span>
              <strong>₹{selectedVariant.price * quantity}</strong>
            </div>
            <button className="primary-btn" type="button" onClick={handleAdd}>
              Add to cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
