import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../features/cart/cartSlice";
import { apiFetch } from "../api";

import imgAnalizaKolor from "../assets/analiza-kolorystyczna.png";
import imgKsztaltTwarzy from "../assets/analiza-ksztaltu-twarzy.png";
import imgSylwetka from "../assets/analiza-sylwetki.png";
import imgZakupy from "../assets/zakupy-ze-stylistka.png";
import imgSzafaKaps from "../assets/szafa-kapsulowa.png";
import imgPrzegladSzafy from "../assets/przeglad-szafy.png";

const IMAGE_BY_ID = {
  1: imgAnalizaKolor,
  2: imgKsztaltTwarzy,
  3: imgSylwetka,
  4: imgZakupy,
  5: imgSzafaKaps,
  6: imgPrzegladSzafy,
};

const SHORT_BY_SLUG = {
  "analiza-kolorystyczna": "poznaj kolory, w których zawsze będziesz wyglądać zjawiskowo",
  "analiza-ksztaltu-twarzy": "poznaj fryzurę i dodatki najlepsze dla Twojego kształtu twarzy",
  "analiza-sylwetki": "poznaj atuty swojej sylwetki i naucz się je podkreślać",
  "zakupy-ze-stylistka": "oszczędź czas i zyskaj pewność trafionych wyborów",
  "szafa-kapsulowa": "nawet 100 stylizacji z jednej, przemyślanej szafy",
  "przeglad-szafy": "co oddać, co zostawić i jak łączyć ubrania",
};

const LONG_BY_SLUG = {
  "analiza-kolorystyczna": [
    "Odkryj swoje kolory i ciesz się barwnym życiem",
    "Wydobądź z siebie naturalne piękno i emanuj radością życia, której znajomi Ci pozazdroszczą.",
    "Wejdź do świata kolorów ubrań, włosów i kosmetyków idealnie dopasowanych do Twojej urody."
  ].join("\n"),
  "analiza-sylwetki": [
    "Nie musisz gubić nawet jednego kilograma, żeby wyglądać oszałamiająco",
    "Z pewnością widujesz osoby, które poprzez niewłaściwy dobór ubrań albo dodają sobie kilogramów, albo zaburzają proporcje swojej sylwetki.",
    "Nie popełniaj ich błędów! Poznaj „swoje” fasony ubrań i przygotuj się na mnóstwo komplementów – dziś, jutro, na zawsze.."
  ].join("\n"),
  "analiza-ksztaltu-twarzy": [
    "Pierwsze wrażenie robi się tylko raz!",
    "Dobrze wykorzystaj te kilka, pierwszych sekund.",
    "Zapomnij o źle dobranej fryzurze, cięciu włosów, makijażu czy biżuterii.",
    "Podejmuj decyzje, które ukryją niedoskonałości i zyskaj więcej pewności siebie."
  ].join("\n"),
  "zakupy-ze-stylistka": [
    "Chcesz mieć pewność w 100% trafionych zakupów? Nic prostszego!",
    "Spędzasz długie godziny w galeriach lub na stronach sklepów odzieżowych, nie wiedząc co wybrać?",
    "Umów się ze mną na wspólne zakupy, a dopasujemy ubrania, nie tylko do Twojej sylwetki i typu kolorystycznego, ale również do Twojego stylu.",
  ].join("\n"),
  "szafa-kapsulowa": [
    "Gotowe stylizacje na każdą okazję w jednej szafie?",
    "To możliwe!",
    "Wyobraź sobie przyszłość, w której nie musisz zastanawiać się co ubrać, ponieważ masz gotowe, idealne stylizacje na każdy dzień i każdą okazję.",
  ].join("\n"),
  "przeglad-szafy": [
    "Masz w szafie dużo ubrań, a mimo wszystko każdego dnia nie wiesz co ubrać?",
    "Wspólnie przejrzymy Twoją szafę i przygotujemy stylizacje, które będą pasować do Twojego typu kolorystycznego i Twojej sylwetki.",
  ].join("\n"),
};

const assetsCtx = require.context(
  "../assets",
  false,
  /\.(png|jpe?g|webp)$/i
);

function galleryForSlug(slug) {
  const tryNames = (n) => [
    `./${slug}-${n}.jpg`,
    `./${slug}-${n}.jpeg`,
    `./${slug}-${n}.png`,
    `./${slug}-${n}.webp`,
  ];

  const out = [];
  for (let n = 1; n <= 3; n++) {
    let found = null;
    for (const name of tryNames(n)) {
      try {
        found = assetsCtx(name);
        break;
      } catch {
      }
    }
    if (found) out.push(found);
  }
  return out;
}

function ServicePage() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const data = await apiFetch("/products");
        if (!Array.isArray(data)) throw new Error("Niepoprawny format odpowiedzi z API.");
        if (mounted) setProducts(data);
      } catch (e) {
        if (mounted) setError(e.message || "Nie udało się pobrać produktu.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const product = useMemo(() => {
    const p = products.find(p => p.slug === slug);
    if (!p) return null;
    return {
      ...p,
      image: IMAGE_BY_ID[p.id] || null,
      short: SHORT_BY_SLUG[p.slug] || "",
      long: LONG_BY_SLUG[p.slug] || "",
    };
  }, [products, slug]);

  const gallery = useMemo(() => (product ? galleryForSlug(product.slug) : []), [product]);
  const [activeImg, setActiveImg] = useState(null);

  useEffect(() => {
    setActiveImg((product?.image) || gallery[0] || null);
  }, [product, gallery]);

  const [qty, setQty] = useState(1);
  const onQtyChange = (e) => {
    const v = parseInt(e.target.value, 10);
    setQty(Number.isFinite(v) && v > 0 ? v : 1);
  };

  const addToCartClick = () => {
    if (!product) return;
    dispatch(addItem({ id: Number(product.id), qty, note: "" }));
    alert(`Dodano do koszyka: ${product.title} × ${qty}`);
  };

  const styles = {
    page: { padding: 20 },
    back: { display: 'inline-block', marginBottom: 16, textDecoration: 'none' },
    wrap: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' },
    left: {},
    mainImg: { width: '100%', maxWidth: 640, borderRadius: 6, display: 'block' },
    thumbs: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12 },
    thumbBtn: { border: 0, padding: 0, background: 'transparent', cursor: 'pointer' },
    thumbImg: (isActive) => ({
      width: '100%', height: 110, objectFit: 'cover', borderRadius: 6,
      outline: isActive ? '3px solid #a03333' : '1px solid #ddd'
    }),
    right: { display: 'grid', gap: 12 },
    title: { margin: 0, textTransform: 'lowercase' },
    price: { fontSize: 18, fontWeight: 700 },
    lead: { color: '#666', lineHeight: 1.5 },
    qtyRow: { display: 'flex', alignItems: 'center', gap: 8 },
    qtyInput: { width: 80, padding: '8px 10px' },
    addBtn: { background: '#a03333', color: '#fff', padding: '12px 16px', border: 0, borderRadius: 6, cursor: 'pointer' },
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <Link to="/" style={styles.back}>← Powrót</Link>
        <p>Ładowanie…</p>
      </main>
    );
  }
  if (error) {
    return (
      <main style={styles.page}>
        <Link to="/" style={styles.back}>← Powrót</Link>
        <p style={{ color: "#b23" }}>Błąd: {error}</p>
      </main>
    );
  }
  if (!product) {
    return (
      <main style={styles.page}>
        <Link to="/" style={styles.back}>← Powrót</Link>
        <h1>Nie znaleziono usługi</h1>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <Link to="/" style={styles.back}>← Powrót</Link>

      <div style={styles.wrap}>
        <div style={styles.left}>
          {activeImg && <img src={activeImg} alt={product.title} style={styles.mainImg} />}
          <h3>Zobacz metamorfozy moich klientek</h3>
          {gallery.length > 0 && (
            <div style={styles.thumbs}>
              {gallery.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(src)}
                  style={styles.thumbBtn}
                  aria-label={`Zdjęcie ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`${product.title} – metamorfoza ${i + 1}`}
                    style={styles.thumbImg(activeImg === src)}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={styles.right}>
          <h1 style={styles.title}>{product.title}</h1>
          <div style={styles.price}>{product.price} PLN</div>
          <p style={styles.lead}>
            {(product.long || product.short).split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>

          <label style={styles.qtyRow}>
            Ilość:
            <input
              type="number"
              min="1"
              value={qty}
              onChange={onQtyChange}
              style={styles.qtyInput}
            />
          </label>

          <button type="button" onClick={addToCartClick} style={styles.addBtn}>
            Dodaj do koszyka
          </button>
        </div>
      </div>
    </main>
  );
}

export default ServicePage;
