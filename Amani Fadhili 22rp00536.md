# 📘 CRUD App API Documentation

name = Amani Fadhili
reg_no = 22rp00536



**Base URL**: `https://crud-app-api-tucx.onrender.com`

🔐 **Authentication Required**  
All routes except `/register` and `/login` require a valid **JWT token** in the request header:  
`Authorization: Bearer <your-token>`

---

## 🧑‍💻 User Roles

- **Admin**: Full access — can create, read, update, and delete.
- **User**: **Read-only** access — can view users, products, and orders but **cannot create, update, or delete** any resources.

---

## 🔐 Authentication

### 🔸 Register User  
**POST** `/register`  
Create a new user account.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"  // optional; default is "user"
}
```

**Response**:
```json
{ "message": "User registered successfully" }
```

---

### 🔸 Login User  
**POST** `/login`  
Login and get a JWT token.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

## 👤 Users (🔒 Auth Required)

| Method | Endpoint        | Description             | Access     |
|--------|------------------|--------------------------|------------|
| GET    | `/users`         | Get all users            | ✅ All users |
| GET    | `/users/:id`     | Get user by ID           | ✅ All users |
| POST   | `/users`         | Create a new user        | ❌ Admin only |
| PUT    | `/users/:id`     | Update user              | ❌ Admin only |
| DELETE | `/users/:id`     | Delete user              | ❌ Admin only |

---

## 📦 Products (🔒 Auth Required)

| Method | Endpoint         | Description               | Access       |
|--------|------------------|---------------------------|--------------|
| GET    | `/products`      | Get all products          | ✅ All users |
| GET    | `/products/:id`  | Get product by ID         | ✅ All users |
| POST   | `/products`      | Create a product          | ❌ Admin only |
| PUT    | `/products/:id`  | Update product            | ❌ Admin only |
| DELETE | `/products/:id`  | Delete product            | ❌ Admin only |

---

## 🛒 Orders (🔒 Auth Required)

| Method | Endpoint       | Description               | Access       |
|--------|----------------|---------------------------|--------------|
| GET    | `/orders`      | Get all orders            | ✅ All users |
| GET    | `/orders/:id`  | Get order by ID           | ✅ All users |
| POST   | `/orders`      | Create a new order        | ❌ Admin only |
| PUT    | `/orders/:id`  | Update an order           | ❌ Admin only |
| DELETE | `/orders/:id`  | Delete an order           | ❌ Admin only |

---

## 🛡 Required Headers (For Protected Routes)
```http
Authorization: Bearer <your-JWT-token>
Content-Type: application/json
```