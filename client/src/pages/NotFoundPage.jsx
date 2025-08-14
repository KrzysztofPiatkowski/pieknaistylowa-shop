import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const styles = {
    page: { padding: 20, display: "grid", gap: 12 },
    h1: { margin: 0 },
    p: { color: "#666" },
    btn: {
      background: "#a03333",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: 6,
      textDecoration: "none",
      display: "inline-block",
      width: "fit-content",
    },
  };
  return (
    <main style={styles.page}>
      <h1 style={styles.h1}>404 – nie znaleziono strony</h1>
      <p style={styles.p}>
        Ups, taka ścieżka nie istnieje. Wróć na stronę główną albo przejdź do listy usług.
      </p>
      <Link to="/" style={styles.btn}>Strona główna</Link>
    </main>
  );
}
