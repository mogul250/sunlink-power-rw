-- ============================================
-- 2. Insert Sample Products
-- ============================================

-- Solar Panels
INSERT INTO Products (category_id, name, price, description, wattage, durability_rating, battery_type, warranty_info, image_url, manual_pdf_url, metadata, is_featured, stock_status) VALUES
(1, 'Sunlink Mono 550W Solar Panel', 285.00, 'Premium monocrystalline solar panel with 21.5% efficiency. Perfect for residential and commercial installations. Features anti-reflective coating and robust aluminum frame.', '550W', '25 Years', 'N/A', '25-year performance warranty, 12-year product warranty', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800', '/manuals/mono-550w.pdf', 
'{"panel_type": "Monocrystalline", "efficiency": "21.5%", "dimensions": "2278x1134x35mm", "weight": "28.6kg", "max_power_voltage": "41.7V", "max_power_current": "13.19A", "open_circuit_voltage": "49.5V", "short_circuit_current": "13.95A", "temperature_coefficient": "-0.34%/°C", "certifications": ["CE", "TUV", "ISO9001", "IEC61215"]}', 
TRUE, 'in_stock'),

(1, 'Sunlink Poly 450W Solar Panel', 195.00, 'Cost-effective polycrystalline panel ideal for large-scale installations. Excellent performance in high-temperature environments.', '450W', '25 Years', 'N/A', '25-year performance warranty, 10-year product warranty', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', '/manuals/poly-450w.pdf',
'{"panel_type": "Polycrystalline", "efficiency": "18.2%", "dimensions": "2015x1002x40mm", "weight": "24.5kg", "max_power_voltage": "38.2V", "max_power_current": "11.78A", "open_circuit_voltage": "46.1V", "short_circuit_current": "12.45A", "temperature_coefficient": "-0.41%/°C", "certifications": ["CE", "TUV", "ISO9001"]}',
TRUE, 'in_stock'),

(1, 'Sunlink Bifacial 600W Solar Panel', 425.00, 'Advanced bifacial technology captures sunlight from both sides, increasing energy yield by up to 30%. Premium choice for maximum efficiency.', '600W', '30 Years', 'N/A', '30-year performance warranty, 15-year product warranty', 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800', '/manuals/bifacial-600w.pdf',
'{"panel_type": "Bifacial Monocrystalline", "efficiency": "22.8%", "dimensions": "2384x1303x35mm", "weight": "33.2kg", "max_power_voltage": "44.8V", "max_power_current": "13.39A", "open_circuit_voltage": "53.2V", "short_circuit_current": "14.15A", "temperature_coefficient": "-0.29%/°C", "bifacial_factor": "70%", "certifications": ["CE", "TUV", "ISO9001", "IEC61215", "IEC61730"]}',
TRUE, 'in_stock');

-- Inverters
INSERT INTO Products (category_id, name, price, description, wattage, durability_rating, battery_type, warranty_info, image_url, manual_pdf_url, metadata, is_featured, stock_status) VALUES
(2, 'Sunlink Pure Sine 5000W Inverter', 580.00, 'High-quality pure sine wave inverter with 5000W continuous power. Perfect for sensitive electronics and appliances. Built-in LCD display and multiple protection features.', '5000W', '10 Years', 'Compatible with all battery types', '5-year warranty, extendable to 10 years', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800', '/manuals/inverter-5000w.pdf',
'{"output_power": "5000W continuous, 10000W surge", "input_voltage": "48V DC", "output_voltage": "230V AC", "frequency": "50Hz/60Hz", "efficiency": "93%", "waveform": "Pure Sine Wave", "display": "LCD", "protections": ["Over-voltage", "Under-voltage", "Overload", "Short-circuit", "Over-temperature"], "certifications": ["CE", "RoHS"]}',
TRUE, 'in_stock'),

(2, 'Sunlink Hybrid 8000W Inverter', 1250.00, 'Advanced hybrid inverter with grid-tie capability. Seamlessly switches between solar, battery, and grid power. MPPT charge controller included.', '8000W', '10 Years', 'Lithium/Lead-acid compatible', '5-year warranty', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', '/manuals/hybrid-8000w.pdf',
'{"output_power": "8000W continuous, 16000W surge", "input_voltage": "48V DC", "output_voltage": "230V AC", "mppt_voltage_range": "120-450V", "max_pv_input": "10000W", "efficiency": "97.6%", "battery_type": "Lithium/Lead-acid", "grid_tie": true, "certifications": ["CE", "TUV", "VDE"]}',
TRUE, 'in_stock');

-- Batteries
INSERT INTO Products (category_id, name, price, description, wattage, durability_rating, battery_type, warranty_info, image_url, manual_pdf_url, metadata, is_featured, stock_status) VALUES
(3, 'Sunlink LiFePO4 200Ah Battery', 890.00, 'Premium lithium iron phosphate battery with 6000+ cycle life. Built-in BMS for safety and longevity. Lightweight and maintenance-free.', '12.8V 200Ah (2560Wh)', '10 Years', 'LiFePO4 Lithium', '10-year warranty, 6000 cycles', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800', '/manuals/lifepo4-200ah.pdf',
'{"voltage": "12.8V", "capacity": "200Ah", "energy": "2560Wh", "cycle_life": "6000+ cycles at 80% DOD", "weight": "22kg", "dimensions": "522x240x218mm", "charge_voltage": "14.6V", "discharge_cutoff": "10V", "max_charge_current": "100A", "max_discharge_current": "100A continuous, 200A peak", "bms": "Built-in 100A", "certifications": ["CE", "UN38.3", "MSDS"]}',
TRUE, 'in_stock'),

(3, 'Sunlink Deep Cycle 250Ah AGM Battery', 385.00, 'Heavy-duty AGM deep cycle battery for reliable energy storage. Sealed maintenance-free design with excellent deep discharge recovery.', '12V 250Ah (3000Wh)', '5 Years', 'AGM Lead-acid', '5-year warranty, 1200 cycles', 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800', '/manuals/agm-250ah.pdf',
'{"voltage": "12V", "capacity": "250Ah", "energy": "3000Wh", "cycle_life": "1200 cycles at 50% DOD", "weight": "68kg", "dimensions": "520x268x220mm", "technology": "AGM (Absorbed Glass Mat)", "self_discharge": "3% per month", "operating_temp": "-20°C to 50°C", "certifications": ["CE", "ISO9001"]}',
FALSE, 'in_stock');

-- Solar Kits
INSERT INTO Products (category_id, name, price, description, wattage, durability_rating, battery_type, warranty_info, image_url, manual_pdf_url, metadata, is_featured, stock_status) VALUES
(4, 'Sunlink Home 3kW Complete Solar Kit', 2850.00, 'Everything you need for a complete home solar installation. Includes 6x550W panels, 5kW inverter, mounting hardware, and all cables.', '3300W', '25 Years', 'Battery not included', 'Component-based warranty', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', '/manuals/home-3kw-kit.pdf',
'{"components": ["6x Sunlink Mono 550W Panels", "1x 5000W Pure Sine Inverter", "1x 60A MPPT Charge Controller", "Mounting Rails & Brackets", "MC4 Cables & Connectors", "Installation Manual"], "total_power": "3300W", "daily_output": "13-16kWh", "suitable_for": "3-4 bedroom home", "installation_time": "1-2 days"}',
TRUE, 'in_stock'),

(4, 'Sunlink Business 10kW Solar System', 8900.00, 'Commercial-grade solar system for small businesses and large homes. High-efficiency components with grid-tie capability.', '10000W', '25 Years', 'Battery optional', 'Component-based warranty', 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800', '/manuals/business-10kw-kit.pdf',
'{"components": ["18x Sunlink Mono 550W Panels", "1x 8000W Hybrid Inverter", "2x 80A MPPT Controllers", "Commercial Mounting System", "All Cables & Protection", "Monitoring System"], "total_power": "9900W", "daily_output": "40-50kWh", "suitable_for": "Small business, large home", "grid_tie": true}',
TRUE, 'in_stock');

-- Charge Controllers
INSERT INTO Products (category_id, name, price, description, wattage, durability_rating, battery_type, warranty_info, image_url, manual_pdf_url, metadata, is_featured, stock_status) VALUES
(5, 'Sunlink MPPT 60A Charge Controller', 185.00, 'Advanced MPPT technology with 98% efficiency. LCD display shows real-time data. Multiple load control modes and comprehensive protection.', '60A (12V/24V/48V)', '5 Years', 'All battery types', '5-year warranty', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', '/manuals/mppt-60a.pdf',
'{"type": "MPPT", "rated_current": "60A", "system_voltage": "12V/24V/48V auto", "max_pv_voltage": "150V", "max_pv_power": "3000W (48V)", "efficiency": "98%", "display": "LCD", "communication": "RS485, USB", "protections": ["Reverse polarity", "Overcharge", "Over-discharge", "Overload", "Short-circuit"], "certifications": ["CE", "RoHS"]}',
FALSE, 'in_stock');

-- Accessories
INSERT INTO Products (category_id, name, price, description, wattage, durability_rating, battery_type, warranty_info, image_url, manual_pdf_url, metadata, is_featured, stock_status) VALUES
(6, 'MC4 Solar Cable Connectors (10 Pairs)', 25.00, 'Premium MC4 connectors for secure solar panel connections. UV-resistant, waterproof IP67 rated. Easy to install.', 'N/A', '10 Years', 'N/A', '2-year warranty', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800', '/manuals/mc4-connectors.pdf',
'{"quantity": "10 pairs (20 pieces)", "rating": "30A, 1000V DC", "ip_rating": "IP67", "temperature_range": "-40°C to +90°C", "cable_size": "2.5-6mm²", "material": "PPO plastic, Copper", "certifications": ["TUV", "CE"]}',
FALSE, 'in_stock'),

(6, 'Solar Panel Mounting Brackets Kit', 120.00, 'Heavy-duty aluminum mounting system for roof or ground installation. Adjustable angle, corrosion-resistant. Suitable for 4-6 panels.', 'N/A', '15 Years', 'N/A', '10-year warranty', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800', '/manuals/mounting-kit.pdf',
'{"material": "Anodized Aluminum", "panel_capacity": "4-6 panels", "max_load": "200kg", "angle_adjustment": "15-45 degrees", "installation_type": "Roof/Ground", "wind_resistance": "Up to 150km/h", "includes": ["Rails", "Clamps", "Bolts", "L-feet", "Installation Guide"]}',
FALSE, 'in_stock');