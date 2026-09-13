import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

function Login() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      console.log("STATUS:", response.status);
      console.log("CONTENT TYPE:", response.headers.get("content-type"));

      const text = await response.text();

      console.log("RESPONSE:", text);

      if (!response.ok) {
        let message = "Couldn't Get Account";

        try {
          const data = JSON.parse(text);
          message = data.message || message;
        } catch {
          // Response wasn't JSON
        }

        throw new Error(message);
      }

      window.location.assign("/");
    } catch (error) {
      console.error("SIGNUP ERROR:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="app-shell">
      <main className="page-container auth-page">
        <div className="auth-layout">
          <section className="auth-copy">
            <p className="eyebrow">Welcome back</p>
            <h1>Your money, right where you left it.</h1>
            <p>
              Sign in to pick up your financial picture exactly where you left
              it.
            </p>
          </section>
          <section className="auth-card">
            <h2>Sign in to NaviExpense</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                />
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button
                className="form-submit"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <p className="form-footer">
              New to NaviExpense? <Link to="/signup">Create an account</Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;
