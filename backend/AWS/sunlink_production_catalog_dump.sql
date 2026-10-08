-- Sunlink Power production catalog dump
-- Fresh merged catalog seed based on the provided Sunlink PDF catalog families
-- and normalized against Entelechy Power's public solar kit/product families:
-- 1) Sunlink Power Full Catalog
-- 2) Sunlink Solar Light and Fan Catalog
-- 3) Sunlink PV ESS EV Brochure
--
-- Scope: product categories, products, kits, and kit-product mappings.
-- Compatible with the current application tables: Categories, Products, Kits,
-- ProductImages, KitImages, and KitProducts.
--
-- Notes:
-- - No admin credentials are included.
-- - Prices are set to 0.00 because this site is quote/catalog driven.
-- - image_url values are NULL so the application can use its fallback imagery
--   until production product photography is uploaded through the admin panel.
-- - Overlapping solar system, inverter, battery, and generator families use
--   Entelechy-style naming/capacity bands. Sunlink PDF-only lines remain in
--   the catalog as Sunlink-specific products.

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS;
SET @OLD_SQL_MODE=@@SQL_MODE;
SET FOREIGN_KEY_CHECKS=0;
SET UNIQUE_CHECKS=0;
SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `KitProducts`;
DROP TABLE IF EXISTS `KitImages`;
DROP TABLE IF EXISTS `ProductImages`;
DROP TABLE IF EXISTS `Kits`;
DROP TABLE IF EXISTS `Products`;
DROP TABLE IF EXISTS `Categories`;

CREATE TABLE `Categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `wattage` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `durability_rating` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `battery_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warranty_info` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manual_pdf_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL COMMENT 'Technical specifications in JSON format',
  `is_featured` tinyint(1) DEFAULT '0',
  `stock_status` enum('in_stock','out_of_stock','pre_order') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'in_stock',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_featured` (`is_featured`),
  KEY `idx_products_stock` (`stock_status`),
  KEY `idx_products_category_featured` (`category_id`,`is_featured`),
  FULLTEXT KEY `idx_products_search` (`name`,`description`),
  CONSTRAINT `Products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Kits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `stock_status` enum('in_stock','out_of_stock','pre_order') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'in_stock',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_kits_slug` (`slug`),
  KEY `idx_kits_featured` (`is_featured`),
  KEY `idx_kits_stock` (`stock_status`),
  FULLTEXT KEY `idx_kits_search` (`name`,`description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ProductImages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_images_product_id` (`product_id`),
  CONSTRAINT `ProductImages_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `KitImages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kit_id` int NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_kit_images_kit_id` (`kit_id`),
  CONSTRAINT `KitImages_ibfk_1` FOREIGN KEY (`kit_id`) REFERENCES `Kits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `KitProducts` (
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
  CONSTRAINT `KitProducts_ibfk_1` FOREIGN KEY (`kit_id`) REFERENCES `Kits` (`id`) ON DELETE CASCADE,
  CONSTRAINT `KitProducts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Categories` (`id`,`name`,`description`,`image_url`,`slug`) VALUES
(1,'Solar Panels','High-efficiency photovoltaic modules for residential, commercial, industrial, and utility-scale solar systems.',NULL,'solar-panels'),
(2,'Inverters','Off-grid, hybrid, single-phase, and three-phase solar inverters for reliable power conversion and storage integration.',NULL,'inverters'),
(3,'Batteries','LiFePO4 energy storage batteries including wall-mounted, rack-mounted, stackable, and high-voltage cabinet systems.',NULL,'batteries'),
(4,'Charge Controllers','PWM and MPPT solar charge controllers for battery charging, PV input optimization, and system protection.',NULL,'charge-controllers'),
(5,'Accessories','Solar cables, MC4 connectors, mounting brackets, rails, fasteners, and installation accessories.',NULL,'accessories'),
(6,'Solar Lights','Solar lighting products for roads, public spaces, compounds, landscapes, indoor use, and off-grid applications.',NULL,'solar-lights'),
(7,'Solar Street Lights','Integrated solar street lights with mono solar panels, LiFePO4 batteries, LED modules, radar sensors, and optional camera features.',NULL,'solar-street-lights'),
(8,'Solar Flood Lights','Outdoor solar flood lights for yards, farms, warehouses, compounds, playgrounds, parking areas, and security lighting.',NULL,'solar-flood-lights'),
(9,'Solar Garden Lights','Decorative and functional solar lawn, garden, pathway, and landscape lighting products.',NULL,'solar-garden-lights'),
(10,'Solar Strip Lights','Flexible solar strip lighting for outdoor decoration, signage, paths, and low-voltage solar lighting applications.',NULL,'solar-strip-lights'),
(11,'Solar Batten Lights','Solar-powered batten tube lights for rooms, shops, corridors, field offices, and spaces without reliable grid electricity.',NULL,'solar-batten-lights'),
(12,'Solar Fans','Portable rechargeable solar fans for homes, clinics, shops, schools, and off-grid comfort applications.',NULL,'solar-fans'),
(13,'Solar Light and Fan Packages','Integrated solar kits combining lighting, fan cooling, battery storage, mobile charging, and solar input for daily use.',NULL,'solar-light-and-fan-packages'),
(14,'Energy Storage Systems','Residential, commercial, industrial, containerized, and PV plus ESS plus EV charging energy storage solutions.',NULL,'energy-storage-systems'),
(15,'EV Chargers','EV charging systems and PV plus ESS plus EVSE solutions for fleet yards, public charging, and commercial parking.',NULL,'ev-chargers'),
(16,'UPS Systems','Industrial uninterruptible power supply systems for critical backup and stable pure sine wave output.',NULL,'ups-systems'),
(17,'BIPV Carports','Solar carport structures integrating vehicle shelter, PV generation, and optional EV charging deployment.',NULL,'bipv-carports'),
(18,'Energy Management Systems','EMS software and controller platforms for monitoring, dispatching, and coordinating PV, ESS, load, grid, and EV charging.',NULL,'energy-management-systems'),
(19,'Combiner Boxes','PV combiner boxes for DC string protection, surge protection, isolation, and organized inverter input wiring.',NULL,'combiner-boxes'),
(20,'Solar Water Pumps','Solar water pump systems for agriculture, irrigation, boreholes, livestock, and rural water supply.',NULL,'solar-water-pumps'),
(21,'Solar Generators','Portable and semi-mobile solar generator systems for emergency backup, outdoor work, and remote power.',NULL,'solar-generators');

INSERT INTO `Products` (`id`,`category_id`,`name`,`price`,`description`,`wattage`,`durability_rating`,`battery_type`,`warranty_info`,`image_url`,`manual_pdf_url`,`video_url`,`metadata`,`is_featured`,`stock_status`) VALUES
(101,1,'Mono Half-Cell Solar Panel Grade A 300W',0.00,'Grade A monocrystalline half-cell PV module for compact residential systems, solar generators, lighting kits, and small off-grid installations.','300W','Grade A Mono Half-Cell',NULL,'8 years product guarantee; 25 years performance design',NULL,NULL,NULL,'{"technology":"Monocrystalline half-cell","power":"300W","application":"residential, kit, off-grid","module_type":"framed PV module","cell_grade":"Grade A"}',1,'in_stock'),
(102,1,'Mono Half-Cell Solar Panel Grade A 450W',0.00,'High-output monocrystalline PV module for home, commercial, and agricultural solar systems requiring strong generation density.','450W','Grade A Mono Half-Cell',NULL,'12 years product warranty; 25 years performance design',NULL,NULL,NULL,'{"technology":"Monocrystalline half-cell","power":"450W","application":"home, commercial, agriculture","module_type":"framed PV module"}',1,'in_stock'),
(103,1,'Mono Half-Cell Solar Panel Grade A 550W',0.00,'High-efficiency 550W solar panel for residential, commercial, and industrial PV arrays.','550W','Grade A Mono PERC / Half-Cell',NULL,'12 years product warranty; 25 years performance design',NULL,NULL,NULL,'{"technology":"Monocrystalline half-cell","power":"550W","efficiency":"21 percent class","application":"residential, commercial, industrial","recommended_for":"large PV arrays"}',1,'in_stock'),
(104,1,'N-Type TOPCon Solar Panel 580W',0.00,'Premium N-type TOPCon PV module for higher yield, lower degradation, and commercial or utility-scale systems.','580W','N-Type TOPCon',NULL,'12 years product warranty; 25 years performance design',NULL,NULL,NULL,'{"technology":"N-Type TOPCon","power":"580W","advantages":"low degradation, high yield","application":"commercial, industrial, utility"}',1,'in_stock'),
(105,1,'Bifacial Dual-Glass Solar Panel 600W',0.00,'Bifacial dual-glass module for ground mount, carport, and utility projects where rear-side gain can improve total generation.','600W','Bifacial Dual Glass',NULL,'12 years product warranty; 30 years performance design',NULL,NULL,NULL,'{"technology":"Bifacial dual glass","power":"600W","application":"carport, ground mount, utility","feature":"rear-side generation gain"}',0,'in_stock'),
(106,1,'Flexible Solar Panel 200W',0.00,'Lightweight flexible solar panel for mobile, curved, temporary, and portable applications.','200W','Flexible Mono',NULL,'2 years product warranty',NULL,NULL,NULL,'{"technology":"Flexible monocrystalline","power":"200W","application":"portable, vehicle, marine, temporary power"}',0,'in_stock'),

(201,2,'High Frequency Hybrid Solar Inverter 1.5kW',0.00,'Entry high-frequency hybrid solar inverter for 1.5kW home solar systems, small backup loads, and compact solar generator style packages.','1.5kW','High Frequency Hybrid MPPT',NULL,'2 years guarantee',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","type":"high_frequency_hybrid_inverter","rated_power":"1.5kW","waveform":"pure sine wave","mppt":"built-in","battery_support":"lithium and lead-acid by configuration","application":"1.5kW home solar system"}',1,'in_stock'),
(202,2,'High Frequency Hybrid Solar Inverter 3.0kW',0.00,'High-frequency hybrid solar inverter for 3.0kW home solar systems, small shops, offices, and reliable backup power.','3.0kW','High Frequency Hybrid MPPT',NULL,'2 years guarantee',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","type":"high_frequency_hybrid_inverter","rated_power":"3.0kW","waveform":"pure sine wave","mppt":"built-in","battery_support":"lithium and lead-acid by configuration","application":"3.0kW home solar system"}',1,'in_stock'),
(203,2,'High Frequency Hybrid Solar Inverter 6.2kW',0.00,'High-output high-frequency hybrid inverter for Entelechy-style 6.2kW to 10kW home solar system configurations.','6.2kW','High Frequency Hybrid MPPT',NULL,'2 years guarantee',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","type":"high_frequency_hybrid_inverter","rated_power":"6.2kW","waveform":"pure sine wave","mppt":"built-in","battery_support":"lithium battery compatible","application":"6.2kW-10kW home solar system"}',1,'in_stock'),
(204,2,'High Frequency Hybrid Solar Inverter 8.5kW',0.00,'Large single-phase hybrid inverter for higher household backup loads and small commercial solar storage systems.','8.5kW','High Frequency Hybrid MPPT',NULL,'2 years guarantee',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","type":"high_frequency_hybrid_inverter","rated_power":"8.5kW","waveform":"pure sine wave","mppt":"built-in","application":"large home backup, small commercial backup"}',1,'in_stock'),
(205,2,'High Frequency Hybrid Solar Inverter 10.2kW',0.00,'High-performance hybrid inverter integrating pure sine wave output, intelligent charging, dual MPPT solar input, and battery management for 10kW class home systems.','10.2kW','High Frequency Hybrid Dual MPPT',NULL,'5 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style_plus_sunlink_pdf","type":"high_frequency_hybrid_inverter","rated_power":"10.2kW","mppt":"dual MPPT","max_pv_input":"11000W class","battery_voltage":"48V DC","monitoring":"mobile app and remote monitoring optional"}',1,'in_stock'),
(206,2,'High Frequency Hybrid Solar Inverter 11.0kW',0.00,'Large-capacity hybrid inverter for 11.0kW home solar systems, offices, telecom, and remote project sites requiring strong backup.','11.0kW','High Frequency Hybrid MPPT',NULL,'2 years guarantee',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","type":"high_frequency_hybrid_inverter","rated_power":"11.0kW","battery_voltage":"51.2V compatible","application":"11kW home, office, remote site"}',0,'in_stock'),
(207,2,'High Voltage Hybrid Solar Inverter 15kW Three Phase',0.00,'Three-phase high-voltage hybrid inverter for commercial solar systems, small factories, and higher-power storage installations.','15kW','High Voltage Three Phase Hybrid',NULL,'5 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","type":"high_voltage_hybrid_inverter","rated_power":"15kW","application":"commercial, industrial","phase":"three phase"}',0,'in_stock'),
(208,2,'High Voltage Hybrid Solar Inverter 20kW Three Phase',0.00,'High-voltage three-phase hybrid inverter for commercial buildings, warehouses, and industrial PV plus storage systems.','20kW','High Voltage Three Phase Hybrid',NULL,'5 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","type":"high_voltage_hybrid_inverter","rated_power":"20kW","application":"commercial, industrial","phase":"three phase"}',0,'in_stock'),
(209,2,'High Voltage Hybrid Solar Inverter 30kW Three Phase',0.00,'High-capacity high-voltage three-phase hybrid inverter for 30kW to 60kW commercial solar system families.','30kW','High Voltage Three Phase Hybrid',NULL,'5 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","type":"high_voltage_hybrid_inverter","rated_power":"30kW","application":"30kW-60kW commercial solar systems","phase":"three phase"}',0,'in_stock'),

(301,3,'Powerwall LiFePO4 Battery 51.2V 2.5kWh',0.00,'Compact Entelechy-style powerwall battery module for small solar kits, emergency backup, lighting systems, and solar generators.','2.5kWh','Powerwall Long Cycle Life','LiFePO4','5 years guarantee',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","chemistry":"LiFePO4","voltage":"51.2V","energy":"2.5kWh","display_family":"2.5KWh powerwall","application":"small kit, backup, solar generator"}',1,'in_stock'),
(302,3,'Powerwall LiFePO4 Battery 51.2V 5.12kWh',0.00,'Wall-mounted 5kWh class LiFePO4 powerwall battery for residential solar backup and hybrid inverter systems.','5.12kWh','Powerwall 6000 Cycle Class','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style_plus_sunlink_pdf","chemistry":"LiFePO4","voltage":"51.2V","energy":"5.12kWh","display_family":"5KWh powerwall","capacity":"100Ah class","depth_of_discharge":"up to 95 percent class","communication":"RS485/CAN optional"}',1,'in_stock'),
(303,3,'Powerwall LiFePO4 Battery 51.2V 10.24kWh',0.00,'10kWh class powerwall LiFePO4 battery for home and light commercial solar storage.','10.24kWh','Powerwall Long Cycle Life','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style_plus_sunlink_pdf","chemistry":"LiFePO4","voltage":"51.2V","energy":"10.24kWh","display_family":"10KWh powerwall","application":"residential, light commercial"}',1,'in_stock'),
(304,3,'Powerwall LiFePO4 Battery 51.2V 16kWh',0.00,'Large powerwall LiFePO4 battery for Entelechy-style 15kWh to 17kWh residential storage families.','16kWh','Powerwall Long Cycle Life','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style_plus_sunlink_pdf","chemistry":"LiFePO4","voltage":"51.2V","energy":"16kWh","display_family":"15KWh-17KWh powerwall","application":"large home, commercial backup"}',1,'in_stock'),
(305,3,'Powerwall LiFePO4 Battery 51.2V 17.5kWh',0.00,'High-capacity 17.5kWh powerwall battery for large homes, offices, and scalable backup systems.','17.5kWh','Powerwall Long Cycle Life','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style_plus_sunlink_pdf","chemistry":"LiFePO4","voltage":"51.2V","energy":"17.5kWh","display_family":"15KWh-17KWh powerwall","application":"large home, office, scalable backup"}',0,'in_stock'),
(306,3,'Powerwall LiFePO4 Battery 48V 100Ah 4.8kWh',0.00,'Wall-mounted LiFePO4 battery for clean residential and light commercial installations.','4.8kWh','Powerwall Wall Mounted','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","chemistry":"LiFePO4","voltage":"48V","capacity":"100Ah","energy":"4.8kWh","mounting":"wall mounted"}',0,'in_stock'),
(307,3,'Powerwall LiFePO4 Battery 51.2V 200Ah 10.24kWh',0.00,'Higher-capacity wall-mounted LiFePO4 powerwall battery for residential solar storage and hybrid inverter pairing.','10.24kWh','Powerwall Wall Mounted','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style_plus_sunlink_pdf","chemistry":"LiFePO4","voltage":"51.2V","capacity":"200Ah","energy":"10.24kWh","mounting":"wall mounted"}',0,'in_stock'),
(308,3,'Rack-Mounted LiFePO4 Battery 48V 100Ah 4.8kWh',0.00,'Rack-mounted battery module for telecom, server room, UPS, and modular solar storage applications.','4.8kWh','Rack Mounted','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"chemistry":"LiFePO4","voltage":"48V","capacity":"100Ah","energy":"4.8kWh","mounting":"rack mounted"}',0,'in_stock'),
(309,3,'Rack-Mounted LiFePO4 Battery 51.2V 200Ah 10.24kWh',0.00,'Rack-mounted 10.24kWh LiFePO4 module for modular commercial storage and expandable backup systems.','10.24kWh','Rack Mounted','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"chemistry":"LiFePO4","voltage":"51.2V","capacity":"200Ah","energy":"10.24kWh","mounting":"rack mounted"}',0,'in_stock'),
(310,3,'Vertical Low Voltage Stack Battery 20.48kWh',0.00,'Stackable low-voltage LiFePO4 battery tower for residential and commercial solar storage.','20.48kWh','Stackable Low Voltage','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"chemistry":"LiFePO4","voltage_class":"low voltage","energy":"20.48kWh","mounting":"vertical stack"}',0,'in_stock'),
(311,3,'High Voltage Rack Battery Cabinet 51.2kWh',0.00,'High-voltage rack battery cabinet for three-phase solar storage and commercial backup.','51.2kWh','High Voltage Cabinet','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"chemistry":"LiFePO4","voltage_class":"high voltage","energy":"51.2kWh","application":"commercial, three-phase storage"}',0,'in_stock'),
(312,3,'I&C High Voltage Rack Battery System 107.52kWh',0.00,'Industrial and commercial high-voltage rack battery system for ESS projects and critical backup.','107.52kWh','I&C High Voltage','LiFePO4','Project warranty by configuration',NULL,NULL,NULL,'{"chemistry":"LiFePO4","voltage_class":"high voltage","energy":"107.52kWh","application":"industrial and commercial ESS"}',1,'in_stock'),
(313,3,'I&C High Voltage Rack Battery System 215.04kWh',0.00,'Large industrial and commercial high-voltage battery system for ESS, peak shaving, and PV storage projects.','215.04kWh','I&C High Voltage','LiFePO4','Project warranty by configuration',NULL,NULL,NULL,'{"chemistry":"LiFePO4","voltage_class":"high voltage","energy":"215.04kWh","application":"industrial and commercial ESS"}',1,'in_stock'),

(401,4,'MPPT Charge Controller 40A',0.00,'MPPT solar charge controller for smaller off-grid PV systems and battery charging applications.','40A','MPPT',NULL,'2 years warranty',NULL,NULL,NULL,'{"type":"MPPT","rated_current":"40A","application":"small off-grid solar charging"}',0,'in_stock'),
(402,4,'MPPT Charge Controller 60A',0.00,'MPPT controller for medium PV battery systems requiring improved charging efficiency and battery protection.','60A','MPPT',NULL,'2 years warranty',NULL,NULL,NULL,'{"type":"MPPT","rated_current":"60A","application":"medium solar battery system"}',0,'in_stock'),
(403,4,'MPPT Charge Controller 100A',0.00,'High-current MPPT charge controller for larger standalone PV battery systems.','100A','MPPT',NULL,'2 years warranty',NULL,NULL,NULL,'{"type":"MPPT","rated_current":"100A","application":"large standalone PV system"}',0,'in_stock'),

(501,5,'PV Cable 4mm 100m Roll',0.00,'Outdoor photovoltaic cable for safe DC wiring between solar panels, combiner boxes, and inverters.',NULL,'Outdoor Solar Grade',NULL,NULL,NULL,NULL,NULL,'{"size":"4mm2","length":"100m","rated_voltage":"DC 1500V class","conductor":"tinned copper","application":"solar DC wiring"}',0,'in_stock'),
(502,5,'PV Cable 6mm 100m Roll',0.00,'Heavy-duty PV cable for larger solar strings and longer DC cable runs.',NULL,'Outdoor Solar Grade',NULL,NULL,NULL,NULL,NULL,'{"size":"6mm2","length":"100m","rated_voltage":"DC 1500V class","application":"solar DC wiring"}',0,'in_stock'),
(503,5,'MC4 Connector Pair',0.00,'Water-resistant MC4-compatible connector pair for PV module and string wiring.',NULL,'Outdoor Solar Grade',NULL,NULL,NULL,NULL,NULL,'{"type":"MC4 compatible connector","application":"PV string wiring","weather_resistant":"yes"}',0,'in_stock'),
(504,5,'Battery Cable and MC4 Connector Set',0.00,'Cable and connector set for connecting batteries, inverter, and PV input during solar system installation.',NULL,'Standard',NULL,NULL,NULL,NULL,NULL,'{"includes":"battery cable and MC4 connector set","application":"solar kit installation"}',0,'in_stock'),
(505,5,'Solar Mounting Bracket Set - Small System',0.00,'Corrosion-resistant aluminum mounting set for small roof or ground solar installations.',NULL,'Anodized Aluminum',NULL,'25 years service-life design',NULL,NULL,NULL,'{"material":"anodized aluminum and stainless fasteners","application":"small PV mounting","mounting":"roof or ground"}',0,'in_stock'),
(506,5,'Solar Mounting Bracket Set - Large System',0.00,'Heavy-duty aluminum bracket and rail set for larger residential, commercial, and agricultural PV arrays.',NULL,'Anodized Aluminum',NULL,'25 years service-life design',NULL,NULL,NULL,'{"material":"anodized aluminum and stainless fasteners","application":"large PV mounting","mounting":"roof or ground"}',0,'in_stock'),

(601,7,'Smart Solar Street Light 100W',0.00,'Integrated 100W solar street light with mono solar panel, LiFePO4 battery, LED output, and radar sensor option.','100W','Outdoor Solar Grade','LiFePO4','2 years warranty',NULL,NULL,NULL,'{"series":"Smart Solar Street Light","power":"100W","battery":"LiFePO4","cct":"6000K-6500K","sensor":"radar optional"}',1,'in_stock'),
(602,7,'Smart Solar Street Light 200W',0.00,'Integrated 200W smart solar street light for roads, estates, compounds, farms, and community lighting.','200W','Outdoor Solar Grade','LiFePO4','2 years warranty',NULL,NULL,NULL,'{"series":"Smart Solar Street Light","power":"200W","battery":"LiFePO4","cct":"6000K-6500K","sensor":"radar optional"}',1,'in_stock'),
(603,7,'Smart Solar Street Light 300W',0.00,'High-output solar street light for wider roads, public areas, and commercial compounds.','300W','Outdoor Solar Grade','LiFePO4','2 years warranty',NULL,NULL,NULL,'{"series":"Smart Solar Street Light","power":"300W","battery":"LiFePO4","application":"road, public area, compound"}',1,'in_stock'),
(604,7,'Camera Solar Street Light 200W',0.00,'Solar street light with integrated camera option for lighting plus security monitoring applications.','200W','Outdoor Solar Grade','LiFePO4','2 years warranty',NULL,NULL,NULL,'{"series":"Camera Solar Street Light","power":"200W","battery":"LiFePO4","feature":"camera option"}',0,'in_stock'),
(605,7,'Camera Solar Street Light 400W',0.00,'High-output camera solar street light for public safety, perimeter lighting, and compounds.','400W','Outdoor Solar Grade','LiFePO4','2 years warranty',NULL,NULL,NULL,'{"series":"Camera Solar Street Light","power":"400W","feature":"camera option","application":"security lighting"}',0,'in_stock'),
(606,7,'Nova Solar Street Light 1000W',0.00,'Large-format solar street light for high-brightness outdoor lighting and infrastructure use.','1000W','Outdoor Solar Grade','LiFePO4','2 years warranty',NULL,NULL,NULL,'{"series":"Nova Solar Street Light","power":"1000W","application":"infrastructure, road, public lighting"}',0,'in_stock'),

(701,8,'Aurora Solar Flood Light 100W',0.00,'Compact solar flood light for homes, yards, walkways, entrances, and small outdoor spaces.','100W','Outdoor Solar Grade','Lithium','2 years warranty',NULL,NULL,NULL,'{"series":"Aurora Solar Flood Light","power":"100W","application":"yard, entrance, small outdoor space"}',1,'in_stock'),
(702,8,'Aurora Solar Flood Light 300W',0.00,'Medium solar flood light for compounds, farms, parking, and security lighting.','300W','Outdoor Solar Grade','Lithium','2 years warranty',NULL,NULL,NULL,'{"series":"Aurora Solar Flood Light","power":"300W","application":"compound, farm, parking"}',1,'in_stock'),
(703,8,'Solar Flood Light 600W',0.00,'High-brightness solar flood light for warehouses, open yards, playgrounds, and rural public lighting.','600W','Outdoor Solar Grade','Lithium','2 years warranty',NULL,NULL,NULL,'{"series":"Solar Flood Light","power":"600W","application":"warehouse, yard, playground"}',0,'in_stock'),
(704,8,'Camera Solar Flood Light 800W',0.00,'Camera-enabled solar flood light for security applications requiring both lighting and visual monitoring.','800W','Outdoor Solar Grade','Lithium','2 years warranty',NULL,NULL,NULL,'{"series":"Camera Solar Flood Light","power":"800W","feature":"camera option","application":"security lighting"}',0,'in_stock'),

(801,9,'Solar Lawn Light 200W',0.00,'Decorative solar lawn light for gardens, pathways, villa landscapes, and public parks.','200W','Outdoor Solar Grade','Lithium','1 year warranty',NULL,NULL,NULL,'{"type":"solar lawn light","power":"200W","application":"garden, pathway, landscape"}',0,'in_stock'),
(802,9,'Solar Garden Light 1000W',0.00,'Large solar garden light for landscape lighting, parks, pathways, and outdoor decorative illumination.','1000W','Outdoor Solar Grade','Lithium','1 year warranty',NULL,NULL,NULL,'{"type":"solar garden light","power":"1000W","application":"park, pathway, landscape"}',0,'in_stock'),

(901,10,'Single Color Solar Strip Light 50W',0.00,'Flexible single-color solar strip light for decorative outdoor lighting and low-voltage solar applications.','50W','Outdoor Solar Grade','Lithium','1 year warranty',NULL,NULL,NULL,'{"type":"solar strip light","power":"50W","color":"single color","application":"decoration, signage, pathway"}',0,'in_stock'),
(902,10,'Single Color Solar Strip Light 100W',0.00,'Higher-output solar strip light for longer decorative or pathway lighting runs.','100W','Outdoor Solar Grade','Lithium','1 year warranty',NULL,NULL,NULL,'{"type":"solar strip light","power":"100W","color":"single color","application":"decoration, pathway"}',0,'in_stock'),

(1001,11,'Solar Batten Light 100W',0.00,'Solar-powered batten tube light for shops, corridors, homes, small offices, and off-grid interiors.','100W','Indoor/Outdoor Utility','Lithium','1 year warranty',NULL,NULL,NULL,'{"type":"solar batten light","power":"100W","application":"room, shop, corridor"}',0,'in_stock'),
(1002,11,'Solar Batten Light 200W',0.00,'Higher-output solar batten light for larger rooms, classrooms, clinics, and workspaces.','200W','Indoor/Outdoor Utility','Lithium','1 year warranty',NULL,NULL,NULL,'{"type":"solar batten light","power":"200W","application":"classroom, clinic, workspace"}',0,'in_stock'),

(1101,12,'Solar Air Circulation Fan Small',0.00,'Portable rechargeable solar fan for home, dormitory, clinic, shop, and small room cooling.','Small DC Fan','Portable Rechargeable','Lithium','1 year warranty',NULL,NULL,NULL,'{"type":"solar fan","charging":"solar and DC charging","application":"home, shop, clinic","feature":"portable rechargeable"}',1,'in_stock'),
(1102,12,'Solar Air Circulation Fan Medium',0.00,'Medium solar fan with rechargeable battery for improved airflow in off-grid rooms and small businesses.','Medium DC Fan','Portable Rechargeable','Lithium','1 year warranty',NULL,NULL,NULL,'{"type":"solar fan","charging":"solar and DC charging","application":"room, shop, classroom"}',1,'in_stock'),
(1103,12,'Solar Air Circulation Fan Large',0.00,'Large rechargeable solar fan for larger rooms, clinics, shops, and field use.','Large DC Fan','Portable Rechargeable','Lithium','1 year warranty',NULL,NULL,NULL,'{"type":"solar fan","charging":"solar and DC charging","application":"large room, clinic, field use"}',0,'in_stock'),

(1201,13,'Solar Light and Fan Home Kit Basic',0.00,'Integrated solar light and fan package for basic household lighting, fan cooling, and mobile charging.','Basic Kit','Portable Kit','Lithium','1 year warranty',NULL,NULL,NULL,'{"kit_type":"light and fan package","includes":"solar panel, lamps, fan, battery, phone charging","application":"home, shop, room"}',1,'in_stock'),
(1202,13,'Solar Light and Fan Home Kit Pro',0.00,'Expanded solar light and fan kit with larger battery capacity and additional lighting points for daily household use.','Pro Kit','Portable Kit','Lithium','1 year warranty',NULL,NULL,NULL,'{"kit_type":"light and fan package","includes":"solar panel, multiple lamps, fan, battery, USB output","application":"home, classroom, clinic"}',1,'in_stock'),
(1203,13,'Solar Light and Fan Community Kit',0.00,'Larger light and fan package for clinics, classrooms, remote shops, and community spaces.','Community Kit','Portable Kit','Lithium','1 year warranty',NULL,NULL,NULL,'{"kit_type":"light and fan package","includes":"larger panel, multiple lamps, fan, battery, charging outputs","application":"clinic, classroom, community"}',0,'in_stock'),

(1301,14,'Single-Phase All-in-One ESS 6kW / 5.12kWh',0.00,'Residential all-in-one energy storage system combining inverter and LiFePO4 storage in a compact platform.','6kW / 5.12kWh','All-in-One ESS','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"type":"all-in-one ESS","power":"6kW","energy":"5.12kWh","phase":"single phase","application":"residential"}',1,'in_stock'),
(1302,14,'Single-Phase All-in-One ESS 6kW / 10.24kWh',0.00,'Larger residential all-in-one energy storage system for longer backup runtime and higher daily energy coverage.','6kW / 10.24kWh','All-in-One ESS','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"type":"all-in-one ESS","power":"6kW","energy":"10.24kWh","phase":"single phase","application":"residential"}',1,'in_stock'),
(1303,14,'Three-Phase High Voltage ESS 10kW / 19.2kWh',0.00,'Three-phase high-voltage integrated ESS for villas, offices, and small commercial facilities.','10kW / 19.2kWh','High Voltage ESS','LiFePO4','5 years warranty',NULL,NULL,NULL,'{"type":"integrated ESS","power":"10kW","energy":"19.2kWh","phase":"three phase","application":"commercial, villa"}',0,'in_stock'),
(1304,14,'Air-Cooled ESS Cabinet 215kWh / 100kW',0.00,'Commercial energy storage cabinet for peak shaving, backup, PV self-consumption, and charging station support.','215kWh / 100kW','Commercial ESS Cabinet','LiFePO4','Project warranty by configuration',NULL,NULL,NULL,'{"type":"air-cooled ESS cabinet","energy":"215kWh","power":"100kW","application":"commercial, industrial"}',1,'in_stock'),
(1305,14,'Liquid-Cooled ESS Cabinet 261kWh / 125kW',0.00,'Liquid-cooled commercial and industrial ESS cabinet for higher energy density and stable thermal control.','261kWh / 125kW','Liquid-Cooled ESS Cabinet','LiFePO4','Project warranty by configuration',NULL,NULL,NULL,'{"type":"liquid-cooled ESS cabinet","energy":"261kWh","power":"125kW","thermal_management":"liquid cooled","application":"commercial, industrial"}',1,'in_stock'),
(1306,14,'PV ESS EVSE Containerized System 522kWh / 250kW / 240kW Charging',0.00,'Containerized PV plus ESS plus EV charging solution for charging depots, industrial parks, and microgrid projects.','522kWh / 250kW / 240kW','Containerized ESS','LiFePO4','Project warranty by configuration',NULL,NULL,NULL,'{"type":"containerized PV ESS EVSE","energy":"522kWh","pcs_power":"250kW","charging_power":"240kW","application":"EV station, industrial park, microgrid"}',1,'in_stock'),

(1401,15,'Commercial EVSE Charging System 60kW',0.00,'DC EV charging system for commercial parking, fleet charging, hotels, shopping centers, and solar EV station projects.','60kW','DC Fast Charger',NULL,'Project warranty by configuration',NULL,NULL,NULL,'{"type":"DC EV charger","power":"60kW","application":"commercial parking, fleet, hotel"}',1,'in_stock'),
(1402,15,'Commercial EVSE Charging System 120kW',0.00,'High-power DC charging system for faster fleet and public charging operations.','120kW','DC Fast Charger',NULL,'Project warranty by configuration',NULL,NULL,NULL,'{"type":"DC EV charger","power":"120kW","application":"public charging, fleet"}',1,'in_stock'),
(1403,15,'Commercial EVSE Charging System 360kW / 720kW',0.00,'High-capacity EV charging platform for large charging depots and PV plus ESS plus EVSE projects.','360kW / 720kW','High-Power Charging System',NULL,'Project warranty by configuration',NULL,NULL,NULL,'{"type":"high-power EVSE","power":"360kW to 720kW","application":"charging depot, fleet yard, PV ESS EVSE"}',1,'in_stock'),

(1501,16,'Industrial Digital UPS 10kVA / 10kW',0.00,'Three-phase digital UPS with pure sine wave output for critical loads and backup power protection.','10kVA / 10kW','Industrial UPS',NULL,'Project warranty by configuration',NULL,NULL,NULL,'{"type":"industrial UPS","capacity":"10kVA / 10kW","waveform":"pure sine wave","phase":"three phase"}',0,'in_stock'),
(1502,16,'Industrial Digital UPS 30kVA / 30kW',0.00,'Industrial UPS system for commercial, medical, telecom, and critical facility backup power.','30kVA / 30kW','Industrial UPS',NULL,'Project warranty by configuration',NULL,NULL,NULL,'{"type":"industrial UPS","capacity":"30kVA / 30kW","waveform":"pure sine wave","phase":"three phase"}',0,'in_stock'),
(1503,16,'Industrial Digital UPS 60kVA / 60kW',0.00,'High-capacity three-phase UPS for industrial and critical infrastructure backup applications.','60kVA / 60kW','Industrial UPS',NULL,'Project warranty by configuration',NULL,NULL,NULL,'{"type":"industrial UPS","capacity":"60kVA / 60kW","waveform":"pure sine wave","phase":"three phase"}',0,'in_stock'),
(1504,16,'Industrial Digital UPS 100kVA / 100kW',0.00,'Large industrial digital UPS for high-availability power systems and mission-critical loads.','100kVA / 100kW','Industrial UPS',NULL,'Project warranty by configuration',NULL,NULL,NULL,'{"type":"industrial UPS","capacity":"100kVA / 100kW","waveform":"pure sine wave","phase":"three phase"}',0,'in_stock'),

(1601,17,'BIPV Solar Carport Commercial Single-Post Structure',0.00,'BIPV carport structure combining vehicle shelter, PV generation, and optional EV charging station integration.','Project Based','BIPV Structure',NULL,'Project warranty by configuration',NULL,NULL,NULL,'{"type":"BIPV solar carport","structure":"commercial single-post","application":"parking, EV charging, PV generation"}',1,'in_stock'),
(1701,18,'Energy Management System Platform',0.00,'EMS platform for monitoring and dispatching PV, ESS, grid, load, and EV charging assets.','Software / Controller','EMS Platform',NULL,'Project warranty by configuration',NULL,NULL,NULL,'{"type":"energy management system","monitors":"PV, ESS, grid, load, EV charging","application":"microgrid, commercial ESS, EV station"}',1,'in_stock'),

(1801,19,'PV Combiner Box 1-In 1-Out 1000V',0.00,'PV combiner box for one solar input string and one output with DC fuse, surge protection, and isolation support.',NULL,'IP65 Outdoor Rated',NULL,NULL,NULL,NULL,NULL,'{"type":"PV combiner box","input_strings":"1","output_strings":"1","system_voltage":"1000V DC","protection":"fuse, SPD, isolation switch"}',0,'in_stock'),
(1802,19,'PV Combiner Box 2-In 1-Out 1000V',0.00,'PV combiner box for two solar input strings and one output channel in residential and commercial arrays.',NULL,'IP65 Outdoor Rated',NULL,NULL,NULL,NULL,NULL,'{"type":"PV combiner box","input_strings":"2","output_strings":"1","system_voltage":"1000V DC","protection":"fuse, SPD, isolation switch"}',0,'in_stock'),
(1803,19,'PV Combiner Box 4-In 1-Out 1000V',0.00,'PV combiner box for four solar input strings with surge protection and DC output switching.',NULL,'IP65 Outdoor Rated',NULL,NULL,NULL,NULL,NULL,'{"type":"PV combiner box","input_strings":"4","output_strings":"1","system_voltage":"1000V DC","protection":"fuse, SPD, isolation switch"}',0,'in_stock'),
(1804,19,'PV Combiner Box 8-In 1-Out 1000V',0.00,'PV combiner box for larger PV arrays requiring eight DC string inputs and protected output wiring.',NULL,'IP65 Outdoor Rated',NULL,NULL,NULL,NULL,NULL,'{"type":"PV combiner box","input_strings":"8","output_strings":"1","system_voltage":"1000V DC","protection":"fuse, SPD, isolation switch"}',0,'in_stock'),
(1805,19,'PV Combiner Box 16-In 1-Out 1000V',0.00,'High-capacity PV combiner box for industrial and utility-scale DC solar array management.',NULL,'IP65 Outdoor Rated',NULL,NULL,NULL,NULL,NULL,'{"type":"PV combiner box","input_strings":"16","output_strings":"1","system_voltage":"1000V DC","protection":"fuse, SPD, isolation switch"}',0,'in_stock'),

(1901,20,'Solar Water Pump 0.75kW',0.00,'Solar water pump for small irrigation, livestock watering, garden supply, and rural water transfer.','0.75kW','Solar Pump',NULL,'1 year warranty',NULL,NULL,NULL,'{"type":"solar water pump","power":"0.75kW","application":"small irrigation, livestock, garden"}',1,'in_stock'),
(1902,20,'Solar Water Pump 1.5kW',0.00,'Solar pump for farms, boreholes, irrigation systems, and rural water storage applications.','1.5kW','Solar Pump',NULL,'1 year warranty',NULL,NULL,NULL,'{"type":"solar water pump","power":"1.5kW","application":"farm, borehole, irrigation"}',1,'in_stock'),
(1903,20,'Solar Water Pump 3kW',0.00,'Higher-capacity solar water pump for agricultural irrigation and commercial rural water projects.','3kW','Solar Pump',NULL,'1 year warranty',NULL,NULL,NULL,'{"type":"solar water pump","power":"3kW","application":"agriculture, irrigation, rural water"}',1,'in_stock'),

(2001,21,'Solar Power Generator 1500W',0.00,'Entelechy-style solar power generator for emergency backup, outdoor work, camping, small shops, and mobile power needs.','1500W','Solar Power Generator','LiFePO4','2 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","type":"solar_power_generator","rated_power":"1500W","battery":"LiFePO4","waveform":"pure sine wave","charging":"solar hybrid charging","application":"backup, outdoor, mobile power"}',1,'in_stock'),
(2002,21,'Solar Power Generator 3000W',0.00,'Larger solar power generator for homes, field teams, small business backup, and equipment charging.','3000W','Solar Power Generator','LiFePO4','2 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","type":"solar_power_generator","rated_power":"3000W","battery":"LiFePO4","waveform":"pure sine wave","charging":"solar hybrid charging","application":"home backup, field work, small business"}',1,'in_stock'),
(2003,21,'Solar Power Generator 6200W',0.00,'High-output solar power generator for resilient household loads, remote site power, and field operations.','6200W','Solar Power Generator','LiFePO4','2 years warranty',NULL,NULL,NULL,'{"source_alignment":"entelechy_style","type":"solar_power_generator","rated_power":"6200W","battery":"LiFePO4","waveform":"pure sine wave","charging":"solar hybrid charging","application":"remote site, home backup, field operations"}',0,'in_stock');

INSERT INTO `Kits` (`id`,`name`,`description`,`image_url`,`slug`,`is_featured`,`stock_status`) VALUES
(1,'1.5KW Home Solar System','Compact Entelechy-style residential solar kit for lighting, phone charging, router backup, fan use, and small daily loads. Designed for starter homes, shops, and off-grid rooms.',NULL,'home-solar-system-1-5kw',1,'in_stock'),
(2,'3.0KW Home Solar System','Entry Entelechy-style home solar package for small houses, shops, classrooms, and backup power with panels, inverter, LiFePO4 storage, mounting, cabling, and connectors.',NULL,'home-solar-system-3kw',1,'in_stock'),
(3,'6.2KW Home Solar System','Mid-size household and small business kit aligned to the 6.2KW home solar system family for refrigeration, lighting, entertainment, fans, and moderate appliance loads.',NULL,'home-solar-system-6kw',1,'in_stock'),
(4,'6.2KW-10KW Home Solar System','Large residential and light commercial solar system aligned to Entelechy-style 6.2KW-10KW capacity bands with higher inverter capacity and scalable battery storage.',NULL,'home-solar-system-10kw',1,'in_stock'),
(5,'20KW-30KW Home Solar System','Large villa, estate, office, or compound solar system aligned to Entelechy-style 20KW-30KW home solar system packaging.',NULL,'home-solar-system-20kw',0,'in_stock'),
(6,'30KW Home and Facility Solar System','High-capacity solar system for compounds, facilities, farms, and offices with three-phase inverter capability and larger PV array sizing.',NULL,'home-solar-system-30kw',0,'in_stock'),
(24,'3KW-8KW US Standard Dual Output Solar System','US standard dual-output residential solar system family for split load planning, backup circuits, and medium home energy independence.',NULL,'us-standard-dual-output-solar-system-3-8kw',0,'in_stock'),
(25,'10KW-20KW US Standard Split-Phase Solar System','US standard split-phase solar system family for higher residential and light commercial requirements with larger PV input and lithium battery storage.',NULL,'us-standard-split-phase-solar-system-10-20kw',0,'in_stock'),
(7,'30KW-50KW Commercial Solar System','Commercial solar kit for shops, offices, hotels, clinics, schools, warehouses, and small factories.',NULL,'commercial-solar-system-30-50kw',1,'in_stock'),
(8,'60KW-100KW Commercial Solar System','Higher-capacity commercial solar kit for factories, malls, hotels, schools, and business facilities needing stronger energy cost control.',NULL,'commercial-solar-system-60-100kw',1,'in_stock'),
(9,'120KW-180KW Industrial Solar System','Industrial solar package for warehouses, manufacturing, production sites, and high-consumption facilities.',NULL,'industrial-solar-system-120-180kw',0,'in_stock'),
(10,'250KW-500KW Industrial Solar System','Project-scale solar and storage solution for industrial parks, large factories, logistics bases, and high-demand commercial sites.',NULL,'industrial-solar-system-250-500kw',0,'in_stock'),
(11,'500KW Container Solar System','Containerized solar and storage solution for industrial power, microgrids, EV charging depots, and remote infrastructure.',NULL,'container-solar-system-500kw',0,'in_stock'),
(12,'1MW Container Solar System','Large-scale containerized PV plus ESS solution for industrial sites, charging depots, and utility support projects.',NULL,'container-solar-system-1000kw',0,'in_stock'),
(13,'100kWh Industrial and Commercial ESS Kit','Battery energy storage package for backup, peak shaving, solar self-consumption, and commercial energy stability.',NULL,'ic-ess-100kwh',1,'in_stock'),
(14,'200kWh Industrial and Commercial ESS Kit','Expanded ESS package for factories, hotels, campuses, telecom, and commercial facilities requiring longer runtime.',NULL,'ic-ess-200kwh',0,'in_stock'),
(15,'500kWh Industrial and Commercial ESS Kit','High-capacity ESS solution for larger facilities, microgrids, EV charging stations, and PV storage projects.',NULL,'ic-ess-500kwh',0,'in_stock'),
(16,'1500W Solar Power Generator Kit','Portable solar power generator kit for emergency backup, outdoor work, camping, small shops, and mobile power.',NULL,'solar-generator-1500w',1,'in_stock'),
(17,'3000W Solar Power Generator Kit','Portable and semi-mobile solar power generator package for stronger backup, field teams, and small business use.',NULL,'solar-generator-3000w',1,'in_stock'),
(18,'6200W Solar Power Generator Kit','High-output solar power generator kit for remote sites, resilient household loads, and field operations.',NULL,'solar-generator-6200w',0,'in_stock'),
(19,'2.5KWh-17KWh Powerwall Battery Kit','Wall-mounted LiFePO4 powerwall battery family paired with compatible hybrid inverter options for residential solar backup.',NULL,'powerwall-battery-kit',0,'in_stock'),
(20,'Rack Mounted Battery Kit','Rack-mounted LiFePO4 battery package for telecom, server room, commercial backup, and modular solar storage.',NULL,'rack-battery-kit',0,'in_stock'),
(26,'High Voltage Rack Battery Kit','High-voltage rack battery system for three-phase solar storage and larger commercial energy projects.',NULL,'high-voltage-rack-battery-kit',0,'in_stock'),
(21,'Solar Light and Fan Home Kit','Integrated home kit with solar panel, rechargeable battery, LED lighting, solar fan, and mobile charging for daily off-grid use.',NULL,'solar-light-fan-home-kit',1,'in_stock'),
(22,'Agri Solar Kit','Solar kit for farms, irrigation support, borehole sites, livestock operations, rural lighting, and agricultural productivity.',NULL,'agri-solar',1,'in_stock'),
(23,'Solar EV Station Kit','PV plus ESS plus EV charging station kit for commercial parking, fleet yards, logistics bases, and clean transport projects.',NULL,'solar-ev-station',1,'in_stock');

INSERT INTO `KitProducts` (`kit_id`,`product_id`,`quantity`,`sort_order`) VALUES
(1,101,5,1),(1,201,1,2),(1,301,1,3),(1,501,1,4),(1,503,2,5),(1,505,1,6),
(2,101,10,1),(2,201,1,2),(2,302,1,3),(2,501,1,4),(2,504,1,5),(2,505,1,6),
(3,103,12,1),(3,203,1,2),(3,303,1,3),(3,501,2,4),(3,504,1,5),(3,506,1,6),(3,1802,1,7),
(4,103,18,1),(4,205,1,2),(4,304,1,3),(4,501,2,4),(4,504,1,5),(4,506,1,6),(4,1803,1,7),
(5,103,36,1),(5,208,1,2),(5,305,2,3),(5,502,3,4),(5,506,2,5),(5,1804,1,6),
(6,103,55,1),(6,209,1,2),(6,305,3,3),(6,502,4,4),(6,506,3,5),(6,1804,1,6),
(7,103,90,1),(7,209,1,2),(7,311,1,3),(7,1701,1,4),(7,1804,1,5),(7,506,4,6),
(8,103,182,1),(8,1304,1,2),(8,1701,1,3),(8,1805,1,4),(8,506,8,5),
(9,104,327,1),(9,1305,1,2),(9,1701,1,3),(9,1805,2,4),(9,506,12,5),
(10,104,860,1),(10,1306,1,2),(10,1701,1,3),(10,1805,4,4),(10,506,30,5),
(11,104,860,1),(11,1306,1,2),(11,1701,1,3),(11,1805,4,4),
(12,104,1720,1),(12,1306,2,2),(12,1701,1,3),(12,1805,8,4),
(13,312,1,1),(13,207,1,2),(13,1701,1,3),
(14,313,1,1),(14,209,1,2),(14,1701,1,3),
(15,1306,1,1),(15,1403,1,2),(15,1701,1,3),
(16,2001,1,1),(16,106,4,2),(16,501,1,3),
(17,2002,1,1),(17,101,10,2),(17,504,1,3),
(18,2003,1,1),(18,103,12,2),(18,504,1,3),
(19,306,1,1),(19,307,1,2),(19,204,1,3),
(20,308,1,1),(20,309,1,2),(20,207,1,3),
(21,1201,1,1),(21,1202,1,2),(21,1102,1,3),(21,1001,2,4),
(22,103,20,1),(22,206,1,2),(22,309,1,3),(22,1902,1,4),(22,702,2,5),(22,501,2,6),
(23,104,180,1),(23,1306,1,2),(23,1403,1,3),(23,1601,1,4),(23,1701,1,5),
(24,103,12,1),(24,203,1,2),(24,303,1,3),(24,506,1,4),(24,1802,1,5),
(25,103,36,1),(25,208,1,2),(25,310,1,3),(25,506,2,4),(25,1804,1,5),
(26,311,1,1),(26,312,1,2),(26,313,1,3),(26,207,1,4),(26,1701,1,5);

ALTER TABLE `Categories` AUTO_INCREMENT=22;
ALTER TABLE `Products` AUTO_INCREMENT=2004;
ALTER TABLE `Kits` AUTO_INCREMENT=27;
ALTER TABLE `KitProducts` AUTO_INCREMENT=141;

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET SQL_MODE=@OLD_SQL_MODE;
