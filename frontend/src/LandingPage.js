import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Enhanced animated gradient CSS with floating button effect
const gradientAnimation = `
@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 100%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 0%; }
  100% { background-position: 0% 50%; }
}
.lively-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(270deg, #27187E, #3B1E9A, #2D1773, #f96d00, #6c63ff, #27187E, #f96d00, #3B1E9A);
  background-size: 2000% 2000%;
  animation: gradientBG 24s ease-in-out infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  transition: background 0.5s;
  padding: 0 1rem;
  box-sizing: border-box;
}
.float-btn {
  width: 100%;
  border: none;
  color: white;
  border-radius: 15px;
  padding: 1rem;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: transform 0.2s cubic-bezier(.4,2,.6,1), box-shadow 0.2s;
}
.float-btn.login {
  background: #f96d00;
}
.float-btn.signup {
  background: #6c63ff;
}
.float-btn:hover, .float-btn:focus {
  transform: translateY(-8px) scale(1.04);
  box-shadow: 0 12px 24px rgba(0,0,0,0.25);
}
`;

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <>
      <style>{gradientAnimation}</style>
      <div className="lively-bg">
        <h1
          style={{
            fontWeight: "800",
            fontSize: "3.1rem",
            lineHeight: "1.2",
            marginBottom: "1rem",
            textAlign: "center",
            color: "white",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          Fintech Literacy AI Coach
        </h1>
        <p
          style={{
            opacity: 0.9,
            maxWidth: "100vw",
            fontSize: "1.2rem",
            textAlign: "center",
            marginBottom: "2.5rem",
            color: "white",
            textShadow: "0 1px 6px rgba(0,0,0,0.4)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          Empower yourself with the first AI coach designed to enhance your fintech literacy and financial skills.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Link to="/login" style={{ textDecoration: "none", flex: 1 }}>
            <button className="float-btn login">
              Log in
            </button>
          </Link>
          <Link to="/register" style={{ textDecoration: "none", flex: 1 }}>
            <button className="float-btn signup">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LandingPage;