-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sunlink_power
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('super_admin','admin','editor') COLLATE utf8mb4_unicode_ci DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin','$2a$12$rfNxTGtgOhOW0jR8oQlW6ehDkdvEDV64chK84LYuO8gndOpUZoNXK','admin@sunlink-power.com','System Administrator','super_admin',1,'2026-04-21 21:11:07','2026-04-21 21:08:13','2026-04-21 21:11:07');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Solar Panels','High-efficiency monocrystalline and polycrystalline solar panels for residential and commercial use','https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800','solar-panels','2026-04-21 21:09:21','2026-04-21 21:09:21'),(2,'Inverters','Pure sine wave inverters for reliable power conversion and grid-tie systems','/uploads/categories/JIGUUN-1500-Watt-Pure-Sine-Wave-Inverter-DC-24V-AC-110V-120V-Converter-Car-Inverter-LED-4-AC-Outlets-USB-Output-Power-Inverter-Remote-Control-Truck-C-113a66f4-44e9-45d7-852c-f0553af47164-d307ccfdc797ed2ebe7e7df64f1e7871-1776845980090-150469886.jpeg','inverters','2026-04-21 21:09:21','2026-04-22 08:19:40'),(3,'Batteries','Deep cycle lithium and lead-acid batteries for energy storage solutions','https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800','batteries','2026-04-21 21:09:21','2026-04-21 21:09:21'),(4,'Solar Kits','Complete solar power systems ready for installation','https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800','solar-kits','2026-04-21 21:09:21','2026-04-21 21:09:21'),(5,'Charge Controllers','MPPT and PWM charge controllers for optimal battery charging','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800','charge-controllers','2026-04-21 21:09:21','2026-04-21 21:09:21'),(6,'Accessories','Cables, connectors, mounting brackets and other solar accessories','https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800','accessories','2026-04-21 21:09:21','2026-04-21 21:09:21'),(8,'services','done things','/uploads/categories/solar-installers-1776844084910-86949997.jpg','serv','2026-04-22 07:21:59','2026-04-22 07:48:04');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kitimages`
--

DROP TABLE IF EXISTS `kitimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kitimages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kit_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `kit_id` (`kit_id`),
  CONSTRAINT `kitimages_ibfk_1` FOREIGN KEY (`kit_id`) REFERENCES `kits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kitimages`
--

LOCK TABLES `kitimages` WRITE;
/*!40000 ALTER TABLE `kitimages` DISABLE KEYS */;
INSERT INTO `kitimages` VALUES (1,4,'/uploads/kits/IMG-1030-1776938192067-419953276.jpg','32 kwh solar kit - Gallery Image 1',0,'2026-04-23 09:56:32'),(2,4,'/uploads/kits/IMG-1039-1776938192082-233108205.jpg','32 kwh solar kit - Gallery Image 2',1,'2026-04-23 09:56:32'),(3,4,'/uploads/kits/IMG-1040-1776938192090-566005201.jpg','32 kwh solar kit - Gallery Image 3',2,'2026-04-23 09:56:32');
/*!40000 ALTER TABLE `kitimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kitproducts`
--

DROP TABLE IF EXISTS `kitproducts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kitproducts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kit_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_kit_product` (`kit_id`,`product_id`),
  KEY `idx_kit_products_kit_id` (`kit_id`),
  KEY `idx_kit_products_product_id` (`product_id`),
  CONSTRAINT `kitproducts_ibfk_1` FOREIGN KEY (`kit_id`) REFERENCES `kits` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kitproducts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kitproducts`
--

LOCK TABLES `kitproducts` WRITE;
/*!40000 ALTER TABLE `kitproducts` DISABLE KEYS */;
INSERT INTO `kitproducts` VALUES (10,4,10,16,0,'2026-04-23 09:56:32'),(11,4,16,2,1,'2026-04-23 09:56:32'),(12,4,14,1,2,'2026-04-23 09:56:32');
/*!40000 ALTER TABLE `kitproducts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kits`
--

DROP TABLE IF EXISTS `kits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `stock_status` enum('in_stock','out_of_stock','pre_order') COLLATE utf8mb4_unicode_ci DEFAULT 'in_stock',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`),
  KEY `idx_featured` (`is_featured`),
  FULLTEXT KEY `idx_kit_search` (`name`,`description`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kits`
--

LOCK TABLES `kits` WRITE;
/*!40000 ALTER TABLE `kits` DISABLE KEYS */;
INSERT INTO `kits` VALUES (4,'32 kwh solar kit','test kit description','/uploads/kits/New-35KW-Watt-Complete-Kit-w-SolArk-Ground-Mnt-64-ZN-Panels-2-Freedom-BATT-1776881190157-253497264.webp','32kwhkit',0,'in_stock','2026-04-22 18:06:30','2026-04-22 18:06:30');
/*!40000 ALTER TABLE `kits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productimages`
--

DROP TABLE IF EXISTS `productimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productimages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_images_product_id` (`product_id`),
  CONSTRAINT `productimages_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productimages`
--

LOCK TABLES `productimages` WRITE;
/*!40000 ALTER TABLE `productimages` DISABLE KEYS */;
INSERT INTO `productimages` VALUES (4,10,'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800','Close-up of the panel surface',1,'2026-04-21 21:18:11'),(5,11,'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800','Panel being installed on a roof',2,'2026-04-21 21:18:11'),(6,12,'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800','Full solar array with multiple panels',3,'2026-04-21 21:18:11'),(7,17,'/uploads/products/solar-installers-1776847794363-915669006.jpg',NULL,0,'2026-04-22 08:49:54');
/*!40000 ALTER TABLE `productimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `wattage` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `durability_rating` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `battery_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warranty_info` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manual_pdf_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL COMMENT 'Additional technical specifications in JSON format',
  `is_featured` tinyint(1) DEFAULT '0',
  `stock_status` enum('in_stock','out_of_stock','pre_order') COLLATE utf8mb4_unicode_ci DEFAULT 'in_stock',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_featured` (`is_featured`),
  KEY `idx_price` (`price`),
  KEY `idx_product_category_price` (`category_id`,`price`),
  FULLTEXT KEY `idx_search` (`name`,`description`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (10,1,'Sunlink Mono 550W Solar Panel',285.00,'Premium monocrystalline solar panel with 21.5% efficiency. Perfect for residential and commercial installations. Features anti-reflective coating and robust aluminum frame.','550W','25 Years','N/A','25-year performance warranty, 12-year product warranty','https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800','/manuals/mono-550w.pdf','https://www.youtube.com/watch?v=xKxrkht7CpY','{\"weight\": \"28.6kg\", \"dimensions\": \"2278x1134x35mm\", \"efficiency\": \"21.5%\", \"panel_type\": \"Monocrystalline\", \"certifications\": [\"CE\", \"TUV\", \"ISO9001\", \"IEC61215\"], \"max_power_current\": \"13.19A\", \"max_power_voltage\": \"41.7V\", \"open_circuit_voltage\": \"49.5V\", \"short_circuit_current\": \"13.95A\", \"temperature_coefficient\": \"-0.34%/°C\"}',1,'in_stock','2026-04-21 21:16:39','2026-04-21 21:16:39'),(11,1,'Sunlink Poly 450W Solar Panel',195.00,'Cost-effective polycrystalline panel ideal for large-scale installations. Excellent performance in high-temperature environments.','450W','25 Years','N/A','25-year performance warranty, 10-year product warranty','https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800','/manuals/poly-450w.pdf',NULL,'{\"weight\": \"24.5kg\", \"dimensions\": \"2015x1002x40mm\", \"efficiency\": \"18.2%\", \"panel_type\": \"Polycrystalline\", \"certifications\": [\"CE\", \"TUV\", \"ISO9001\"], \"max_power_current\": \"11.78A\", \"max_power_voltage\": \"38.2V\", \"open_circuit_voltage\": \"46.1V\", \"short_circuit_current\": \"12.45A\", \"temperature_coefficient\": \"-0.41%/°C\"}',1,'in_stock','2026-04-21 21:16:39','2026-04-21 21:16:39'),(12,1,'Sunlink Bifacial 600W Solar Panel',425.00,'Advanced bifacial technology captures sunlight from both sides, increasing energy yield by up to 30%. Premium choice for maximum efficiency.','600W','30 Years','N/A','30-year performance warranty, 15-year product warranty','https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800','/manuals/bifacial-600w.pdf',NULL,'{\"weight\": \"33.2kg\", \"dimensions\": \"2384x1303x35mm\", \"efficiency\": \"22.8%\", \"panel_type\": \"Bifacial Monocrystalline\", \"certifications\": [\"CE\", \"TUV\", \"ISO9001\", \"IEC61215\", \"IEC61730\"], \"bifacial_factor\": \"70%\", \"max_power_current\": \"13.39A\", \"max_power_voltage\": \"44.8V\", \"open_circuit_voltage\": \"53.2V\", \"short_circuit_current\": \"14.15A\", \"temperature_coefficient\": \"-0.29%/°C\"}',1,'in_stock','2026-04-21 21:16:39','2026-04-21 21:16:39'),(13,2,'Sunlink Pure Sine 5000W Inverter',580.00,'High-quality pure sine wave inverter with 5000W continuous power. Perfect for sensitive electronics and appliances. Built-in LCD display and multiple protection features.','5000W','10 Years','Compatible with all battery types','5-year warranty, extendable to 10 years','https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800','/manuals/inverter-5000w.pdf',NULL,'{\"display\": \"LCD\", \"waveform\": \"Pure Sine Wave\", \"frequency\": \"50Hz/60Hz\", \"efficiency\": \"93%\", \"protections\": [\"Over-voltage\", \"Under-voltage\", \"Overload\", \"Short-circuit\", \"Over-temperature\"], \"output_power\": \"5000W continuous, 10000W surge\", \"input_voltage\": \"48V DC\", \"certifications\": [\"CE\", \"RoHS\"], \"output_voltage\": \"230V AC\"}',1,'in_stock','2026-04-21 21:16:50','2026-04-21 21:16:50'),(14,2,'Sunlink Hybrid 8000W Inverter',1250.00,'Advanced hybrid inverter with grid-tie capability. Seamlessly switches between solar, battery, and grid power. MPPT charge controller included.','8000W','10 Years','Lithium/Lead-acid compatible','5-year warranty','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800','/manuals/hybrid-8000w.pdf',NULL,'{\"grid_tie\": true, \"efficiency\": \"97.6%\", \"battery_type\": \"Lithium/Lead-acid\", \"max_pv_input\": \"10000W\", \"output_power\": \"8000W continuous, 16000W surge\", \"input_voltage\": \"48V DC\", \"certifications\": [\"CE\", \"TUV\", \"VDE\"], \"output_voltage\": \"230V AC\", \"mppt_voltage_range\": \"120-450V\"}',1,'in_stock','2026-04-21 21:16:50','2026-04-21 21:16:50'),(15,3,'Sunlink LiFePO4 200Ah Battery',890.00,'Premium lithium iron phosphate battery with 6000+ cycle life. Built-in BMS for safety and longevity. Lightweight and maintenance-free.','12.8V 200Ah (2560Wh)','10 Years','LiFePO4 Lithium','10-year warranty, 6000 cycles','https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800','/manuals/lifepo4-200ah.pdf',NULL,'{\"bms\": \"Built-in 100A\", \"energy\": \"2560Wh\", \"weight\": \"22kg\", \"voltage\": \"12.8V\", \"capacity\": \"200Ah\", \"cycle_life\": \"6000+ cycles at 80% DOD\", \"dimensions\": \"522x240x218mm\", \"certifications\": [\"CE\", \"UN38.3\", \"MSDS\"], \"charge_voltage\": \"14.6V\", \"discharge_cutoff\": \"10V\", \"max_charge_current\": \"100A\", \"max_discharge_current\": \"100A continuous, 200A peak\"}',1,'in_stock','2026-04-21 21:16:59','2026-04-21 21:16:59'),(16,3,'Sunlink Deep Cycle 250Ah AGM Battery',385.00,'Heavy-duty AGM deep cycle battery for reliable energy storage. Sealed maintenance-free design with excellent deep discharge recovery.','12V 250Ah (3000Wh)','5 Years','AGM Lead-acid','5-year warranty, 1200 cycles','https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800','/uploads/manuals/Tariff-DISTRICT-Hospitals-1776882346908-584077538.pdf','','{\"energy\": \"3000Wh\", \"weight\": \"68kg\", \"voltage\": \"12V\", \"capacity\": \"250Ah\", \"cycle_life\": \"1200 cycles at 50% DOD\", \"dimensions\": \"520x268x220mm\", \"technology\": \"AGM (Absorbed Glass Mat)\", \"certifications\": [\"CE\", \"ISO9001\"], \"operating_temp\": \"-20°C to 50°C\", \"self_discharge\": \"3% per month\"}',0,'in_stock','2026-04-21 21:16:59','2026-04-22 18:25:46'),(17,4,'Sunlink Home 3kW Complete Solar Kit',2850.00,'Everything you need for a complete home solar installation. Includes 6x550W panels, 5kW inverter, mounting hardware, and all cables.','3300W','25 Years','Battery not included','Component-based warranty','/uploads/products/photo-1508514177221-188b1cf16e9d-1776847794362-579125463.jpg','/manuals/home-3kw-kit.pdf','','{\"components\": [\"6x Sunlink Mono 550W Panels\", \"1x 5000W Pure Sine Inverter\", \"1x 60A MPPT Charge Controller\", \"Mounting Rails & Brackets\", \"MC4 Cables & Connectors\", \"Installation Manual\"], \"total_power\": \"3300W\", \"daily_output\": \"13-16kWh\", \"suitable_for\": \"3-4 bedroom home\", \"installation_time\": \"1-2 days\"}',1,'in_stock','2026-04-21 21:17:07','2026-04-22 08:49:54'),(18,4,'Sunlink Business 10kW Solar System',8900.00,'Commercial-grade solar system for small businesses and large homes. High-efficiency components with grid-tie capability.','10000W','25 Years','Battery optional','Component-based warranty','https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800','/manuals/business-10kw-kit.pdf',NULL,'{\"grid_tie\": true, \"components\": [\"18x Sunlink Mono 550W Panels\", \"1x 8000W Hybrid Inverter\", \"2x 80A MPPT Controllers\", \"Commercial Mounting System\", \"All Cables & Protection\", \"Monitoring System\"], \"total_power\": \"9900W\", \"daily_output\": \"40-50kWh\", \"suitable_for\": \"Small business, large home\"}',1,'in_stock','2026-04-21 21:17:07','2026-04-21 21:17:07'),(19,6,'MC4 Solar Cable Connectors (10 Pairs)',25.00,'Premium MC4 connectors for secure solar panel connections. UV-resistant, waterproof IP67 rated. Easy to install.','N/A','10 Years','N/A','2-year warranty','https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800','/manuals/mc4-connectors.pdf',NULL,'{\"rating\": \"30A, 1000V DC\", \"material\": \"PPO plastic, Copper\", \"quantity\": \"10 pairs (20 pieces)\", \"ip_rating\": \"IP67\", \"cable_size\": \"2.5-6mm²\", \"certifications\": [\"TUV\", \"CE\"], \"temperature_range\": \"-40°C to +90°C\"}',0,'in_stock','2026-04-21 21:17:17','2026-04-21 21:17:17'),(20,6,'Solar Panel Mounting Brackets Kit',120.00,'Heavy-duty aluminum mounting system for roof or ground installation. Adjustable angle, corrosion-resistant. Suitable for 4-6 panels.','N/A','15 Years','N/A','10-year warranty','https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800','/manuals/mounting-kit.pdf',NULL,'{\"includes\": [\"Rails\", \"Clamps\", \"Bolts\", \"L-feet\", \"Installation Guide\"], \"material\": \"Anodized Aluminum\", \"max_load\": \"200kg\", \"panel_capacity\": \"4-6 panels\", \"wind_resistance\": \"Up to 150km/h\", \"angle_adjustment\": \"15-45 degrees\", \"installation_type\": \"Roof/Ground\"}',0,'in_stock','2026-04-21 21:17:17','2026-04-21 21:17:17');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `before_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `after_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_approved` tinyint(1) DEFAULT '0',
  `rating` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_approved` (`is_approved`),
  KEY `idx_country` (`country`),
  KEY `idx_testimonial_approved_country` (`is_approved`,`country`),
  CONSTRAINT `testimonials_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (1,'John Mwangi','Kenya',NULL,'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400','https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400','Sunlink Power transformed my business! We installed a 5kW system and now save over $200 monthly on electricity. The panels work perfectly even during the rainy season. Excellent quality and great customer support!',1,5,'2026-04-21 21:18:28','2026-04-21 21:18:28'),(2,'Amara Okafor','Nigeria',NULL,NULL,NULL,'Best investment I ever made for my home. The 3kW solar kit powers my entire house including AC and refrigerator. Installation was smooth and the team was very professional. Highly recommended!',1,5,'2026-04-21 21:18:28','2026-04-21 21:18:28'),(3,'Tendai Moyo','Zimbabwe','https://www.youtube.com/watch?v=example1','https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400','https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400','Running my farm on solar power now! The 10kW system handles all our irrigation pumps and cold storage. No more diesel generator costs. Sunlink quality is outstanding!',1,5,'2026-04-21 21:18:28','2026-04-21 21:18:28'),(4,'Grace Uwimana','Rwanda',NULL,NULL,NULL,'Our clinic now has reliable 24/7 power thanks to Sunlink. The battery backup system keeps our medical equipment running even during power outages. Lives are being saved because of this technology!',1,5,'2026-04-21 21:18:28','2026-04-21 21:18:28'),(5,'David Banda','Zambia',NULL,'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400','https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400','Installed solar panels on my shop 6 months ago. The return on investment is amazing! My electricity bill went from $150 to almost zero. The panels are still performing excellently.',1,5,'2026-04-21 21:18:28','2026-04-21 21:18:28'),(6,'Fatima Hassan','Tanzania',NULL,NULL,NULL,'Quality products at fair prices. We bought the complete home kit and it was easy to install. Customer service answered all our questions. Very happy with our purchase!',1,4,'2026-04-21 21:18:28','2026-04-21 21:18:28'),(7,'Emmanuel Nkosi','South Africa',NULL,NULL,NULL,'Sunlink inverters are the best! Pure sine wave output, very quiet operation, and the LCD display is very helpful. Been using it for 8 months without any issues.',0,5,'2026-04-21 21:18:28','2026-04-21 21:18:28');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-01 10:24:40
