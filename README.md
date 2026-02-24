# Mega Electricals

A full‑stack MERN (MongoDB, Express.js, React.js, Node.js) web application for managing an electrical products business. The platform enables product browsing, customer interactions, and administrative management with secure authentication and scalable backend APIs.

---

# 🚀 Features

## User Features

* Browse electrical products with detailed information
* Category‑based product filtering
* Add to cart / purchase workflow
* User authentication (JWT‑based)
* Responsive UI for mobile and desktop

## Admin Features

* Add / update / delete products
* Manage inventory
* View orders / customers
* Secure admin routes

## System Features

* RESTful API architecture
* MongoDB database integration
* Environment‑based configuration
* Scalable folder structure

---

# 🏗️ Tech Stack

**Frontend**

* React.js
* Tailwind CSS
* Axios
* React Router

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Nodemon

---

# 📁 Project Structure

```
Mega-Electricals
│
├── backend
│   ├── config
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── server.js
│   └── .env
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── services
│   │   └── App.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/akash2xd/Mega-Electricals-.git
cd Mega-Electricals-
```

---

# 🗄️ Backend Setup

## Install dependencies

```bash
cd backend
npm install
```

## Create .env file

Create `backend/.env` and add:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/megaelectricals
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

## Run backend

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

# 🎨 Frontend Setup

## Install dependencies

```bash
cd frontend
npm install
```

## Run frontend

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

# 🔐 Environment Variables Explained

| Variable   | Purpose                   |
| ---------- | ------------------------- |
| MONGO_URI  | MongoDB connection string |
| JWT_SECRET | Token encryption key      |
| EMAIL_USER | SMTP email                |
| EMAIL_PASS | SMTP password             |
| PORT       | Backend port              |

---

# 🔌 API Overview

## Auth Routes

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

## Product Routes

```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## Order Routes

```
POST /api/orders
GET  /api/orders
```

---

# 🧪 Testing the Application

1. Start MongoDB
2. Run backend
3. Run frontend
4. Register user
5. Add products (admin)
6. Place order

---

# 🚀 Deployment Notes

## Backend

* Set production MongoDB URI (Atlas)
* Configure environment variables
* Deploy to Render / Railway / VPS

## Frontend

* Build React app
* Deploy to Vercel / Netlify

```
npm run build
```

---

# 📸 Screenshots

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2532088d-7b9f-417f-8513-16c0c93992c4" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/867024a9-c844-4585-bead-bbf953db7211" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/93db2aaf-ce68-4ac9-ba9b-3b4113495f46" />


---

# 👨‍💻 Author

Aragha Gupta

---

# 📄 License

This project is for educational and demonstration purposes.
