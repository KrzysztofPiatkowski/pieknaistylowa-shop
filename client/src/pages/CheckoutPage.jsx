import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import services from "../data/services";
import { clearCart } from "../features/cart/cartSlice";
import { apiFetch } from '../api';

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(state => state.cart.items);

  const view = useMemo(() => {
    const byId = new Map(services.map(s => [s.id, s]));
    const rows = items
      .map(({ id, qty, note }) => {
        const svc = byId.get(id);
        if (!svc) return null;
        return {
          id: Number(id),
          title: svc.title,
          price: svc.price,
          qty: Number(qty),
          note: note || "",
          lineTotal: svc.price * Number(qty),
        };
      })
      .filter(Boolean);

    const totalQty = rows.reduce((acc, r) => acc + r.qty, 0);
    const totalPrice = rows.reduce((acc, r) => acc + r.lineTotal, 0);

    return { rows, totalQty, totalPrice };
  }, [items]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (view.rows.length === 0) {
      alert("Koszyk jest pusty. Dodaj usługę, zanim złożysz zamówienie.");
      return;
    }
    if (!form.name.trim() || !form.email.trim()) {
      alert("Podaj imię i e-mail.");
      return;
    }
    if (!form.consent) {
      alert("Zaznacz zgodę na kontakt, abyśmy mogli odpowiedzieć.");
      return;
    }

    const payload = {
      contact: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        note: form.note.trim(),
      },
      items: view.rows.map(r => ({
        id: Number(r.id),
        qty: Number(r.qty),
        note: r.note,
      })),
      totals: {
        qty: Number(view.totalQty),
        price: Number(view.totalPrice),
      },
      createdAt: new Date().toISOString(),
    };

    console.log("ORDER payload (client):", payload);

    try {
      setIsSubmitting(true);

      const data = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!data || data.ok !== true) {
        throw new Error("Nieoczekiwana odpowiedź serwera.");
      }

      dispatch(clearCart());
      navigate(`/dziekujemy/${data.orderId ?? ""}`, {
        state: {
          orderId: data.orderId ?? null,
          total: view.totalPrice,
          qty: view.totalQty,
        },
      });
    } catch (err) {
      console.error("ORDER_SUBMIT error:", err);
      alert(err.message || "Wystąpił błąd podczas wysyłania zamówienia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    page: { padding: 20, display: "grid", gap: 16 },
    header: { display: "flex", alignItems: "center", gap: 12 },
    grid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px 6px" },
    td: { borderBottom: "1px solid #eee", padding: "8px 6px", verticalAlign: "middle" },
    right: { textAlign: "right" },
    card: { border: "1px solid #eee", borderRadius: 8, padding: 16, display: "grid", gap: 12 },
    field: { display: "grid", gap: 6 },
    input: { padding: "10px 12px", borderRadius: 6, border: "1px solid #ccc" },
    textarea: { padding: "10px 12px", borderRadius: 6, border: "1px solid #ccc", minHeight: 90 },
    submit: { background: "#a03333", color: "#fff", padding: "12px 16px", border: 0, borderRadius: 6, cursor: "pointer", opacity: isSubmitting ? 0.7 : 1 },
    muted: { color: "#666" },
  };

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <Link to="/">← Powrót</Link>
        <h1 style={{ margin: 0 }}>Zamówienie</h1>
      </div>

      <div style={styles.grid}>
        <section style={styles.card}>
          <h2 style={{ margin: 0 }}>Podsumowanie</h2>

          {view.rows.length === 0 ? (
            <p style={styles.muted}>Koszyk jest pusty.</p>
          ) : (
            <>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Usługa</th>
                    <th style={styles.th}>Cena</th>
                    <th style={styles.th}>Ilość</th>
                    <th style={styles.th}>Notatka</th>
                    <th style={{ ...styles.th, ...styles.right }}>Razem</th>
                  </tr>
                </thead>
                <tbody>
                  {view.rows.map(r => (
                    <tr key={r.id}>
                      <td style={styles.td}>{r.title}</td>
                      <td style={styles.td}>{r.price} PLN</td>
                      <td style={styles.td}>{r.qty}</td>
                      <td style={styles.td}>{r.note || "—"}</td>
                      <td style={{ ...styles.td, ...styles.right }}>{r.lineTotal} PLN</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td style={styles.td}><strong>Podsumowanie</strong></td>
                    <td style={styles.td}></td>
                    <td style={styles.td}><strong>{view.totalQty}</strong></td>
                    <td style={styles.td}></td>
                    <td style={{ ...styles.td, ...styles.right }}>
                      <strong>{view.totalPrice} PLN</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>

              <p style={styles.muted}>
                Edycję ilości/pozycji i notatek zrobisz w <Link to="/koszyk">koszyku</Link>.
              </p>
            </>
          )}
        </section>

        <section style={styles.card}>
          <h2 style={{ margin: 0 }}>Dane kontaktowe</h2>

          <form onSubmit={onSubmit}>
            <div style={styles.field}>
              <label>Imię i nazwisko</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={onChange}
                placeholder="np. Anna Nowak"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label>E-mail</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="np. anna@example.com"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label>Telefon (opcjonalnie)</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onChange}
                placeholder="np. 600 000 000"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label>Uwagi do zamówienia (opcjonalnie)</label>
              <textarea
                name="note"
                value={form.note}
                onChange={onChange}
                placeholder="np. preferowane terminy, miasto, inne informacje"
                style={styles.textarea}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={form.consent}
                onChange={onChange}
              />
              <label htmlFor="consent" style={styles.muted}>
                Wyrażam zgodę na kontakt w sprawie mojego zamówienia.
              </label>
            </div>

            <div style={{ marginTop: 12 }}>
              <button type="submit" style={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? "Wysyłanie..." : "Zamów"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default CheckoutPage;
