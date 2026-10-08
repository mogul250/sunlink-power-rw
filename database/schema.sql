-- Sunlink Power Database Schema
-- MySQL Database for Solar Products B2B Platform

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Testimonials;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Admins;

-- ============================================
-- 1. Categories Table
-- ============================================
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. Products Table
-- ============================================
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    wattage VARCHAR(50),
    durability_rating VARCHAR(50),
    battery_type VARCHAR(100),
    warranty_info VARCHAR(200),
    image_url VARCHAR(500),
    manual_pdf_url VARCHAR(500),
    video_url VARCHAR(500),
    metadata JSON COMMENT 'Additional technical specifications in JSON format',
    is_featured BOOLEAN DEFAULT FALSE,
    stock_status ENUM('in_stock', 'out_of_stock', 'pre_order') DEFAULT 'in_stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_featured (is_featured),
    INDEX idx_price (price),
    FULLTEXT INDEX idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2.1. ProductImages Table
-- ============================================
CREATE TABLE ProductImages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    INDEX idx_product_images_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Testimonials Table
-- ============================================
CREATE TABLE Testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(150) NOT NULL,
    country VARCHAR(100) NOT NULL,
    video_url VARCHAR(500),
    before_image_url VARCHAR(500),
    after_image_url VARCHAR(500),
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_approved (is_approved),
    INDEX idx_country (country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. Admins Table
-- ============================================
CREATE TABLE Admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    full_name VARCHAR(150),
    role ENUM('super_admin', 'admin', 'editor') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Performance Optimization Indexes
-- ============================================

-- Composite index for product filtering
CREATE INDEX idx_product_category_price ON Products(category_id, price);

-- Index for testimonial queries
CREATE INDEX idx_testimonial_approved_country ON Testimonials(is_approved, country);

-- ============================================
-- Sample Comments for Metadata JSON Structure
-- ============================================

-- Example metadata JSON for Products:
-- {
--   "panel_type": "Monocrystalline",
--   "efficiency": "21.5%",
--   "dimensions": "1956x992x40mm",
--   "weight": "22.5kg",
--   "max_power_voltage": "40.5V",
--   "max_power_current": "10.12A",
--   "open_circuit_voltage": "48.7V",
--   "short_circuit_current": "10.75A",
--   "temperature_coefficient": "-0.35%/°C",
--   "certifications": ["CE", "TUV", "ISO9001"]
-- }
