import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #27187E 0%, #3B1E9A 35%, #2D1773 100%)",
        color: "white",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "95%",
          maxWidth: "1100px",
          backgroundColor: "#2e2677",
          borderRadius: "30px",
          padding: "3rem 4rem",
          display: "flex",
          gap: "3rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left Content */}
        <div style={{ flex: 1, paddingTop: "40px" }}>
          {/* Heading */}
          <h1
            style={{
              fontWeight: "800",
              fontSize: "2.8rem",
              lineHeight: "1.2",
              marginBottom: "1rem",
            }}
          >
            Fintech Literacy <br />
            AI Coach
          </h1>

          {/* Subheading */}
          <p style={{ opacity: 0.75, maxWidth: "320px", fontSize: "1rem" }}>
          Empower yourself with the first AI coach designed to enhance your fintech literacy and financial skills.
          </p>
        </div>

        {/* Right Form Card */}
        <div
          style={{
            flexBasis: "380px",
            background: "white",
            borderRadius: "20px",
            padding: "2rem 2.5rem",
            boxShadow: "15px 15px 20px rgba(0,0,0,0.15)",
            color: "#333",
            position: "relative",
            top: "40px",
          }}
        >
          {/* Main buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              padding: "2rem 0",
            }}
          >
            <Link to="/login" style={{ textDecoration: "none", width: "100%" }}>
              <button
                style={{
                  width: "100%",
                  background: "#f96d00",
                  border: "none",
                  color: "white",
                  borderRadius: "15px",
                  padding: "1rem",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                }}
              >
                Log in
              </button>
            </Link>
            <Link to="/register" style={{ textDecoration: "none", width: "100%" }}>
              <button
                style={{
                  width: "100%",
                  background: "#6c63ff",
                  border: "none",
                  color: "white",
                  borderRadius: "15px",
                  padding: "1rem",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                }}
              >
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
