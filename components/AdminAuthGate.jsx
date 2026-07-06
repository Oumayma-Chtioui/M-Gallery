"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminAuthGate({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setSubmitting(false);
    if (error) setError(error.message);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (session === undefined) {
    return (
      <div style={{ padding: 60, color: "var(--ivory-dim)" }}>
        Chargement…
      </div>
    );
  }

  if (!session) {
    return (
      <div
        className="spotlight"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            width: 340,
            border: "1px solid var(--line-soft)",
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            background: "var(--black)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "0.2em",
              color: "var(--gold)",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            M.GALLERY — ADMIN
          </div>

          <input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          {error && (
            <div style={{ color: "#c0645a", fontSize: 13 }}>{error}</div>
          )}

          <button
            type="submit"
            className="btn btn-solid"
            disabled={submitting}
            style={{ justifyContent: "center" }}
          >
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 32px",
          fontSize: 12,
          color: "var(--ivory-dim)",
          borderBottom: "1px solid var(--line-soft)",
        }}
      >
        {session.user.email} ·{" "}
        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            color: "var(--gold)",
            marginLeft: 6,
            fontSize: 12,
          }}
        >
          Se déconnecter
        </button>
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  background: "var(--ink)",
  border: "1px solid var(--line-soft)",
  color: "var(--ivory)",
  padding: "10px 12px",
  fontFamily: "var(--font-body)",
  fontSize: 14,
};
