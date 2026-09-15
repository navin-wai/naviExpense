import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

function getCurrentMonth() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
}

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function getAllTransaction() {
    try {
      const response = await fetch(`${API_URL}/transaction`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load transactions");
      }

      setTransactions(result.transactions || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllTransaction();
  }, []);

  const monthTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    const transactionMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;
    return transactionMonth === selectedMonth;
  });

  const income = monthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
  const expenses = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
  const balance = income - expenses;

  const expensesByCategory = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((totals, transaction) => {
      const category = transaction.category || "other";
      totals[category] = (totals[category] || 0) + Number(transaction.amount);
      return totals;
    }, {});

  const categoryEntries = Object.entries(expensesByCategory).sort(
    ([, firstAmount], [, secondAmount]) => secondAmount - firstAmount,
  );

  async function handleClick(id) {
    try {
      const response = await fetch(`${API_URL}/transaction/${id}`, {
        credentials: "include",
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "unable to delte transaction");
      }

      setTransactions((currentTransactions) =>
        currentTransactions.filter((transaction) => transaction._id !== id),
      );
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="dashboard-content">
      {loading && <p className="loading-state">Loading your transactions...</p>}
      {error && (
        <p className="error-state" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="month-filter">
            <label htmlFor="month">Showing month</label>
            <input
              type="month"
              id="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            />
          </div>
          <section
            className="stats-grid"
            aria-label="Money summary"
            key={selectedMonth}
          >
            <article className="stat-card featured">
              <p className="stat-label">Available balance</p>
              <p className="stat-value">
                ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p className="stat-caption">Income after recorded expenses</p>
            </article>
            <article className="stat-card">
              <p className="stat-label">Money in</p>
              <p className="stat-value">
                ₹{income.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p className="stat-caption">Total income recorded</p>
            </article>
            <article className="stat-card">
              <p className="stat-label">Money out</p>
              <p className="stat-value">
                ₹
                {expenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
              <p className="stat-caption">Total expenses recorded</p>
            </article>
          </section>

          <div className="dashboard-grid">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Activity</p>
                  <h2>Recent transactions</h2>
                </div>
                <span className="panel-kicker">
                  {monthTransactions.length} this month
                </span>
              </div>
              {monthTransactions.length === 0 ? (
                <p className="empty-state">
                  No transactions in this month. Add one to start seeing your
                  patterns.
                </p>
              ) : (
                monthTransactions.map((transaction, index) => (
                  <article
                    className="transaction-row"
                    key={transaction._id}
                    style={{ "--row-index": index }}
                  >
                    <span className="transaction-icon">
                      {(transaction.category || "other").slice(0, 2)}
                    </span>
                    <div>
                      <p className="transaction-title">
                        {transaction.description || transaction.category}
                      </p>
                      <p className="transaction-date">
                        {transaction.category} ·{" "}
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === "income" ? "+" : "-"}₹
                      {Number(transaction.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => handleClick(transaction._id)}
                      >
                        Delete
                      </button>
                    </p>
                  </article>
                ))
              )}
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Spending map</p>
                  <h2>By category</h2>
                </div>
              </div>
              {categoryEntries.length === 0 ? (
                <p className="empty-state">No expenses yet.</p>
              ) : (
                categoryEntries.map(([category, amount], index) => (
                  <div
                    className="category-item"
                    key={category}
                    style={{ "--category-index": index }}
                  >
                    <div className="category-line">
                      <span>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <strong>
                        ₹
                        {amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </strong>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.min((amount / expenses) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
