import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setQty, removeItem, setNote } from "../features/cart/cartSlice";

import imgAnalizaKolor from "../assets/analiza-kolorystyczna.png";
import imgKsztaltTwarzy from "../assets/analiza-ksztaltu-twarzy.png";
import imgSylwetka from "../assets/analiza-sylwetki.png";
import imgZakupy from "../assets/zakupy-ze-stylistka.png";
import imgSzafaKaps from "../assets/szafa-kapsulowa.png";
import imgPrzegladSzafy from "../assets/przeglad-szafy.png";

import { apiFetch } from '../api';

const IMAGE_BY_ID = {
  1: imgAnalizaKolor,
  2: imgKsztaltTwarzy,
  3: imgSylwetka,
  4: imgZakupy,
  5: imgSzafaKaps,
  6: imgPrzegladSzafy,
};

function CartPage() {
  const dispatch = useDispatch();

  const items = useSelector(state => state.cart.items);

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    setProducts([]);

    (async () => {
      try {
        const data = await apiFetch('/products');

        if (!Array.isArray(data)) throw new Error("Niepoprawny format odpowiedzi z API.");
        if (isMounted) setProducts(data);
      } catch (e) {
        if (isMounted) setError(e.message || "Nie udało się pobrać listy produktów.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, []);

  const view = useMemo(() => {
    const byId = new Map(products.map(p => [p.id, p]));
    const rows = items
      .map(({ id, qty, note }) => {
        const prod = byId.get(Number(id));
        if (!prod) return null;
        const price = prod.price;
        return {
          id: Number(id),
          title: prod.title,
          price,
          qty: Number(qty),
          note: note || "",
          image: IMAGE_BY_ID[Number(id)] || null,
          lineTotal: price * Number(qty),
        };
      })
      .filter(Boolean);

    const totalQty = rows.reduce((acc, r) => acc + r.qty, 0);
    const totalPrice = rows.reduce((acc, r) => acc + r.lineTotal, 0);

    return { rows, totalQty, totalPrice };
  }, [items, products]);

  const styles = {
    page: { padding: 20, display: "grid", gap: 16 },
    header: { display: "flex", alignItems: "center", gap: 12 },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px 6px" },
    td: { borderBottom: "1px solid #eee", padding: "8px 6px", verticalAlign: "middle" },
    img: { width: 72, height: 48, objectFit: "cover", borderRadius: 4 },
    right: { textAlign: "right" },
    qtyInput: { width: 80, padding: "6px 8px" },
    noteArea: { width: "100%", minHeight: 64, padding: "8px 10px", border: "1px solid #ccc", borderRadius: 6 },
    rowActions: { display: "flex", alignItems: "center", gap: 8 },
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
    danger: {
      background: "#b23",
      color: "#fff",
      padding: "8px 10px",
      border: 0,
      borderRadius: 6,
      cursor: "pointer",
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
    empty: { color: "#666" },
    muted: { color: "#666" },
    footer: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 },
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.header}>
          <Link to="/">← Powrót</Link>
          <h1 style={{ margin: 0 }}>Koszyk</h1>
        </div>
        <p style={styles.muted}>Ładowanie produktów…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={styles.page}>
        <div style={styles.header}>
          <Link to="/">← Powrót</Link>
          <h1 style={{ margin: 0 }}>Koszyk</h1>
        </div>
        <p style={{ color: "#b23" }}>Błąd: {error}</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <Link to="/">← Powrót</Link>
        <h1 style={{ margin: 0 }}>Koszyk</h1>
      </div>

      {view.rows.length === 0 ? (
        <p style={styles.empty}>Twój koszyk jest pusty. Dodaj coś ze strony usług.</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Usługa</th>
                <th style={styles.th}>Cena</th>
                <th style={styles.th}>Ilość</th>
                <th style={styles.th}>Notatka</th>
                <th style={styles.th}>Akcje</th>
                <th style={{ ...styles.th, ...styles.right }}>Razem</th>
              </tr>
            </thead>
            <tbody>
              {view.rows.map(row => (
                <tr key={row.id}>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {row.image && <img src={row.image} alt={row.title} style={styles.img} />}
                      <span style={{ textTransform: "lowercase", fontWeight: 600 }}>
                        {row.title}
                      </span>
                    </div>
                  </td>

                  <td style={styles.td}>{row.price} PLN</td>

                  <td style={styles.td}>
                    <input
                      type="number"
                      min="1"
                      value={row.qty}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        dispatch(setQty({ id: row.id, qty: v }));
                      }}
                      style={styles.qtyInput}
                    />
                  </td>

                  <td style={styles.td}>
                    <textarea
                      value={row.note}
                      onChange={(e) => dispatch(setNote({ id: row.id, note: e.target.value }))}
                      placeholder="np. preferowany termin, kolorystyka, miasto…"
                      style={styles.noteArea}
                    />
                  </td>

                  <td style={styles.td}>
                    <div style={styles.rowActions}>
                      <button
                        type="button"
                        onClick={() => dispatch(removeItem({ id: row.id }))}
                        style={styles.danger}
                      >
                        Usuń
                      </button>
                    </div>
                  </td>

                  <td style={{ ...styles.td, ...styles.right }}>{row.lineTotal} PLN</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={styles.td}><strong>Podsumowanie</strong></td>
                <td style={styles.td}></td>
                <td style={styles.td}><strong>{view.totalQty}</strong></td>
                <td style={styles.td}></td>
                <td style={styles.td}></td>
                <td style={{ ...styles.td, ...styles.right }}>
                  <strong>{view.totalPrice} PLN</strong>
                </td>
              </tr>
            </tfoot>
          </table>

          <div style={styles.footer}>
            <Link to="/" style={styles.mutedBtn}>Kontynuuj zakupy</Link>
            <Link to="/zamowienie" style={styles.btn}>Przejdź do zamówienia</Link>
          </div>
        </>
      )}
    </main>
  );
}

export default CartPage;
