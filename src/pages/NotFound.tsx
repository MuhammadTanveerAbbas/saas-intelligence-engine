import { useLocation, useNavigate } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#08090d",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: "24px",
    }}>
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: "#34d39918",
          border: "1px solid #34d39920",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <Zap size={22} style={{ color: "#34d399" }} />
        </div>

        {/* 404 */}
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11, color: "#5b6270",
          letterSpacing: 3, textTransform: "uppercase",
          margin: "0 0 12px",
        }}>Error 404</p>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 72, color: "#e2e4e9",
          letterSpacing: 4, margin: "0 0 12px", lineHeight: 1,
        }}>
          PAGE NOT<br /><span style={{ color: "#34d399" }}>FOUND</span>
        </h1>
        <p style={{
          color: "#9ca3af", fontSize: 14, lineHeight: 1.7,
          margin: "0 0 32px",
        }}>
          The page <code style={{
            fontFamily: "'Space Mono', monospace",
            background: "#12141c", padding: "2px 8px",
            borderRadius: 4, fontSize: 12, color: "#60a5fa",
          }}>{location.pathname}</code> doesn't exist.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#34d39914",
            border: "1px solid #34d39922",
            borderRadius: 10, padding: "12px 24px",
            color: "#34d399", fontFamily: "'Space Mono', monospace",
            fontSize: 12, letterSpacing: 1, cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#34d39920";
            e.currentTarget.style.borderColor = "#34d39944";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#34d39914";
            e.currentTarget.style.borderColor = "#34d39922";
          }}
        >
          <ArrowLeft size={14} /> BACK TO HOME
        </button>
      </div>
    </div>
  );
};

export default NotFound;
