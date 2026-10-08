-- Migration: Add Kits functionality
-- This migration adds support for product kits (grouped products)

-- ============================================
-- 1. Kits Table
-- ============================================
CREATE TABLE IF NOT EXISTS Kits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    slug VARCHAR(100) NOT NULL UNIQUE,
    is_featured BOOLEAN DEFAULT FALSE,
    stock_status ENUM('in_stock', 'out_of_stock', 'pre_order') DEFAULT 'in_stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_featured (is_featured),
    FULLTEXT INDEX idx_kit_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. KitProducts Table (Join table for kit items)
-- ============================================
CREATE TABLE IF NOT EXISTS KitProducts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kit_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kit_id) REFERENCES Kits(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_kit_product (kit_id, product_id),
    INDEX idx_kit_products_kit_id (kit_id),
    INDEX idx_kit_products_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Make price optional in Products table
-- ============================================
ALTER TABLE Products MODIFY COLUMN price DECIMAL(10, 2) NULL DEFAULT NULL;
