import React, { useState } from "react";

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  /*
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert("Login submitted");
  };
  */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
      } else {
        alert("Login successful!");

        // You might want to save token or user info in localStorage or context
        localStorage.setItem("userToken", data.token); // assuming backend sends token
        // Then redirect user or update UI accordingly
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  /*
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    alert("Signup submitted");
  };
  */
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    // get values from form inputs by id
    const name = document.getElementById("name").value;
    const email = document.getElementById("emailSignup").value;
    const password = document.getElementById("passwordSignup").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed");
      } else {
        alert("Signup successful! You can now login.");
        setIsLogin(true); // switch to login form after signup
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };


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
          {/* Removed nav here */}

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
          {/* Top buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <button
              onClick={() => setIsLogin(false)}
              style={{
                border: isLogin ? "1.5px solid #6c63ff" : "none",
                background: isLogin ? "transparent" : "#6c63ff",
                color: isLogin ? "#6c63ff" : "white",
                borderRadius: "20px",
                padding: "0.4rem 1rem",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
              }}
            >
              Sign up
            </button>
            <button
              onClick={() => setIsLogin(true)}
              style={{
                border: isLogin ? "none" : "1.5px solid #f96d00",
                background: isLogin ? "#f96d00" : "transparent",
                color: isLogin ? "white" : "#f96d00",
                borderRadius: "20px",
                padding: "0.4rem 1.3rem",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
              }}
            >
              Log in
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLoginSubmit}>
              <label
                htmlFor="email"
                style={{ fontWeight: "600", fontSize: "0.9rem", display: "block" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email here..."
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "15px",
                  border: "1.5px solid #ddd",
                  marginBottom: "1.4rem",
                  fontSize: "1rem",
                }}
                required
              />

              <label
                htmlFor="password"
                style={{ fontWeight: "600", fontSize: "0.9rem", display: "block" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="********"
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "15px",
                  border: "1.5px solid #ddd",
                  marginBottom: "1.1rem",
                  fontSize: "1rem",
                }}
                required
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <button
                  type="submit"
                  style={{
                    background: "#f96d00",
                    border: "none",
                    color: "white",
                    padding: "0.7rem 2rem",
                    borderRadius: "20px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "1rem",
                    flex: "0 0 auto",
                  }}
                >
                  Login
                </button>
                <a
                  href="#"
                  style={{ color: "#1d70ff", fontWeight: "600", fontSize: "0.9rem" }}
                >
                  Forgot Password
                </a>
              </div>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "1.6rem",
                  fontSize: "0.9rem",
                  color: "#555",
                }}
              >
                Don’t have any account yet?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  style={{
                    color: "#f96d00",
                    fontWeight: "600",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  Register
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit}>
              <label
                htmlFor="name"
                style={{ fontWeight: "600", fontSize: "0.9rem", display: "block" }}
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "15px",
                  border: "1.5px solid #ddd",
                  marginBottom: "1.4rem",
                  fontSize: "1rem",
                }}
                required
              />

              <label
                htmlFor="emailSignup"
                style={{ fontWeight: "600", fontSize: "0.9rem", display: "block" }}
              >
                Email
              </label>
              <input
                id="emailSignup"
                type="email"
                placeholder="Email here..."
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "15px",
                  border: "1.5px solid #ddd",
                  marginBottom: "1.4rem",
                  fontSize: "1rem",
                }}
                required
              />

              <label
                htmlFor="passwordSignup"
                style={{ fontWeight: "600", fontSize: "0.9rem", display: "block" }}
              >
                Password
              </label>
              <input
                id="passwordSignup"
                type="password"
                placeholder="********"
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "15px",
                  border: "1.5px solid #ddd",
                  marginBottom: "1.4rem",
                  fontSize: "1rem",
                }}
                required
              />

              <label
                htmlFor="confirmPassword"
                style={{ fontWeight: "600", fontSize: "0.9rem", display: "block" }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="********"
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  borderRadius: "15px",
                  border: "1.5px solid #ddd",
                  marginBottom: "2rem",
                  fontSize: "1rem",
                }}
                required
              />

              <button
                type="submit"
                style={{
                  background: "#6c63ff",
                  border: "none",
                  color: "white",
                  padding: "0.7rem 2rem",
                  borderRadius: "20px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "1rem",
                  width: "100%",
                  marginBottom: "1rem",
                }}
              >
                Register
              </button>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.9rem",
                  color: "#555",
                }}
              >
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  style={{
                    color: "#6c63ff",
                    fontWeight: "600",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
