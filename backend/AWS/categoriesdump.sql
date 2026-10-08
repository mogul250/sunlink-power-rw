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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES (1,'Solar Panels','High-efficiency photovoltaic modules for residential, commercial, industrial, and utility-scale solar systems.',NULL,'solar-panels','2026-06-25 21:18:39','2026-06-25 21:18:39'),(2,'Inverters','Off-grid, hybrid, single-phase, and three-phase solar inverters for reliable power conversion and storage integration.','/uploads/categories/8f1dd68d-cf5f-43c4-aa8a-badd879ac182-1782462573550-831151423.png','inverters','2026-06-25 21:18:39','2026-06-26 08:29:33'),(3,'Batteries','LiFePO4 energy storage batteries including wall-mounted, rack-mounted, stackable, and high-voltage cabinet systems.','/uploads/categories/9bd50c3b-0c14-4ef0-b70f-d7549eee8646-1782458822937-895406616.png','batteries','2026-06-25 21:18:39','2026-06-26 07:27:02'),(4,'Charge Controllers','PWM and MPPT solar charge controllers for battery charging, PV input optimization, and system protection.','/uploads/categories/7c68926c-0390-4473-8331-9f4b37d8cf6b-1782459264074-557368368.png','charge-controllers','2026-06-25 21:18:39','2026-06-26 07:34:24'),(5,'Accessories','Solar cables, MC4 connectors, mounting brackets, rails, fasteners, and installation accessories.','/uploads/categories/a0056e39-f509-46b3-a98a-9b32adb7838e-1782457791288-269630513.png','accessories','2026-06-25 21:18:39','2026-06-26 07:09:51'),(6,'Solar Lights','Solar lighting products for roads, public spaces, compounds, landscapes, indoor use, and off-grid applications.',NULL,'solar-lights','2026-06-25 21:18:39','2026-06-25 21:18:39'),(7,'Solar Street Lights','Integrated solar street lights with mono solar panels, LiFePO4 batteries, LED modules, radar sensors, and optional camera features.',NULL,'solar-street-lights','2026-06-25 21:18:39','2026-06-25 21:18:39'),(8,'Solar Flood Lights','Outdoor solar flood lights for yards, farms, warehouses, compounds, playgrounds, parking areas, and security lighting.','/uploads/categories/7397b339-bee1-47b7-af75-23bac0780f57-1782463526620-508033205.png','solar-flood-lights','2026-06-25 21:18:39','2026-06-26 08:45:26'),(9,'Solar Garden Lights','Decorative and functional solar lawn, garden, pathway, and landscape lighting products.','/uploads/categories/0864bf6b-a595-4978-9117-5588ad88bdee-1782463819595-276285538.png','solar-garden-lights','2026-06-25 21:18:39','2026-06-26 08:50:19'),(10,'Solar Strip Lights','Flexible solar strip lighting for outdoor decoration, signage, paths, and low-voltage solar lighting applications.',NULL,'solar-strip-lights','2026-06-25 21:18:39','2026-06-25 21:18:39'),(11,'Solar Batten Lights','Solar-powered batten tube lights for rooms, shops, corridors, field offices, and spaces without reliable grid electricity.','/uploads/categories/e2d6a633-15a8-4960-8e43-f7f94f492e2b-1782463007852-241582474.png','solar-batten-lights','2026-06-25 21:18:39','2026-06-26 08:36:47'),(12,'Solar Fans','Portable rechargeable solar fans for homes, clinics, shops, schools, and off-grid comfort applications.','/uploads/categories/2e3b5d5d-04d0-4be2-bd1b-37a132838aa1-1782463187780-840516239.png','solar-fans','2026-06-25 21:18:39','2026-06-26 08:39:47'),(13,'Solar Light and Fan Packages','Integrated solar kits combining lighting, fan cooling, battery storage, mobile charging, and solar input for daily use.',NULL,'solar-light-and-fan-packages','2026-06-25 21:18:39','2026-06-25 21:18:39'),(14,'Energy Storage Systems','Residential, commercial, industrial, containerized, and PV plus ESS plus EV charging energy storage solutions.','/uploads/categories/36a43aa9-9e61-496b-af65-7ae504be6593-1782460471547-704973606.png','energy-storage-systems','2026-06-25 21:18:39','2026-06-26 07:54:31'),(15,'EV Chargers','EV charging systems and PV plus ESS plus EVSE solutions for fleet yards, public charging, and commercial parking.','/uploads/categories/99f50865-55f9-4de5-b92a-6d0c98aecdfd-1782460920736-261520278.png','ev-chargers','2026-06-25 21:18:39','2026-06-26 08:02:00'),(16,'UPS Systems','Industrial uninterruptible power supply systems for critical backup and stable pure sine wave output.','/uploads/categories/43154830-7605-40ea-a396-e19a9061c651-1782464383709-772856481.png','ups-systems','2026-06-25 21:18:39','2026-06-26 08:59:43'),(17,'BIPV Carports','Solar carport structures integrating vehicle shelter, PV generation, and optional EV charging deployment.','/uploads/categories/99eda8ca-f32a-4ec1-9334-72c8949fd3a9-1782459101635-828876549.png','bipv-carports','2026-06-25 21:18:39','2026-06-26 07:31:41'),(18,'Energy Management Systems','EMS software and controller platforms for monitoring, dispatching, and coordinating PV, ESS, load, grid, and EV charging.','/uploads/categories/711598ea-6d18-4a15-8766-f992982741be-1782459931376-582307577.png','energy-management-systems','2026-06-25 21:18:39','2026-06-26 07:45:31'),(19,'Combiner Boxes','PV combiner boxes for DC string protection, surge protection, isolation, and organized inverter input wiring.','/uploads/categories/ac4573c0-1029-4d1c-8d13-8f0029a6163c-1782459594776-105776579.png','combiner-boxes','2026-06-25 21:18:39','2026-06-26 07:39:54'),(20,'Solar Water Pumps','Solar water pump systems for agriculture, irrigation, boreholes, livestock, and rural water supply.','/uploads/categories/2e98cf05-798c-471e-8bf4-ededc428a95b-1782464231321-822155899.png','solar-water-pumps','2026-06-25 21:18:39','2026-06-26 08:57:11'),(21,'Solar Generators','Portable and semi-mobile solar generator systems for emergency backup, outdoor work, and remote power.','/uploads/categories/8dee2195-54c5-4718-b6ec-8ac92db38d4c-1782464072829-98696335.png','solar-generators','2026-06-25 21:18:39','2026-06-26 08:54:32');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-26 11:27:41
