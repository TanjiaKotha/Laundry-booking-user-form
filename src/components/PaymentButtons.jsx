function PaymentButtons() {
  return (
    <div className="field">
      <label>Pay Online</label>
      <div className="actions">
        <button type="button" className="pay-btn">
          Pay with Stripe
        </button>
        <button type="button" className="pay-btn alt">
          Pay with Square
        </button>
        <button type="button" className="pay-btn warn">
          Pay with PayPal
        </button>
        <button type="button" className="pay-btn danger">
          Pay with Bizum
        </button>
      </div>
      <div className="hint">
        These are sample buttons. Replace with real integrations.
      </div>
    </div>
  );
}

export default PaymentButtons;
