-- Sunlink Power kit seed dump inspired by Entelechy solar kit families.
-- Source reference checked on 2026-06-25:
-- - Home Solar System examples: 1.5KW, 3.0KW, 6.2KW-10KW, 20KW-30KW, US standard systems.
-- - Industrial and Commercial examples: 30KW-50KW, 60KW-100KW, 120KW-180KW, 250KW-500KW, container systems, 100kWh-500kWh systems.
-- - Solar Generator examples: 1500W, 3000W, 6200W.
--
-- This file does not alter Products or Categories. It rebuilds only the kit rows listed below
-- and maps them to existing product IDs from backend/AWS/backup.sql.

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS=0;

START TRANSACTION;

DELETE kp
FROM KitProducts kp
JOIN Kits k ON k.id = kp.kit_id
WHERE k.slug IN (
  'home-solar-system-1-5kw',
  'home-solar-system-3kw',
  'home-solar-system-6kw',
  'home-solar-system-10kw',
  'home-solar-system-20kw',
  'home-solar-system-30kw',
  'us-standard-dual-output-solar-system-3-8kw',
  'us-standard-split-phase-solar-system-10-20kw',
  'commercial-solar-system-30-50kw',
  'commercial-solar-system-60-100kw',
  'industrial-solar-system-120-180kw',
  'industrial-solar-system-250-500kw',
  'container-solar-system-500kw',
  'container-solar-system-1000kw',
  'ic-ess-100kwh',
  'ic-ess-200kwh',
  'ic-ess-500kwh',
  'solar-generator-1500w',
  'solar-generator-3000w',
  'solar-generator-6200w',
  'powerwall-battery-kit',
  'rack-battery-kit',
  'high-voltage-rack-battery-kit',
  'agri-solar',
  'solar-ev-station'
);

INSERT INTO Kits (name, description, image_url, slug, is_featured, stock_status) VALUES
('1.5kW Home Solar System', 'Compact residential solar kit for lights, fans, phone charging, router backup, and small daily loads. Based on Entelechy-style 1.5KW home solar system packaging and mapped to Sunlink panels, inverter, battery, cabling, and brackets.', NULL, 'home-solar-system-1-5kw', 1, 'in_stock'),
('3kW Home Solar System', 'Entry home solar package for small houses, shops, classrooms, and backup power. Includes panels, hybrid inverter, lithium storage, mounting, cabling, and connector accessories.', NULL, 'home-solar-system-3kw', 1, 'in_stock'),
('6kW Home Solar System', 'Mid-size household and small business kit for daily solar backup, refrigeration, lighting, entertainment, fans, and moderate appliance loads.', NULL, 'home-solar-system-6kw', 1, 'in_stock'),
('10kW Home Solar System', 'Large residential and small commercial solar system with higher inverter capacity and scalable battery storage for stronger backup coverage.', NULL, 'home-solar-system-10kw', 1, 'in_stock'),
('20kW Home Solar System', 'Large villa, estate, office, or small facility solar system designed around high-power hybrid inverter capacity, multiple batteries, PV protection, and mounting accessories.', NULL, 'home-solar-system-20kw', 0, 'in_stock'),
('30kW Home Solar System', 'High-capacity home, office, or compound power kit for heavy loads and longer backup runtime using three-phase inverter capacity and expanded storage.', NULL, 'home-solar-system-30kw', 0, 'in_stock'),
('3kW-8kW US Standard Dual Output Solar System', 'US-style residential solar system family for split load planning, backup circuits, and medium home energy independence.', NULL, 'us-standard-dual-output-solar-system-3-8kw', 0, 'in_stock'),
('10kW-20kW US Standard Split-Phase Solar System', 'Split-phase solar kit family for higher residential and light commercial requirements with larger PV input and lithium battery storage.', NULL, 'us-standard-split-phase-solar-system-10-20kw', 0, 'in_stock'),
('30kW-50kW Commercial Solar System', 'Commercial solar kit for shops, offices, hotels, warehouses, clinics, and small factories. Combines high-power hybrid inverters, panels, storage, protection, and EMS-ready components.', NULL, 'commercial-solar-system-30-50kw', 1, 'in_stock'),
('60kW-100kW Commercial Solar System', 'Higher-capacity commercial solar kit for factories, malls, hotels, schools, and larger business facilities needing solar generation and storage coordination.', NULL, 'commercial-solar-system-60-100kw', 1, 'in_stock'),
('120kW-180kW Industrial Solar System', 'Industrial solar package for factories, warehouses, and production sites requiring larger PV arrays, energy storage cabinets, protection, and management controls.', NULL, 'industrial-solar-system-120-180kw', 0, 'in_stock'),
('250kW-500kW Industrial and Commercial Solar System', 'Project-scale industrial and commercial solar system for large facilities and energy-saving projects using containerized ESS, EMS, PV protection, and high-volume PV generation.', NULL, 'industrial-solar-system-250-500kw', 0, 'in_stock'),
('500kW Container Solar System', 'Containerized industrial solar solution based on a 500kW class project layout with PV generation, container ESS, EMS, combiner protection, and optional EV charging integration.', NULL, 'container-solar-system-500kw', 0, 'in_stock'),
('1000kW Container Solar System', 'Large 1MW containerized solar and storage project kit for industrial parks, microgrids, charging depots, and utility support applications.', NULL, 'container-solar-system-1000kw', 0, 'in_stock'),
('100kWh Industrial and Commercial ESS Kit', 'Battery energy storage package for peak shaving, backup, and solar self-consumption in commercial and industrial sites.', NULL, 'ic-ess-100kwh', 1, 'in_stock'),
('200kWh Industrial and Commercial ESS Kit', 'Expanded commercial ESS package for factories, hotels, campuses, telecom, and facilities needing stronger backup and energy cost control.', NULL, 'ic-ess-200kwh', 0, 'in_stock'),
('500kWh Industrial and Commercial ESS Kit', 'High-capacity ESS solution for larger facilities, microgrids, charging stations, and PV plus storage projects.', NULL, 'ic-ess-500kwh', 0, 'in_stock'),
('1500W Solar Power Generator Kit', 'Portable solar generator style kit for emergency backup, outdoor work, camping, small shops, and mobile power needs.', NULL, 'solar-generator-1500w', 1, 'in_stock'),
('3000W Solar Power Generator Kit', 'Portable and semi-mobile solar generator package with larger PV input and LiFePO4 storage for stronger backup applications.', NULL, 'solar-generator-3000w', 0, 'in_stock'),
('6200W Solar Power Generator Kit', 'High-output solar generator style kit for field teams, small business backup, remote sites, and resilient household loads.', NULL, 'solar-generator-6200w', 0, 'in_stock'),
('Powerwall Battery Kit', 'Wall-mounted LiFePO4 battery kit for residential and light commercial backup systems, paired with compatible hybrid inverter options.', NULL, 'powerwall-battery-kit', 0, 'in_stock'),
('Rack Battery Kit', 'Rack-mounted LiFePO4 battery package for telecom, server room, commercial backup, and modular solar storage applications.', NULL, 'rack-battery-kit', 0, 'in_stock'),
('High Voltage Rack Battery Kit', 'High-voltage rack battery system for three-phase solar storage and larger commercial energy projects.', NULL, 'high-voltage-rack-battery-kit', 0, 'in_stock'),
('Agri Solar Kit', 'Solar kit for farm power, irrigation support, borehole sites, livestock operations, lighting, and rural agricultural productivity.', NULL, 'agri-solar', 1, 'in_stock'),
('Solar EV Station Kit', 'PV plus ESS plus EV charging station kit for commercial parking, fleet yards, logistics bases, and clean transport projects.', NULL, 'solar-ev-station', 1, 'in_stock')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  image_url = VALUES(image_url),
  is_featured = VALUES(is_featured),
  stock_status = VALUES(stock_status),
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO KitProducts (kit_id, product_id, quantity, sort_order)
SELECT k.id, v.product_id, v.quantity, v.sort_order
FROM Kits k
JOIN (
  SELECT 'home-solar-system-1-5kw' slug, 26 product_id, 5 quantity, 1 sort_order UNION ALL
  SELECT 'home-solar-system-1-5kw', 28, 1, 2 UNION ALL
  SELECT 'home-solar-system-1-5kw', 32, 1, 3 UNION ALL
  SELECT 'home-solar-system-1-5kw', 37, 1, 4 UNION ALL
  SELECT 'home-solar-system-1-5kw', 39, 1, 5 UNION ALL
  SELECT 'home-solar-system-1-5kw', 40, 1, 6 UNION ALL

  SELECT 'home-solar-system-3kw', 26, 10, 1 UNION ALL
  SELECT 'home-solar-system-3kw', 28, 1, 2 UNION ALL
  SELECT 'home-solar-system-3kw', 33, 1, 3 UNION ALL
  SELECT 'home-solar-system-3kw', 38, 1, 4 UNION ALL
  SELECT 'home-solar-system-3kw', 39, 1, 5 UNION ALL
  SELECT 'home-solar-system-3kw', 41, 1, 6 UNION ALL

  SELECT 'home-solar-system-6kw', 27, 12, 1 UNION ALL
  SELECT 'home-solar-system-6kw', 172, 1, 2 UNION ALL
  SELECT 'home-solar-system-6kw', 34, 1, 3 UNION ALL
  SELECT 'home-solar-system-6kw', 38, 1, 4 UNION ALL
  SELECT 'home-solar-system-6kw', 39, 1, 5 UNION ALL
  SELECT 'home-solar-system-6kw', 42, 1, 6 UNION ALL

  SELECT 'home-solar-system-10kw', 27, 18, 1 UNION ALL
  SELECT 'home-solar-system-10kw', 181, 1, 2 UNION ALL
  SELECT 'home-solar-system-10kw', 35, 1, 3 UNION ALL
  SELECT 'home-solar-system-10kw', 38, 2, 4 UNION ALL
  SELECT 'home-solar-system-10kw', 39, 1, 5 UNION ALL
  SELECT 'home-solar-system-10kw', 42, 1, 6 UNION ALL
  SELECT 'home-solar-system-10kw', 223, 1, 7 UNION ALL

  SELECT 'home-solar-system-20kw', 27, 36, 1 UNION ALL
  SELECT 'home-solar-system-20kw', 183, 1, 2 UNION ALL
  SELECT 'home-solar-system-20kw', 36, 2, 3 UNION ALL
  SELECT 'home-solar-system-20kw', 38, 3, 4 UNION ALL
  SELECT 'home-solar-system-20kw', 43, 1, 5 UNION ALL
  SELECT 'home-solar-system-20kw', 225, 1, 6 UNION ALL

  SELECT 'home-solar-system-30kw', 27, 55, 1 UNION ALL
  SELECT 'home-solar-system-30kw', 186, 1, 2 UNION ALL
  SELECT 'home-solar-system-30kw', 36, 3, 3 UNION ALL
  SELECT 'home-solar-system-30kw', 38, 4, 4 UNION ALL
  SELECT 'home-solar-system-30kw', 44, 1, 5 UNION ALL
  SELECT 'home-solar-system-30kw', 227, 1, 6 UNION ALL

  SELECT 'us-standard-dual-output-solar-system-3-8kw', 27, 12, 1 UNION ALL
  SELECT 'us-standard-dual-output-solar-system-3-8kw', 30, 1, 2 UNION ALL
  SELECT 'us-standard-dual-output-solar-system-3-8kw', 34, 1, 3 UNION ALL
  SELECT 'us-standard-dual-output-solar-system-3-8kw', 42, 1, 4 UNION ALL
  SELECT 'us-standard-dual-output-solar-system-3-8kw', 223, 1, 5 UNION ALL

  SELECT 'us-standard-split-phase-solar-system-10-20kw', 27, 36, 1 UNION ALL
  SELECT 'us-standard-split-phase-solar-system-10-20kw', 183, 1, 2 UNION ALL
  SELECT 'us-standard-split-phase-solar-system-10-20kw', 168, 1, 3 UNION ALL
  SELECT 'us-standard-split-phase-solar-system-10-20kw', 43, 1, 4 UNION ALL
  SELECT 'us-standard-split-phase-solar-system-10-20kw', 225, 1, 5 UNION ALL

  SELECT 'commercial-solar-system-30-50kw', 27, 90, 1 UNION ALL
  SELECT 'commercial-solar-system-30-50kw', 186, 1, 2 UNION ALL
  SELECT 'commercial-solar-system-30-50kw', 203, 1, 3 UNION ALL
  SELECT 'commercial-solar-system-30-50kw', 211, 1, 4 UNION ALL
  SELECT 'commercial-solar-system-30-50kw', 228, 1, 5 UNION ALL

  SELECT 'commercial-solar-system-60-100kw', 27, 182, 1 UNION ALL
  SELECT 'commercial-solar-system-60-100kw', 187, 1, 2 UNION ALL
  SELECT 'commercial-solar-system-60-100kw', 211, 1, 3 UNION ALL
  SELECT 'commercial-solar-system-60-100kw', 229, 1, 4 UNION ALL

  SELECT 'industrial-solar-system-120-180kw', 27, 327, 1 UNION ALL
  SELECT 'industrial-solar-system-120-180kw', 188, 1, 2 UNION ALL
  SELECT 'industrial-solar-system-120-180kw', 211, 1, 3 UNION ALL
  SELECT 'industrial-solar-system-120-180kw', 230, 1, 4 UNION ALL

  SELECT 'industrial-solar-system-250-500kw', 27, 910, 1 UNION ALL
  SELECT 'industrial-solar-system-250-500kw', 189, 1, 2 UNION ALL
  SELECT 'industrial-solar-system-250-500kw', 211, 1, 3 UNION ALL
  SELECT 'industrial-solar-system-250-500kw', 230, 2, 4 UNION ALL

  SELECT 'container-solar-system-500kw', 27, 910, 1 UNION ALL
  SELECT 'container-solar-system-500kw', 189, 1, 2 UNION ALL
  SELECT 'container-solar-system-500kw', 211, 1, 3 UNION ALL
  SELECT 'container-solar-system-500kw', 230, 2, 4 UNION ALL

  SELECT 'container-solar-system-1000kw', 27, 1818, 1 UNION ALL
  SELECT 'container-solar-system-1000kw', 189, 2, 2 UNION ALL
  SELECT 'container-solar-system-1000kw', 211, 1, 3 UNION ALL
  SELECT 'container-solar-system-1000kw', 230, 4, 4 UNION ALL

  SELECT 'ic-ess-100kwh', 204, 1, 1 UNION ALL
  SELECT 'ic-ess-100kwh', 182, 1, 2 UNION ALL
  SELECT 'ic-ess-100kwh', 211, 1, 3 UNION ALL

  SELECT 'ic-ess-200kwh', 208, 1, 1 UNION ALL
  SELECT 'ic-ess-200kwh', 186, 1, 2 UNION ALL
  SELECT 'ic-ess-200kwh', 211, 1, 3 UNION ALL

  SELECT 'ic-ess-500kwh', 189, 1, 1 UNION ALL
  SELECT 'ic-ess-500kwh', 209, 1, 2 UNION ALL
  SELECT 'ic-ess-500kwh', 211, 1, 3 UNION ALL

  SELECT 'solar-generator-1500w', 26, 5, 1 UNION ALL
  SELECT 'solar-generator-1500w', 170, 1, 2 UNION ALL
  SELECT 'solar-generator-1500w', 160, 1, 3 UNION ALL
  SELECT 'solar-generator-1500w', 37, 1, 4 UNION ALL

  SELECT 'solar-generator-3000w', 26, 10, 1 UNION ALL
  SELECT 'solar-generator-3000w', 170, 1, 2 UNION ALL
  SELECT 'solar-generator-3000w', 32, 1, 3 UNION ALL
  SELECT 'solar-generator-3000w', 39, 1, 4 UNION ALL

  SELECT 'solar-generator-6200w', 27, 12, 1 UNION ALL
  SELECT 'solar-generator-6200w', 172, 1, 2 UNION ALL
  SELECT 'solar-generator-6200w', 161, 1, 3 UNION ALL
  SELECT 'solar-generator-6200w', 38, 1, 4 UNION ALL

  SELECT 'powerwall-battery-kit', 156, 1, 1 UNION ALL
  SELECT 'powerwall-battery-kit', 157, 1, 2 UNION ALL
  SELECT 'powerwall-battery-kit', 158, 1, 3 UNION ALL
  SELECT 'powerwall-battery-kit', 159, 1, 4 UNION ALL
  SELECT 'powerwall-battery-kit', 176, 1, 5 UNION ALL

  SELECT 'rack-battery-kit', 151, 1, 1 UNION ALL
  SELECT 'rack-battery-kit', 152, 1, 2 UNION ALL
  SELECT 'rack-battery-kit', 153, 1, 3 UNION ALL
  SELECT 'rack-battery-kit', 154, 1, 4 UNION ALL
  SELECT 'rack-battery-kit', 155, 1, 5 UNION ALL
  SELECT 'rack-battery-kit', 178, 1, 6 UNION ALL

  SELECT 'high-voltage-rack-battery-kit', 197, 1, 1 UNION ALL
  SELECT 'high-voltage-rack-battery-kit', 198, 1, 2 UNION ALL
  SELECT 'high-voltage-rack-battery-kit', 199, 1, 3 UNION ALL
  SELECT 'high-voltage-rack-battery-kit', 200, 1, 4 UNION ALL
  SELECT 'high-voltage-rack-battery-kit', 201, 1, 5 UNION ALL
  SELECT 'high-voltage-rack-battery-kit', 202, 1, 6 UNION ALL
  SELECT 'high-voltage-rack-battery-kit', 203, 1, 7 UNION ALL

  SELECT 'agri-solar', 27, 20, 1 UNION ALL
  SELECT 'agri-solar', 174, 1, 2 UNION ALL
  SELECT 'agri-solar', 155, 1, 3 UNION ALL
  SELECT 'agri-solar', 221, 1, 4 UNION ALL
  SELECT 'agri-solar', 98, 2, 5 UNION ALL
  SELECT 'agri-solar', 38, 2, 6 UNION ALL

  SELECT 'solar-ev-station', 27, 180, 1 UNION ALL
  SELECT 'solar-ev-station', 189, 1, 2 UNION ALL
  SELECT 'solar-ev-station', 209, 1, 3 UNION ALL
  SELECT 'solar-ev-station', 210, 1, 4 UNION ALL
  SELECT 'solar-ev-station', 211, 1, 5
) v ON k.slug = v.slug
ON DUPLICATE KEY UPDATE
  quantity = VALUES(quantity),
  sort_order = VALUES(sort_order);

COMMIT;

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
