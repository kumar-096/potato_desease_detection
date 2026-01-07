import { useState } from "react";
import { loginUser } from "../../utils/authApi";

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload =
      form.identifier.includes("@")
        ? { email: form.identifier, password: form.password }
        : { phone: form.identifier, password: form.password };

    try {
      const res = await loginUser(payload);

      // ✅ Save token
      localStorage.setItem("token", res.access_token);

      // ✅ Notify App.js
      onLogin();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>Email or Mobile</label>
      <input
        type="text"
        placeholder="Enter email or mobile number"
        value={form.identifier}
        onChange={(e) =>
          setForm({ ...form, identifier: e.target.value })
        }
        required
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        required
      />

      {error && <p className="auth-error">{error}</p>}

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
