# Sunlink Power - B2B Solar Platform

A professional, high-performance B2B web platform for Sunlink Power, a solar company based in Guangzhou targeting the African market.

## 🌟 Features

- **Product Catalog**: Browse solar panels, inverters, batteries, and complete solar kits
- **Category Management**: Organized product categories with detailed specifications
- **Customer Testimonials**: Real customer reviews with before/after images
- **Admin Dashboard**: Secure admin panel for content management
- **WhatsApp Integration**: Direct customer engagement through WhatsApp
- **Mobile Optimized**: Fast loading and responsive design for African markets
- **SEO Optimized**: Country-specific optimization for target markets

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing

### Frontend (Coming Soon)
- **React.js** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sunlink-power
```

### 2. Database Setup

#### Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE sunlink_power;
USE sunlink_power;
```

#### Run Schema

```bash
mysql -u root -p sunlink_power < database/schema.sql
```

#### Seed Sample Data (Optional)

```bash
mysql -u root -p sunlink_power < database/seed.sql
```

### 3. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sunlink_power
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS Configuration
CLIENT_URL=http://localhost:5173

# WhatsApp Configuration
WHATSAPP_BUSINESS_NUMBER=+8618617384878
```

#### Start Backend Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:5000`

### 4. Frontend Setup (Coming Soon)

```bash
cd frontend
npm install
npm run dev
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug with products
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

#### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:categoryId` - Get products by category
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

#### Testimonials
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/testimonials` - Submit testimonial (Public)
- `GET /api/testimonials/all` - Get all testimonials (Admin)
- `PUT /api/testimonials/:id/approve` - Approve testimonial (Admin)
- `PUT /api/testimonials/:id` - Update testimonial (Admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin)

#### Admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Register admin (First admin or Super Admin)
- `GET /api/admin/profile` - Get admin profile (Admin)
- `PUT /api/admin/profile` - Update admin profile (Admin)
- `GET /api/admin/users` - Get all admins (Super Admin)
- `PUT /api/admin/users/:id/status` - Update admin status (Super Admin)
- `DELETE /api/admin/users/:id` - Delete admin (Super Admin)

### Query Parameters

#### Products
- `category` - Filter by category slug
- `featured` - Filter featured products (true/false)
- `search` - Search in name and description
- `min_price` - Minimum price filter
- `max_price` - Maximum price filter
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

#### Testimonials
- `country` - Filter by country
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset (default: 0)

## 🔐 Default Admin Credentials

After running the seed script, you can login with:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change this password immediately in production!

## 📁 Project Structure

```
sunlink-power/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── adminController.js    # Admin logic
│   │   ├── categoryController.js # Category logic
│   │   ├── productController.js  # Product logic
│   │   └── testimonialController.js # Testimonial logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   └── upload.js            # File upload handling
│   ├── routes/
│   │   ├── admin.js             # Admin routes
│   │   ├── categories.js        # Category routes
│   │   ├── products.js          # Product routes
│   │   └── testimonials.js      # Testimonial routes
│   ├── uploads/                 # Uploaded files
│   ├── .env.example             # Environment variables template
│   ├── package.json             # Backend dependencies
│   └── server.js                # Express server
├── database/
│   ├── schema.sql               # Database schema
│   └── seed.sql                 # Sample data
├── frontend/                    # React frontend (coming soon)
├── README.md                    # This file
└── TODO.md                      # Development checklist
```

## 🎨 Brand Colors

- **Green**: `#10B981` - Primary color
- **Blue**: `#3B82F6` - Secondary color
- **Yellow**: `#F59E0B` - Accent color

## 🌍 Target Markets

- Kenya
- Nigeria
- Zimbabwe
- Rwanda
- Tanzania
- South Africa
- Zambia
- And other African countries

## 📱 WhatsApp Integration

Products include a WhatsApp button that generates messages like:
```
Hi Sunlink, I'm interested in [Product Name]
```

Configure your WhatsApp Business number in the `.env` file.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Helmet.js for security headers
- CORS protection
- Input validation
- SQL injection prevention (parameterized queries)
- File upload restrictions

## 🚀 Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in your environment
2. Update database credentials
3. Set a strong `JWT_SECRET`
4. Configure CORS for your frontend domain
5. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name sunlink-api
pm2 save
pm2 startup
```

### Database Deployment

1. Create production database
2. Run schema.sql
3. Optionally run seed.sql for initial data
4. Set up regular backups

## 📝 Development Checklist

See [TODO.md](TODO.md) for the complete development checklist.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by Sunlink Power.

## 📞 Support

For support, email: admin@sunlinkpower.com

## 🙏 Acknowledgments

- Built for the African solar market
- Optimized for mobile-first experience
- Designed for reliability and performance

---

**Powering Tomorrow, Today** ⚡🌞
