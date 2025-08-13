# Short-Cut URL

Backend application built with **Fastify** for URL shortening, allowing you to create shortened URLs and redirect to the original URL.

All use cases and controllers are tested with **Vitest**.

---

## 🔹 Features

- Create shortened URLs from an original URL.
- Redirect to the original URL using the shortened code.
- Validate existing or expired URLs.
- Automated tests for use cases and controllers.

---

## 🔹 Endpoints

### 1. Create Shortened URL

- **URL:** /encode-url  
- **Method:** POST  
- **Body (JSON):**

- **Response (200 OK):**
- 
```json
{
  "url": "https://www.example.com"
}
```

### 2. Redirect to the Original URL

- **URL:** `/:shortCode`  
- **Method:** `GET`  
- **Parameters:**  
  - `shortCode` → shortened URL code

- **Behavior:**
  - Redirects (`302`) to the original URL
  - Returns `400` if the code does not exist or is expired

---

## 🔹 Technologies

- Node.js  
- Fastify  
- Prisma (PostgreSQL)  
- Vitest (tests)  
- Zod (schema validation)

---

## 🔹 Tests

All use cases and controllers are tested with Vitest.

To run the tests:

```bash
npm install
npm run test
```

Tests cover:

- URL creation  
- Redirection  
- Validation of duplicate or expired URLs

---

## 🔹 Installation and Running

Clone the project:

```bash
git clone <repo-url>
cd short-cut-url
```

Install Dependencies:

```bash
yarn
```

Configure the database in the `.env`:

```ini
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DBNAME"
DOMAIN="http://localhost:3000"
```

Run migrations:

```bash
npx prisma migrate dev
```

Start the application:

```bash
npm run dev
```

Access the endpoints at `http://localhost:3000`.
