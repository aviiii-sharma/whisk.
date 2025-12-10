import React, { useState } from "react";

export default function ItemDetail({ item, onBack, addToCart }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const hasFlavours = Array.isArray(item.flavours) && item.flavours.length > 0;
  const [selectedFlavourIndex, setSelectedFlavourIndex] = useState(0);

  const selectedVariant = item.variants[selectedVariantIndex];
  const selectedFlavour =
    hasFlavours && item.flavours[selectedFlavourIndex]
      ? item.flavours[selectedFlavourIndex]
      : null;

  const handleAdd = () => {
    if (!selectedVariant) return;
    const flavourLabel = selectedFlavour ? selectedFlavour.label : null;
    addToCart(item, selectedVariant, quantity, flavourLabel);
  };

  return (
    <div className="item-detail">
      <button className="back-link" type="button" onClick={onBack}>
        ← Back to menu
      </button>

      <div className="item-detail-layout">
        <div className="item-detail-image">
          <div
            className="card-img-placeholder large"
            style={{ backgroundImage: `url(${item.image})` }}
          ></div>
        </div>

        <div className="item-detail-info">
          <h1>{item.name}</h1>
          {item.category && (
            <p className="item-category">{item.category}</p>
          )}

          <p className="item-description">{item.description}</p>

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
