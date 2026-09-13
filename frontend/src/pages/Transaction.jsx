import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Transaction() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function getDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const formData = new FormData(form);
      const response = await fetch(`${API_URL}/transaction`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save transaction");
      }

      form.reset();
      setMessage("Transaction saved successfully");
      window.location.assign("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-shell">
      <main className="page-container transaction-layout">
        <section className="transaction-heading">
          <p className="eyebrow">Keep the picture current</p>
          <h1>Log it now. Understand it later.</h1>
          <p>
            Add an income or expense and your dashboard will update
            automatically.
          </p>
          <p className="footer-note">
            Private by design · Built for everyday clarity
          </p>
        </section>
        <section className="transaction-form-card">
          <form onSubmit={handleSubmit}>
            <div
              className="type-toggle"
              role="radiogroup"
              aria-label="Transaction type"
            >
              <div>
                <input type="radio" id="income" name="type" value="income" />
                <label htmlFor="income">Income</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="expense"
                  name="type"
                  value="expense"
                  defaultChecked
                />
                <label htmlFor="expense">Expense</label>
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
              />
            </div>
            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select name="category" id="category" required>
                <option value="food">Food</option>
                <option value="clothes">Clothes</option>
                <option value="bills">Bills</option>
                <option value="entertainment">Entertainment</option>
                <option value="health">Health</option>
                <option value="salary">Salary</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="description">
                Description <span className="field-hint">Optional</span>
              </label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="What was this for?"
              />
            </div>
            <div className="form-field">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                defaultValue={getDate()}
                required
              />
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {message && <p className="form-success">{message}</p>}
            <button className="form-submit" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save transaction"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Transaction;
