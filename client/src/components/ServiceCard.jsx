import React from 'react';
import { Link } from 'react-router-dom';

function ServiceCard({ service }) {
  const { slug, title, short, price, image } = service;

  const styles = {
    card: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      border: '1px solid #eee',
      borderRadius: 6,
      padding: 16,
      height: '100%',
    },
    img: {
      width: '100%',
      height: 260,
      objectFit: 'cover',
      borderRadius: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: 700,
      textTransform: 'lowercase',
      margin: '4px 0 0',
    },
    short: {
      color: '#666',
      minHeight: 44, // wyrównanie wysokości kart przy różnej długości opisu
      lineHeight: 1.4,
    },
    footer: {
      marginTop: 'auto', // dociśnij stopkę na dół karty
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    },
    price: {
      fontWeight: 700,
    },
    link: {
      marginLeft: 'auto',
      background: '#a03333',
      color: '#fff',
      padding: '10px 16px',
      textDecoration: 'none',
      borderRadius: 4,
    },
  };

  return (
    <article style={styles.card}>
      <img src={image} alt={title} style={styles.img} />
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.short}>{short}</p>

      <div style={styles.footer}>
        <span style={styles.price}>{price} PLN</span>
        <Link to={`/uslugi/${slug}`} style={styles.link}>Zobacz</Link>
      </div>
    </article>
  );
}

export default ServiceCard;
