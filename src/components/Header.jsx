// src/components/Header.jsx

function Header() {
  return (
    <header className="app-header">
      {/* TODO: Replace with the actual path to your logo */}
      <img src="/ama-logo.png" alt="AMA Logo" className="logo" />
      <h1>AMA Laundry Booking</h1>
      <p className="subtitle">
        Scan — Book — Pick up — built for mining camp residents
      </p>
      <div className="brand-stripe"></div>
    </header>
  );
}

export default Header;
