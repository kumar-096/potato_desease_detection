import { useState } from "react";
import { signupUser } from "../../utils/authApi";

export default function SignupForm({ onSwitchToLogin }) {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signupUser(form);

      setSuccess("Account created! Please sign in.");

      setForm({ email: "", phone: "", password: "" });

      // ✅ Smooth UX: auto switch to login after short delay
      setTimeout(() => {
        onSwitchToLogin();
      }, 1000);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>Email (optional)</label>
      <input
        type="email"
        placeholder="Enter email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <label>Mobile Number</label>
      <input
        type="tel"
        placeholder="Enter mobile number"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
        required
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Create password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        required
      />

      {error && <p className="auth-error">{error}</p>}
      {success && <p className="auth-success">{success}</p>}

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
