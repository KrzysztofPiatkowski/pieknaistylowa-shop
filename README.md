# Piękna i Stylowa

Link do działającej aplikacji: [https://pieknaistylowa-shop-jfn7.onrender.com/](https://pieknaistylowa-shop-jfn7.onrender.com/)


# 🛍️ Stylistka Shop

Aplikacja fullstack dla stylistki – katalog usług, koszyk, składanie zamówień i panel zamówień.

## 📦 Funkcje

- **Frontend (React + Redux)**
  - Strona główna z listą usług
  - Szczegóły usługi
  - Koszyk z dodawaniem, usuwaniem i notatkami
  - Formularz zamówienia (checkout)
  - Strona potwierdzenia zamówienia
  - Panel zamówień dla stylistki (lista + szczegóły)

- **Backend (NestJS + MySQL + TypeORM)**
  - API `/products` i `/orders`
  - Walidacja danych (DTO + ValidationPipe)
  - Zapis zamówień do bazy
  - Domyślny seed produktów

---

## 🗂 Struktura projektu

.
├── client/ # Frontend (React)
└── server/ # Backend (NestJS)


---

## ⚙️ Wymagania

- Node.js v18+
- MySQL 8+ lub kompatybilny
- npm

---

## 🚀 Instalacja i uruchomienie

1. **Sklonuj repozytorium**

git clone https://github.com/twoj-login/twoje-repo.git
cd twoje-repo

2. **Skonfiguruj zmienne środowiskowe**

Skopiuj pliki .env.sample do .env w client/ i server/ i uzupełnij wartości:

cp client/.env.sample client/.env
cp server/.env.sample server/.env

3. **Zainstaluj zależności**

cd client && npm install
cd ../server && npm install

4. **Uruchom backend**

cd server
npm run start:dev

5. **Uruchom frontend**

cd client
npm start


## 🔑 Zmienne środowiskowe

client/.env
REACT_APP_API_URL=http://localhost:4000/api

server/.env
DB_HOST=localhost
DB_PORT=3306
DB_USER=stylistka
DB_PASS=twoje-haslo
DB_NAME=stylistka_shop
PORT=4000


## 📜 Licencja

MIT


## 🛠 Użyte technologie

**Frontend**
- React 18
- Redux Toolkit
- React Router
- CSS/SCSS Modules

**Backend**
- NestJS 10
- TypeORM
- MySQL 8
- Class-validator / class-transformer (walidacja DTO)
- CORS

**Inne**
- Node.js 18+
- npm
