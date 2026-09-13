import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

function Signup() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const response = await fetch(`${API_URL}/user/signup`, {
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
        let message = "Couldn't Create Account";

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
            <p className="eyebrow">A better starting point</p>
            <h1>Make the everyday money decisions easier.</h1>
            <p>
              Build a clear view of your spending from the very first
              transaction.
            </p>
          </section>
          <section className="auth-card">
            <h2>Create your workspace</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="fullName">Full name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  required
                  placeholder="Your name"
                />
              </div>
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
                  autoComplete="new-password"
                  minLength="8"
                  required
                  placeholder="At least 8 characters"
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
                {submitting ? "Creating..." : "Create workspace"}
              </button>
            </form>
            <p className="form-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Signup;
