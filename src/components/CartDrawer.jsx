import React from "react";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  total,
  customerDetails,
  setCustomerDetails,
  handleCheckout,
}) {
  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>

      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Order</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                marginTop: "2rem",
                color: "#888",
              }}
            >
              Your cart is empty. <br />
              Add some delicious food!
            </p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  <h4>{item.name}</h4>
                  {item.flavourLabel && (
      <small>{item.flavourLabel}</small>
    )}

                  <div style={{ fontSize: "0.9rem", marginTop: 4 }}>
                    {item.variantLabel && (
        <span style={{ marginRight: 6 }}>{item.variantLabel}</span>
      )}
                    ₹{item.unitPrice} × {item.quantity} ={" "}
                    <strong>₹{item.unitPrice * item.quantity}</strong>
                  </div>
                </div>

                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Your Name"
                value={customerDetails.name}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="input-group">
              <textarea
                placeholder="Delivery Address & Phone"
                rows="3"
                value={customerDetails.address}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    address: e.target.value,
                  })
                }
              ></textarea>
            </div>

            <button className="whatsapp-btn" onClick={handleCheckout}>
              Place order on WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
