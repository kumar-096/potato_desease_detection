import { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import "./Auth.css";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="auth-title">🌱 Plant Disease Detector</h1>
        <p className="auth-subtitle">
          Identify crop diseases instantly
        </p>

        <div className="auth-toggle">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Sign In
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <motion.div
          key={mode}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {mode === "login" ? (
            <LoginForm onLogin={onLogin} />
          ) : (
            <SignupForm onSwitchToLogin={() => setMode("login")} />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
