import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const PLN = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await apiFetch("/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Błąd przy pobieraniu zamówień:", e);
      setErr(e.message || "Nie udało się pobrać zamówień.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return String(iso);
    }
  };

  const styles = {
    page: { padding: 20, display: "grid", gap: 16 },
    header: { display: "flex", alignItems: "center", gap: 12 },
    spacer: { flex: 1 },
    btn: {
      background: "#a03333",
      color: "#fff",
      padding: "10px 14px",
      border: 0,
      borderRadius: 6,
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-block",
    },
    mutedBtn: {
      background: "#999",
      color: "#fff",
      padding: "10px 14px",
      border: 0,
      borderRadius: 6,
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-block",
    },
    card: { border: "1px solid #eee", borderRadius: 8, padding: 16, display: "grid", gap: 8 },
    row: { display: "grid", gap: 4 },
    label: { fontSize: 12, color: "#666" },
    value: { fontWeight: 600 },
    error: { color: "#b22" },
    empty: { color: "#666" },
    list: { display: "grid", gap: 12 },
  };

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <Link to="/">← Powrót</Link>
        <h1 style={{ margin: 0 }}>Zamówienia (demo)</h1>
        <div style={styles.spacer} />
        <button
          type="button"
          onClick={fetchOrders}
          style={loading ? styles.mutedBtn : styles.btn}
          disabled={loading}
          aria-busy={loading ? "true" : "false"}
        >
          {loading ? "Ładowanie..." : "Odśwież"}
        </button>
      </div>

      {err && <p style={styles.error}>Błąd: {err}</p>}
      {!err && loading && <p>Ładowanie…</p>}
      {!err && !loading && orders.length === 0 && (
        <p style={styles.empty}>Brak zamówień.</p>
      )}

      {!err && !loading && orders.length > 0 && (
        <section style={styles.list}>
          {orders.map((o) => (
            <article key={o.id} style={styles.card}>
              <div style={styles.row}>
                <span style={styles.label}>ID zamówienia</span>
                <span style={styles.value}>#{o.id}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Utworzone</span>
                <span>{fmtDate(o.createdAt)}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Klient</span>
                <span>
                  {o.contactName} ({o.contactEmail})
                  {o.contactPhone ? `, tel. ${o.contactPhone}` : ""}
                </span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Pozycje</span>
                <span>
                  {Array.isArray(o.items) && o.items.length
                    ? o.items.map((it) => `${it.title} × ${it.qty}`).join(", ")
                    : "—"}
                </span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Suma</span>
                <span className="value">{PLN.format(o.totalsPrice)}</span>
              </div>
              <div>
                <Link to={`/dziekujemy/${o.id}`} style={styles.btn}>
                  Szczegóły / podgląd
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default OrdersPage;
