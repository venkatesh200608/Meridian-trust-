export default function Logo({ light = false }) {
  const stroke = light ? "#DDE2E0" : "#10171F";
  return (
    <div className={`brand ${light ? "light" : ""}`}>
      <svg width="26" height="26" viewBox="0 0 30 30" fill="none">
        <circle cx="15" cy="15" r="12.5" stroke={stroke} strokeWidth="1.3" />
        <path d="M15 2.5V27.5" stroke={stroke} strokeWidth="1.3" />
        <path d="M4 15C4 15 9 10 15 10C21 10 26 15 26 15" stroke={stroke} strokeWidth="1.3" />
      </svg>
      <span>Meridian Trust</span>
    </div>
  );
}
