import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";

import imgAnalizaKolor from "../assets/analiza-kolorystyczna.png";
import imgKsztaltTwarzy from "../assets/analiza-ksztaltu-twarzy.png";
import imgSylwetka from "../assets/analiza-sylwetki.png";
import imgZakupy from "../assets/zakupy-ze-stylistka.png";
import imgSzafaKaps from "../assets/szafa-kapsulowa.png";
import imgPrzegladSzafy from "../assets/przeglad-szafy.png";

const API_URL = "http://localhost:4000/api/products";

const IMAGE_BY_SLUG = {
  "analiza-kolorystyczna": imgAnalizaKolor,
  "analiza-ksztaltu-twarzy": imgKsztaltTwarzy,
  "analiza-sylwetki": imgSylwetka,
  "zakupy-ze-stylistka": imgZakupy,
  "szafa-kapsulowa": imgSzafaKaps,
  "przeglad-szafy": imgPrzegladSzafy,
};

const SHORT_BY_SLUG = {
  "analiza-kolorystyczna": "poznaj kolory, w których zawsze będziesz wyglądać zjawiskowo",
  "analiza-ksztaltu-twarzy": "dobierz fryzurę i dodatki idealne do kształtu twarzy",
  "analiza-sylwetki": "odkryj atuty sylwetki i naucz się je podkreślać",
  "zakupy-ze-stylistka": "oszczędź czas i zyskaj pewność trafionych wyborów",
  "szafa-kapsulowa": "nawet 100 stylizacji z jednej, przemyślanej szafy",
  "przeglad-szafy": "co oddać, co zostawić i jak łączyć ubrania",
};

function ServiceGrid() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(API_URL);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Błąd pobierania (${res.status})`);
      }

      const raw = await res.json();
      const enriched = raw.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        price: p.price,
        image: IMAGE_BY_SLUG[p.slug],
        short: SHORT_BY_SLUG[p.slug] || "",
      }));

      enriched.sort((a, b) => a.id - b.id);

      setServices(enriched);
    } catch (e) {
      setError(e?.message || "Nieznany błąd pobierania.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const styles = {
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)", // 3 kolumny
      gap: 24,
      alignItems: "stretch",
    },
    info: { padding: 20, color: "#666" },
    errorBox: {
      padding: 16,
      border: "1px solid #e88",
      background: "#fee",
      borderRadius: 8,
      color: "#933",
      display: "grid",
      gap: 12,
    },
    btn: {
      background: "#a03333",
      color: "#fff",
      padding: "10px 14px",
      border: 0,
      borderRadius: 6,
      cursor: "pointer",
      width: "fit-content",
    },

    skelCard: {
      border: "1px solid #eee",
      borderRadius: 6,
      padding: 16,
      display: "grid",
      gap: 12,
      height: "100%",
    },
    skelImg: {
      width: "100%",
      height: 260,
      background: "#f2f2f2",
      borderRadius: 4,
    },
    skelLine: {
      height: 14,
      background: "#f2f2f2",
      borderRadius: 4,
    },
  };

  if (loading) {
    return (
      <div style={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={styles.skelCard}>
            <div style={styles.skelImg} />
            <div style={{ ...styles.skelLine, width: "60%" }} />
            <div style={{ ...styles.skelLine, width: "95%" }} />
            <div style={{ ...styles.skelLine, width: "80%" }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorBox}>
        <div><strong>Nie udało się pobrać usług.</strong></div>
        <div style={{ color: "#555" }}>{error}</div>
        <button type="button" style={styles.btn} onClick={load}>
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}

export default ServiceGrid;
