import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App.jsx";
import { api } from "../api.js";
import { WastePattern } from "../components/BgPatterns.jsx";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const resp = mode === "login" ? await api.login(email, password) : await api.signup(name, email, password);
      login(resp.token, resp.user);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <WastePattern />
      <Link to="/" className="back-home">← Back to home</Link>
      <form className="auth-card" onSubmit={submit}>
        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="sub">
          {mode === "login" ? "Log in to continue sorting smarter." : "Join EcoSort AI in a few seconds."}
        </p>

        {error && <div className="auth-error">{error}</div>}

        {mode === "signup" && (
          <div className="field">
            <label>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nitesh Kumar" required />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
        </div>

        <button type="submit" className="btn btn-primary full-w" disabled={busy}>
          {busy ? "Please wait…" : mode === "login" ? "Log In" : "Sign Up"}
        </button>

        <div className="auth-toggle">
          {mode === "login" ? "New here?" : "Already have an account?"}
          <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </div>
      </form>
    </div>
  );
}
