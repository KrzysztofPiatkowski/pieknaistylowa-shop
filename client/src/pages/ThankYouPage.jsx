import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import services from "../data/services";
import { apiFetch } from "../api";

function ThankYouPage() {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  const byId = useMemo(() => new Map(services.map(s => [String(s.id), s])), []);

  useEffect(() => {
    let cancel = false;

    async function fetchOrder() {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const data = await apiFetch(`/orders/${id}`);
        if (!cancel) setOrder(data);
      } catch (e) {
        if (!cancel) setError(e.message || "Nie udało się pobrać zamówienia.");
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    fetchOrder();
    return () => { cancel = true; };
  }, [id]);

  const model = useMemo(() => {
    if (order) return order;

    const st = location.state || {};
    if (!st.orderId && !st.total && !st.qty) return null;

    return {
      id: st.orderId ?? null,
      createdAt: new Date().toISOString(),
      items: [],
      totals: { qty: st.qty ?? 0, price: st.total ?? 0 },
      contact: {},
    };
  }, [order, location.state]);

  const rows = useMemo(() => {
    if (!model?.items) return [];
    return model.items.map(it => {
      const svc = byId.get(String(it.id));
      const title = it.title || svc?.title || `Usługa #${it.id}`;
      const price = typeof it.price === "number" ? it.price : (svc?.price ?? 0);
      const qty = Number(it.qty) || 0;
      const lineTotal = typeof it.lineTotal === "number" ? it.lineTotal : price * qty;
      return { title, qty, lineTotal };
    });
  }, [model, byId]);

  const totals = useMemo(() => {
    const qty = model?.totals?.qty ?? rows.reduce((a, r) => a + r.qty, 0);
    const price = model?.totals?.price ?? rows.reduce((a, r) => a + r.lineTotal, 0);
    return { qty, price };
  }, [model, rows]);

  const createdAt = model?.createdAt ? new Date(model.createdAt) : new Date();

  const styles = {
    page: { padding: 20, display: "grid", gap: 12, justifyItems: "start" },
    h1: { margin: 0 },
    card: { border: "1px solid #eee", borderRadius: 8, padding: 16, width: "100%", maxWidth: 860 },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px 6px" },
    td: { borderBottom: "1px solid #eee", padding: "8px 6px", verticalAlign: "middle" },
    right: { textAlign: "right" },
    note: { color: "#666" },
    btn: {
      background: "#a03333",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: 6,
      textDecoration: "none",
      display: "inline-block",
    },
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <h1 style={styles.h1}>Ładowanie zamówienia…</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main style={styles.page}>
        <h1 style={styles.h1}>Ups!</h1>
        <p style={styles.note}>{error}</p>
        <Link to="/" style={styles.btn}>Wróć na stronę główną</Link>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.h1}>Dziękujemy za zamówienie!</h1>

      <p>
        Twoje zamówienie <strong>#{model?.id ?? "—"}</strong> zostało zarejestrowane w dniu{" "}
        <strong>{createdAt.toLocaleDateString()} {createdAt.toLocaleTimeString()}</strong>.
        <br />
        Wkrótce skontaktujemy się z Tobą z potwierdzeniem terminu i szczegółami.
      </p>

      <section style={styles.card}>
        <h2 style={{ margin: 0 }}>Podsumowanie zamówienia</h2>

        {rows.length === 0 ? (
          <p style={styles.note}>Brak szczegółów pozycji (tryb fallback).</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Usługa</th>
                <th style={styles.th}>Ilość</th>
                <th style={{ ...styles.th, ...styles.right }}>Razem (PLN)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={styles.td}>{r.title}</td>
                  <td style={styles.td}>{r.qty}</td>
                  <td style={{ ...styles.td, ...styles.right }}>{r.lineTotal}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={styles.td}><strong>Suma</strong></td>
                <td style={styles.td}><strong>{totals.qty}</strong></td>
                <td style={{ ...styles.td, ...styles.right }}>
                  <strong>{totals.price} PLN</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        )}

        <p style={styles.note}>
          Jeżeli dodałeś notatki do pozycji, stylistka je otrzymała razem z zamówieniem.
        </p>
      </section>

      <section style={styles.card}>
        <h2 style={{ margin: 0 }}>Dane kontaktowe</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <div>Imię i nazwisko</div>
            <div>E-mail</div>
            <div>Telefon</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>{model?.contact?.name || "—"}</div>
            <div>{model?.contact?.email || "—"}</div>
            <div>{model?.contact?.phone || "—"}</div>
          </div>
        </div>
      </section>

      <Link to="/" style={styles.btn}>Wróć na stronę główną</Link>
    </main>
  );
}

export default ThankYouPage;
