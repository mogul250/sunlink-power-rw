import { promisePool } from './db.js';

const ensureResourceTables = async () => {
  await promisePool.query(`
    CREATE TABLE IF NOT EXISTS ResourceUploads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      resource_type ENUM('file', 'video') NOT NULL DEFAULT 'file',
      file_url VARCHAR(500) NULL,
      youtube_url VARCHAR(500) NULL,
      original_file_name VARCHAR(255) NULL,
      mime_type VARCHAR(120) NULL,
      file_size BIGINT NULL,
      product_id INT NULL,
      category_id INT NULL,
      kit_id INT NULL,
      is_featured TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_resource_type (resource_type),
      INDEX idx_featured (is_featured),
      INDEX idx_product_id (product_id),
      INDEX idx_category_id (category_id),
      INDEX idx_kit_id (kit_id),
      CONSTRAINT fk_resource_product FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE SET NULL,
      CONSTRAINT fk_resource_category FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL,
      CONSTRAINT fk_resource_kit FOREIGN KEY (kit_id) REFERENCES Kits(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
};

export default ensureResourceTables;
