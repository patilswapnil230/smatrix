# S-Matrix Solutions Pvt. Ltd. — Service Provider Platform

A full-stack, production-ready web platform for S-Matrix Solutions built with React.js, Node.js/Express, and MySQL.

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Environment Variables](#environment-variables)
6. [Database Schema SQL](#database-schema-sql)
7. [API Endpoint Documentation](#api-endpoint-documentation)
8. [Admin Dashboard Usage](#admin-dashboard-usage)
9. [Deployment Notes](#deployment-notes)

---

## Tech Stack
| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js 18, Tailwind CSS, Vite   |
| Backend    | Node.js, Express.js               |
| Database   | MySQL 8+ with Sequelize ORM       |
| Auth       | JSON Web Tokens (JWT)             |
| SEO        | react-helmet-async                |

---

## Project Structure
```
smatrix/
├── frontend/                  # React SPA
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level page components
│   │   ├── context/           # React Context (Auth, etc.)
│   │   ├── hooks/             # Custom React hooks
│   │   └── utils/             # API helper, constants
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                   # Express REST API
│   ├── config/                # DB connection config
│   ├── models/                # Sequelize models
│   ├── routes/                # Express route handlers
│   ├── middleware/            # Auth middleware (JWT verify)
│   ├── server.js              # Entry point
│   └── .env.example
│
└── README.md
```

---

## Prerequisites
- **Node.js** v18+
- **MySQL** 8.0+
- **npm** or **yarn**

---

## Installation & Setup

### 1. Clone & Navigate
```bash
git clone <repo-url>
cd smatrix
```

### 2. Database Setup
Open MySQL and run the schema SQL below, then:
```bash
mysql -u root -p < schema.sql
```

### 3. Backend Setup
```bash
cd backend
cp .env.example .env        # Fill in your values
npm install
node server.js              # Starts on http://localhost:5000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev                 # Starts on http://localhost:5173
```

### 5. Seed Default Admin User
After starting the backend, POST to `/api/auth/seed-admin` **once** to create the default admin:
- Email: `admin@smatrix.com`
- Password: `Admin@1234`
> ⚠️ Delete the `/seed-admin` route in production!

---

## Environment Variables

### `backend/.env`
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smatrix_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# CORS (your frontend URL)
FRONTEND_URL=http://localhost:5173
```

---

## Database Schema SQL

```sql
-- =============================================
-- S-Matrix Solutions Database Schema
-- Run this file to initialise the database
-- =============================================

CREATE DATABASE IF NOT EXISTS smatrix_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smatrix_db;

-- --------------------------
-- Table: users
-- Stores admin and general users
-- --------------------------
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,          -- bcrypt hash
  role        ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------
-- Table: services
-- Generic schema — add new service categories without code changes
-- --------------------------
CREATE TABLE IF NOT EXISTS services (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(150)  NOT NULL,        -- e.g., "Plumbing"
  slug          VARCHAR(150)  NOT NULL UNIQUE, -- e.g., "plumbing" (used in URL)
  description   TEXT          NOT NULL,        -- Short intro paragraph
  long_desc     TEXT,                          -- Full page description (optional)
  icon          VARCHAR(100),                  -- Icon name or emoji shortcode
  image_url     VARCHAR(500),                  -- Hero image URL or path
  price_from    DECIMAL(10,2),                 -- Starting price shown on card
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,  -- Toggle visibility
  sort_order    INT           NOT NULL DEFAULT 0,   -- Display ordering
  meta_title    VARCHAR(160),                  -- SEO: <title>
  meta_desc     VARCHAR(320),                  -- SEO: <meta description>
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------
-- Table: contact_messages
-- Stores submissions from the public contact form
-- --------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  phone       VARCHAR(20),
  service_id  INT,                             -- Optional: which service they're enquiring about
  message     TEXT NOT NULL,
  is_read     TINYINT(1) NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- --------------------------
-- Seed: Default service categories
-- --------------------------
INSERT INTO services (title, slug, description, icon, image_url, price_from, sort_order, meta_title, meta_desc) VALUES
('Building Color', 'building-color', 'Professional interior and exterior painting services using premium, durable paints. We bring colour and life to every wall.', '🎨', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800', 999.00, 1, 'Building Color Services | S-Matrix Solutions', 'Expert interior and exterior painting services in your city. Get a free quote today.'),
('Plumbing', 'plumbing', 'Certified plumbers for leak repairs, pipe installations, bathroom fittings, and complete plumbing solutions.', '🔧', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 499.00, 2, 'Plumbing Services | S-Matrix Solutions', 'Reliable plumbing services — repairs, installations, and emergency callouts.'),
('Furniture', 'furniture', 'Custom furniture assembly, repair, and carpentry. From flat-pack to bespoke built-ins, we handle it all.', '🪑', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 799.00, 3, 'Furniture Services | S-Matrix Solutions', 'Professional furniture assembly and carpentry services for homes and offices.'),
('Maid Services', 'maid-services', 'Thorough home cleaning, deep sanitisation, and regular housekeeping by trained, verified professionals.', '🏠', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800', 299.00, 4, 'Maid & Cleaning Services | S-Matrix Solutions', 'Trusted maid and home cleaning services. Book a one-time or recurring clean today.');
```

---

## API Endpoint Documentation

Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint              | Auth Required | Description                  |
|--------|-----------------------|---------------|------------------------------|
| POST   | `/auth/register`      | No            | Register a new general user  |
| POST   | `/auth/login`         | No            | Login, returns JWT token     |
| GET    | `/auth/me`            | JWT           | Get current user profile     |
| POST   | `/auth/seed-admin`    | No (dev only) | Create default admin user    |

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "Admin", "email": "admin@smatrix.com", "role": "admin" }
}
```

### Services (Public)
| Method | Endpoint               | Auth Required | Description                        |
|--------|------------------------|---------------|------------------------------------|
| GET    | `/services`            | No            | List all active services           |
| GET    | `/services/:slug`      | No            | Get single service by slug         |

### Services (Admin — JWT + Role: admin)
| Method | Endpoint               | Auth Required | Description                        |
|--------|------------------------|---------------|------------------------------------|
| GET    | `/admin/services`      | Admin JWT     | List ALL services (incl. inactive) |
| POST   | `/admin/services`      | Admin JWT     | Create a new service               |
| PUT    | `/admin/services/:id`  | Admin JWT     | Update an existing service         |
| DELETE | `/admin/services/:id`  | Admin JWT     | Delete a service                   |

**POST /admin/services Body:**
```json
{
  "title": "Electrical",
  "slug": "electrical",
  "description": "Certified electrical repairs and installations.",
  "long_desc": "Full paragraph...",
  "icon": "⚡",
  "image_url": "https://...",
  "price_from": 399.00,
  "is_active": true,
  "sort_order": 5,
  "meta_title": "Electrical Services | S-Matrix Solutions",
  "meta_desc": "Safe, certified electrical services."
}
```

### Contact
| Method | Endpoint         | Auth Required | Description                      |
|--------|------------------|---------------|----------------------------------|
| POST   | `/contact`       | No            | Submit contact form message      |
| GET    | `/admin/contact` | Admin JWT     | View all contact messages        |
| PATCH  | `/admin/contact/:id/read` | Admin JWT | Mark message as read        |

---

## Admin Dashboard Usage

1. Navigate to `http://localhost:5173/admin/login`
2. Login with admin credentials
3. Access the dashboard at `/admin` — protected by JWT stored in `localStorage`
4. **Services tab**: Add, edit, toggle visibility, reorder, or delete any service
5. **Messages tab**: View and manage contact form submissions

---

## Deployment Notes
- Set `NODE_ENV=production` in backend `.env`
- Use **PM2** or **Docker** to run the backend persistently
- Serve the React build (`npm run build`) via Nginx or a CDN
- Use **environment-specific** `.env` files — never commit secrets
- For image uploads, integrate **Cloudinary** or **AWS S3** and store the URL in `image_url`
