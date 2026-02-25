<div align="center">

# 📱 Baba Mobiles

### Modern E-Commerce Platform for Mobile Phones

[![Django](https://img.shields.io/badge/Django-5.1.4-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue.svg)](https://www.postgresql.org/)


[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Overview

**Baba Mobiles** is a full-stack e-commerce platform designed specifically for mobile phone retail. Built with modern technologies, it provides a seamless shopping experience with features like advanced product filtering, secure payment processing, and real-time order tracking.

### Why Baba Mobiles?

- 🚀 **Fast & Responsive** - Built with React and optimized for performance
- 🔒 **Secure** - JWT authentication and secure payment gateway integration
- 📱 **Mobile-First** - Fully responsive design for all devices
- 🎨 **Modern UI** - Clean and intuitive user interface
- 🛡️ **Production Ready** - Follows best practices and industry standards

---

## ✨ Features

### 🛍️ Shopping Experience
- **Advanced Product Filtering** - Filter by brand, model, RAM, storage, and price range
- **Smart Search** - Quick product search with real-time results
- **Product Reviews** - Verified purchase reviews with ratings
- **Wishlist** - Save products for later
- **Shopping Cart** - Persistent cart with quantity management

### 🔐 Authentication & Security
- **Email OTP Verification** - Secure account registration
- **JWT Authentication** - Token-based secure authentication
- **Password Management** - Change password functionality
- **Session Management** - Secure session handling

### 💳 Payment & Orders
- **Razorpay Integration** - Secure payment processing
- **Order Tracking** - Real-time order status updates
- **Order History** - Complete order history with details
- **Invoice Generation** - Downloadable PDF invoices
- **Multiple Payment Methods** - Support for various payment options

### 👤 User Management
- **User Profiles** - Manage personal information
- **Address Management** - Multiple shipping addresses
- **Order Management** - View and track all orders
- **Account Settings** - Update profile and preferences

### 🎨 UI/UX Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode Ready** - Prepared for dark theme implementation
- **Loading States** - Smooth loading animations
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| ![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white) | Web Framework |
| ![DRF](https://img.shields.io/badge/DRF-ff1709?style=flat&logo=django&logoColor=white) | REST API |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) | Database |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=JSON%20web%20tokens&logoColor=white) | Authentication |
| ![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=flat&logo=razorpay&logoColor=white) | Payment Gateway |

### Frontend
| Technology | Purpose |
|-----------|---------|
| ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | UI Library |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Build Tool |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Styling |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white) | Routing |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | HTTP Client |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.8 or higher
- **Node.js** 16.0 or higher
- **PostgreSQL** 12.0 or higher
- **Git** for version control
- **Gmail Account** for email OTP functionality
- **Razorpay Account** for payment processing

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/baba-mobiles.git
cd baba-mobiles
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Update database credentials, email settings, and API keys

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Start development server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### 3️⃣ Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd reactnewfrontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Update API URL and Razorpay key

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env` file with the following variables:

```env
# Database Configuration
DB_NAME=babamobiles
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# Django Settings
SECRET_KEY=your-django-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend Environment Variables

Create `reactnewfrontend/.env` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000/api

# Razorpay Public Key
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### Setting up Gmail for OTP

1. Enable 2-Factor Authentication in your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_HOST_PASSWORD`

### Setting up Razorpay

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your Test API keys from Dashboard
3. Add keys to both backend and frontend `.env` files

---

## 💻 Usage

### For Customers

1. **Register Account**
   - Visit the signup page
   - Enter email and receive OTP
   - Verify OTP and complete registration

2. **Browse Products**
   - Use filters to find desired products
   - View product details and reviews
   - Add products to cart or wishlist

3. **Checkout**
   - Review cart items
   - Add/select shipping address
   - Complete payment via Razorpay

4. **Track Orders**
   - View order history
   - Track order status in real-time
   - Download invoices

### For Administrators

1. **Access Admin Panel**
   - Navigate to `http://localhost:8000/admin`
   - Login with superuser credentials

2. **Manage Products**
   - Add/edit brands and models
   - Create product listings
   - Upload product images
   - Set pricing and discounts

3. **Manage Orders**
   - View all orders
   - Update order status
   - Process refunds

4. **User Management**
   - View registered users
   - Manage user accounts
   - Review customer feedback

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/accounts/send-otp/` | Send OTP to email |
| POST | `/api/accounts/verify-otp/` | Verify OTP code |
| POST | `/api/accounts/resend-otp/` | Resend OTP |
| POST | `/api/accounts/register/` | Register new user |
| POST | `/api/accounts/login/` | User login |
| GET | `/api/accounts/profile/` | Get user profile |
| PATCH | `/api/accounts/profile/` | Update profile |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List all products |
| GET | `/api/products/{id}/` | Get product details |
| GET | `/api/products/brands/` | List all brands |
| GET | `/api/products/models/` | List all models |
| GET | `/api/products/{id}/reviews/` | Get product reviews |
| POST | `/api/products/{id}/reviews/` | Submit review |

### Cart Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/` | Get user cart |
| POST | `/api/cart/add/` | Add item to cart |
| PATCH | `/api/cart/items/{id}/` | Update cart item |
| DELETE | `/api/cart/items/{id}/remove/` | Remove from cart |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/` | List user orders |
| GET | `/api/orders/{id}/` | Get order details |
| POST | `/api/orders/create/` | Create new order |
| POST | `/api/orders/verify-payment/` | Verify payment |
| GET | `/api/orders/{id}/download-invoice/` | Download invoice PDF |

### Wishlist Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/wishlist/` | Get wishlist |
| POST | `/api/products/wishlist/` | Add to wishlist |
| DELETE | `/api/products/wishlist/{id}/delete/` | Remove from wishlist |

---

## 📁 Project Structure

```
baba-mobiles/
│
├── backend/                      # Django Backend
│   ├── accounts/                 # User authentication & profiles
│   │   ├── models.py            # User, Address models
│   │   ├── serializers.py       # API serializers
│   │   ├── views.py             # API views
│   │   └── urls.py              # URL routing
│   │
│   ├── products/                 # Product management
│   │   ├── models.py            # Product, Brand, Model, Review
│   │   ├── serializers.py       # Product serializers
│   │   ├── views.py             # Product views
│   │   └── urls.py              # Product URLs
│   │
│   ├── cart/                     # Shopping cart
│   │   ├── models.py            # Cart, CartItem models
│   │   ├── views.py             # Cart operations
│   │   └── urls.py              # Cart URLs
│   │
│   ├── orders/                   # Order processing
│   │   ├── models.py            # Order, OrderItem models
│   │   ├── views.py             # Order management
│   │   └── urls.py              # Order URLs
│   │
│   ├── config/                   # Django configuration
│   │   ├── settings.py          # Project settings
│   │   ├── urls.py              # Main URL configuration
│   │   └── wsgi.py              # WSGI configuration
│   │
│   ├── media/                    # Uploaded files
│   │   ├── brands/              # Brand logos
│   │   └── products/            # Product images
│   │
│   ├── manage.py                # Django management script
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment variables template
│
├── reactnewfrontend/            # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── ...
│   │   │
│   │   ├── services/            # API services
│   │   │   └── api.js           # Axios configuration
│   │   │
│   │   ├── assets/              # Static assets
│   │   │   ├── images/
│   │   │   └── icons/
│   │   │
│   │   ├── App.jsx              # Main App component
│   │   └── main.jsx             # Entry point
│   │
│   ├── public/                  # Public assets
│   ├── package.json             # Node dependencies
│   ├── vite.config.js           # Vite configuration
│   └── .env.example             # Environment variables template
│
├── .gitignore                   # Git ignore rules
├── README.md                    # Project documentation
└── LICENSE                      # License file
```

---

## 📸 Screenshots

### Home Page
> Modern landing page with featured products and brand showcase

### Product Listing
> Advanced filtering with brand, model, RAM, storage, and price range

### Product Details
> Detailed product information with image gallery and reviews

### Shopping Cart
> Easy cart management with quantity controls

### Checkout
> Streamlined checkout process with address management

### Order Tracking
> Real-time order status with timeline visualization

### User Profile
> Comprehensive profile management

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---


## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/amanrj03)
- LinkedIn: [Your Name](https://www.linkedin.com/in/amanranjan03/)

---

## 🙏 Acknowledgments

- [Django](https://www.djangoproject.com/) - The web framework for perfectionists with deadlines
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Razorpay](https://razorpay.com/) - Payment gateway integration
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons

---



<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ by [Your Name](https://github.com/amanrj03)

</div>
