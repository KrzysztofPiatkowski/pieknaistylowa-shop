import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ServiceGrid from './components/ServiceGrid';
import ServicePage from './pages/ServicePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import OrdersPage from './pages/OrdersPage';
import NotFoundPage from './pages/NotFoundPage';

import logo from './assets/logo-pieknaistylowa.png';

function App() {
  const cartCount = useSelector(
    (state) => state.cart.items.reduce((acc, item) => acc + item.qty, 0)
  );

  const styles = {
    shell: { width: '60%', margin: '0 auto' },
    topbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '16px 0',
    },
    logo: { height: 44, width: 'auto', display: 'block' },
    cartLink: {
      position: 'relative',
      textDecoration: 'none',
      background: '#a03333',
      color: '#fff',
      padding: '10px 14px',
      borderRadius: 6,
      display: 'inline-block',
      minWidth: 72,
      textAlign: 'center',
    },
    badge: {
      position: 'absolute',
      top: -8,
      right: -8,
      minWidth: 22,
      height: 22,
      borderRadius: 11,
      background: '#222',
      color: '#fff',
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 6px',
      lineHeight: 1,
      border: '2px solid #fff',
    },
    title: {
      textAlign: 'center',
      fontSize: 32,
      fontWeight: 800,
      margin: '8px 0 20px',
    },
    footer: {
      marginTop: 40,
      padding: '24px 0',
      borderTop: '1px solid #eee',
      color: '#666',
      fontSize: 14,
      textAlign: 'center',
    },
  };

  return (
    <BrowserRouter>
      <div style={styles.shell}>
        <div style={styles.topbar}>
          <Link to="/" style={{ display: 'inline-flex' }}>
            <img src={logo} alt="piękna i stylowa — logo" style={styles.logo} />
          </Link>

          <Link to="/koszyk" style={styles.cartLink}>
            Koszyk
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>
        </div>

        <h1 style={styles.title}>Wybierz idealną usługę dla siebie!</h1>

        <Routes>
          <Route
            path="/"
            element={
              <main className="App" style={{ paddingBottom: 20 }}>
                <ServiceGrid />
              </main>
            }
          />
          <Route path="/uslugi/:slug" element={<ServicePage />} />
          <Route path="/koszyk" element={<CartPage />} />
          <Route path="/zamowienie" element={<CheckoutPage />} />
          <Route path="/dziekujemy/:id" element={<ThankYouPage />} />
          <Route path="/zamowienia" element={<OrdersPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <footer style={styles.footer}>
          © {new Date().getFullYear()} Piękna i Stylowa — wszystkie prawa zastrzeżone
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
