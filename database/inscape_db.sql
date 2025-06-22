-- Project Inscape Database Schema
-- India-themed travel platform focusing on district-level places

-- Create database
CREATE DATABASE IF NOT EXISTS inscape_db;
USE inscape_db;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS districts;
DROP TABLE IF EXISTS states;

-- Create states table
CREATE TABLE states (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    best_time VARCHAR(100),
    languages JSON,
    cuisine JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create districts table
CREATE TABLE districts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    state_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    best_time VARCHAR(100),
    languages JSON,
    cuisine JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);

-- Create places table
CREATE TABLE places (
    id INT PRIMARY KEY AUTO_INCREMENT,
    district_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    category VARCHAR(50),
    rating DECIMAL(3,2) DEFAULT 0.00,
    best_time VARCHAR(100),
    entry_fee DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_districts_state_id ON districts(state_id);
CREATE INDEX idx_places_district_id ON places(district_id);
CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_rating ON places(rating);

-- Insert sample states data
INSERT INTO states (id, name, image, best_time, languages, cuisine) VALUES
(1, 'Andhra Pradesh', 'images/states/andhra_pradesh.jpg', 'October to March', '["Telugu", "English", "Urdu"]', '["Andhra Cuisine", "Gongura Pachadi", "Pesarattu", "Pulihora"]'),
(2, 'Arunachal Pradesh', 'images/states/arunachal_pradesh.jpg', 'October to March', '["English", "Hindi", "Nyishi", "Adi"]', '["Arunachali Cuisine", "Bamboo Rice", "Apong", "Pika Pila"]'),
(3, 'Assam', 'images/states/assam.jpg', 'October to March', '["Assamese", "Bengali", "Bodo", "English"]', '["Assamese Cuisine", "Masor Tenga", "Pitha", "Jolpan"]'),
(4, 'Bihar', 'images/states/bihar.jpg', 'October to March', '["Hindi", "Bhojpuri", "Maithili", "English"]', '["Bihari Cuisine", "Litti Chokha", "Sattu", "Khaja"]'),
(5, 'Chhattisgarh', 'images/states/chhattisgarh.jpg', 'October to March', '["Hindi", "Chhattisgarhi", "English"]', '["Chhattisgarhi Cuisine", "Bafauri", "Chila", "Muthia"]'),
(6, 'Goa', 'images/states/goa.jpg', 'November to March', '["Konkani", "English", "Hindi", "Portuguese"]', '["Goan Cuisine", "Fish Curry", "Vindaloo", "Bebinca"]'),
(7, 'Gujarat', 'images/states/gujarat.jpg', 'October to March', '["Gujarati", "Hindi", "English"]', '["Gujarati Cuisine", "Dhokla", "Khandvi", "Thepla"]'),
(8, 'Haryana', 'images/states/haryana.jpg', 'October to March', '["Hindi", "Haryanvi", "English"]', '["Haryanvi Cuisine", "Bajre ki Roti", "Singri ki Sabzi", "Hara Dhania Cholia"]'),
(9, 'Himachal Pradesh', 'images/states/himachal_pradesh.jpg', 'March to June, October to December', '["Hindi", "Pahari", "English"]', '["Himachali Cuisine", "Siddu", "Babru", "Aktori"]'),
(10, 'Jharkhand', 'images/states/jharkhand.jpg', 'October to March', '["Hindi", "Santali", "Bengali", "English"]', '["Jharkhandi Cuisine", "Dhuska", "Rugda", "Pitha"]'),
(11, 'Karnataka', 'images/states/karnataka.jpg', 'October to March', '["Kannada", "English", "Hindi", "Tamil"]', '["Karnataka Cuisine", "Bisi Bele Bath", "Ragi Mudde", "Mangalore Fish Curry"]'),
(12, 'Kerala', 'images/states/kerala.jpg', 'October to March', '["Malayalam", "English", "Tamil"]', '["Kerala Cuisine", "Fish Curry", "Appam", "Puttu"]'),
(13, 'Madhya Pradesh', 'images/states/madhya_pradesh.jpg', 'October to March', '["Hindi", "English", "Marathi"]', '["MP Cuisine", "Poha Jalebi", "Bhutte ka Kees", "Sabudana Khichdi"]'),
(14, 'Maharashtra', 'images/states/maharashtra.jpg', 'October to March', '["Marathi", "Hindi", "English"]', '["Maharashtrian Cuisine", "Vada Pav", "Pav Bhaji", "Misal Pav"]'),
(15, 'Manipur', 'images/states/manipur.jpg', 'October to March', '["Manipuri", "English", "Hindi"]', '["Manipuri Cuisine", "Eromba", "Singju", "Chamthong"]'),
(16, 'Meghalaya', 'images/states/meghalaya.jpg', 'March to June, September to December', '["Khasi", "Garo", "English", "Hindi"]', '["Khasi Cuisine", "Jadoh", "Doh Khleh", "Pumaloi"]'),
(17, 'Mizoram', 'images/states/mizoram.jpg', 'October to March', '["Mizo", "English", "Hindi"]', '["Mizo Cuisine", "Bai", "Vawksa Rep", "Sawhchiar"]'),
(18, 'Nagaland', 'images/states/nagaland.jpg', 'October to March', '["English", "Nagamese", "Hindi"]', '["Naga Cuisine", "Axone", "Bamboo Shoot Curry", "Smoked Pork"]'),
(19, 'Odisha', 'images/states/odisha.jpg', 'October to March', '["Odia", "Hindi", "English"]', '["Odisha Cuisine", "Pakhala", "Dalma", "Chungdi Malai"]'),
(20, 'Punjab', 'images/states/punjab.jpg', 'October to March', '["Punjabi", "Hindi", "English"]', '["Punjabi Cuisine", "Butter Chicken", "Makki di Roti", "Sarson da Saag"]'),
(21, 'Rajasthan', 'images/states/rajasthan.jpg', 'October to March', '["Hindi", "Rajasthani", "English"]', '["Rajasthani Cuisine", "Dal Baati Churma", "Laal Maas", "Ghewar"]'),
(22, 'Sikkim', 'images/states/sikkim.jpg', 'March to June, October to December', '["Nepali", "English", "Hindi", "Bhutia"]', '["Sikkimese Cuisine", "Thukpa", "Momos", "Gundruk"]'),
(23, 'Tamil Nadu', 'images/states/tamil_nadu.jpg', 'November to March', '["Tamil", "English", "Telugu"]', '["Tamil Cuisine", "Idli Sambar", "Dosa", "Pongal"]'),
(24, 'Telangana', 'images/states/telangana.jpg', 'October to March', '["Telugu", "Urdu", "Hindi", "English"]', '["Telangana Cuisine", "Hyderabadi Biryani", "Haleem", "Mirchi ka Salan"]'),
(25, 'Tripura', 'images/states/tripura.jpg', 'October to March', '["Bengali", "Kokborok", "English", "Hindi"]', '["Tripuri Cuisine", "Bamboo Shoot Curry", "Fish Curry", "Berma"]'),
(26, 'Uttar Pradesh', 'images/states/uttar_pradesh.jpg', 'October to March', '["Hindi", "Urdu", "English"]', '["UP Cuisine", "Awadhi Biryani", "Kebabs", "Banarasi Paan"]'),
(27, 'Uttarakhand', 'images/states/uttarakhand.jpg', 'March to June, September to November', '["Hindi", "Garhwali", "Kumaoni", "English"]', '["Uttarakhand Cuisine", "Kafuli", "Chainsoo", "Bhatt ki Churdkani"]'),
(28, 'West Bengal', 'images/states/west_bengal.jpg', 'October to March', '["Bengali", "Hindi", "English"]', '["Bengali Cuisine", "Roshogolla", "Macher Jhol", "Luchi Aloor Dom"]'),
(29, 'Andaman and Nicobar Islands', 'images/states/andaman_nicobar.jpg', 'October to May', '["Hindi", "English", "Bengali", "Tamil"]', '["Seafood", "Coconut-based Dishes", "Local Tribal Cuisine"]'),
(30, 'Chandigarh', 'images/states/chandigarh.jpg', 'October to March', '["Punjabi", "Hindi", "English"]', '["Punjabi Cuisine", "Butter Chicken", "Amritsari Fish", "Makki di Roti"]'),
(31, 'Dadra and Nagar Haveli and Daman and Diu', 'images/states/dadra_nagar_haveli_daman_diu.jpg', 'October to March', '["Gujarati", "Hindi", "English"]', '["Gujarati Cuisine", "Dhokla", "Khandvi", "Thepla"]'),
(32, 'Delhi', 'images/states/delhi.jpg', 'October to March', '["Hindi", "English", "Punjabi", "Urdu"]', '["Delhi Cuisine", "Street Food", "Mughlai Cuisine", "Chaat"]'),
(33, 'Jammu and Kashmir', 'images/states/jammu_kashmir.jpg', 'March to October', '["Kashmiri", "Hindi", "English", "Urdu"]', '["Kashmiri Cuisine", "Rogan Josh", "Dum Aloo", "Kahwa"]'),
(34, 'Ladakh', 'images/states/ladakh.jpg', 'June to September', '["Ladakhi", "Hindi", "English", "Tibetan"]', '["Ladakhi Cuisine", "Thukpa", "Momos", "Butter Tea"]'),
(35, 'Lakshadweep', 'images/states/lakshadweep.jpg', 'October to May', '["Malayalam", "English", "Hindi"]', '["Seafood", "Coconut-based Dishes", "Local Island Cuisine"]'),
(36, 'Puducherry', 'images/states/puducherry.jpg', 'October to March', '["Tamil", "English", "French", "Telugu"]', '["French-influenced Cuisine", "Seafood", "Local Tamil Cuisine"]');

-- Insert sample districts data
INSERT INTO districts (id, state_id, name, image, best_time, languages, cuisine) VALUES
-- Andhra Pradesh
(1, 1, 'Visakhapatnam', 'images/districts/visakhapatnam.jpg', 'October to March', '["Telugu", "English", "Hindi"]', '["Andhra Cuisine", "Seafood", "Biryani"]'),
(2, 1, 'Guntur', 'images/districts/guntur.jpg', 'October to March', '["Telugu", "English", "Hindi"]', '["Andhra Cuisine", "Gongura Pachadi", "Pesarattu"]'),
(3, 1, 'Vijayawada', 'images/districts/vijayawada.jpg', 'October to March', '["Telugu", "English", "Hindi"]', '["Andhra Cuisine", "Pulihora", "Gutti Vankaya"]'),

-- Arunachal Pradesh
(4, 2, 'Itanagar', 'images/districts/itanagar.jpg', 'October to March', '["English", "Hindi", "Nyishi"]', '["Arunachali Cuisine", "Bamboo Rice", "Apong"]'),
(5, 2, 'Tawang', 'images/districts/tawang.jpg', 'March to June, September to December', '["English", "Hindi", "Monpa"]', '["Tibetan Cuisine", "Thukpa", "Momos"]'),

-- Assam
(6, 3, 'Guwahati', 'images/districts/guwahati.jpg', 'October to March', '["Assamese", "Bengali", "English"]', '["Assamese Cuisine", "Masor Tenga", "Pitha"]'),
(7, 3, 'Dibrugarh', 'images/districts/dibrugarh.jpg', 'October to March', '["Assamese", "Bengali", "English"]', '["Assamese Cuisine", "Tea", "Jolpan"]'),

-- Bihar
(8, 4, 'Patna', 'images/districts/patna.jpg', 'October to March', '["Hindi", "Bhojpuri", "English"]', '["Bihari Cuisine", "Litti Chokha", "Sattu"]'),
(9, 4, 'Gaya', 'images/districts/gaya.jpg', 'October to March', '["Hindi", "Bhojpuri", "English"]', '["Bihari Cuisine", "Khaja", "Thekua"]'),

-- Chhattisgarh
(10, 5, 'Raipur', 'images/districts/raipur.jpg', 'October to March', '["Hindi", "Chhattisgarhi", "English"]', '["Chhattisgarhi Cuisine", "Bafauri", "Chila"]'),
(11, 5, 'Bilaspur', 'images/districts/bilaspur.jpg', 'October to March', '["Hindi", "Chhattisgarhi", "English"]', '["Chhattisgarhi Cuisine", "Muthia", "Bafauri"]'),

-- Goa
(12, 6, 'Panaji', 'images/districts/panaji.jpg', 'November to March', '["Konkani", "English", "Portuguese"]', '["Goan Cuisine", "Fish Curry", "Vindaloo"]'),
(13, 6, 'Margao', 'images/districts/margao.jpg', 'November to March', '["Konkani", "English", "Portuguese"]', '["Goan Cuisine", "Bebinca", "Feni"]'),

-- Gujarat
(14, 7, 'Ahmedabad', 'images/districts/ahmedabad.jpg', 'October to March', '["Gujarati", "Hindi", "English"]', '["Gujarati Cuisine", "Dhokla", "Khandvi"]'),
(15, 7, 'Surat', 'images/districts/surat.jpg', 'October to March', '["Gujarati", "Hindi", "English"]', '["Surati Cuisine", "Locho", "Undhiyu"]'),

-- Haryana
(16, 8, 'Gurgaon', 'images/districts/gurgaon.jpg', 'October to March', '["Hindi", "Haryanvi", "English"]', '["Haryanvi Cuisine", "Bajre ki Roti", "Singri ki Sabzi"]'),
(17, 8, 'Faridabad', 'images/districts/faridabad.jpg', 'October to March', '["Hindi", "Haryanvi", "English"]', '["Haryanvi Cuisine", "Hara Dhania Cholia", "Bajre ki Roti"]'),

-- Himachal Pradesh
(18, 9, 'Shimla', 'images/districts/shimla.jpg', 'March to June, October to December', '["Hindi", "Pahari", "English"]', '["Himachali Cuisine", "Siddu", "Babru"]'),
(19, 9, 'Manali', 'images/districts/manali.jpg', 'March to June, October to December', '["Hindi", "Pahari", "English"]', '["Himachali Cuisine", "Aktori", "Siddu"]'),

-- Jharkhand
(20, 10, 'Ranchi', 'images/districts/ranchi.jpg', 'October to March', '["Hindi", "Santali", "English"]', '["Jharkhandi Cuisine", "Dhuska", "Rugda"]'),
(21, 10, 'Jamshedpur', 'images/districts/jamshedpur.jpg', 'October to March', '["Hindi", "Bengali", "English"]', '["Jharkhandi Cuisine", "Pitha", "Dhuska"]'),

-- Karnataka
(22, 11, 'Bangalore', 'images/districts/bangalore.jpg', 'October to March', '["Kannada", "English", "Hindi"]', '["Karnataka Cuisine", "Bisi Bele Bath", "Ragi Mudde"]'),
(23, 11, 'Mysore', 'images/districts/mysore.jpg', 'October to March', '["Kannada", "English", "Hindi"]', '["Mysore Cuisine", "Mysore Pak", "Mysore Masala Dosa"]'),

-- Kerala
(24, 12, 'Thiruvananthapuram', 'images/districts/thiruvananthapuram.jpg', 'October to March', '["Malayalam", "English", "Tamil"]', '["Kerala Cuisine", "Fish Curry", "Appam"]'),
(25, 12, 'Kochi', 'images/districts/kochi.jpg', 'October to March', '["Malayalam", "English", "Hindi"]', '["Kerala Cuisine", "Puttu", "Malabar Biryani"]'),

-- Madhya Pradesh
(26, 13, 'Bhopal', 'images/districts/bhopal.jpg', 'October to March', '["Hindi", "English", "Urdu"]', '["Bhopali Cuisine", "Bhopali Gosht Korma", "Bhopali Paan"]'),
(27, 13, 'Indore', 'images/districts/indore.jpg', 'October to March', '["Hindi", "English", "Marathi"]', '["Indori Cuisine", "Poha Jalebi", "Indori Namkeen"]'),

-- Maharashtra
(28, 14, 'Mumbai', 'images/districts/mumbai.jpg', 'October to March', '["Marathi", "Hindi", "English"]', '["Maharashtrian Cuisine", "Vada Pav", "Pav Bhaji"]'),
(29, 14, 'Pune', 'images/districts/pune.jpg', 'October to March', '["Marathi", "Hindi", "English"]', '["Maharashtrian Cuisine", "Misal Pav", "Puran Poli"]'),

-- Manipur
(30, 15, 'Imphal', 'images/districts/imphal.jpg', 'October to March', '["Manipuri", "English", "Hindi"]', '["Manipuri Cuisine", "Eromba", "Singju"]'),

-- Meghalaya
(31, 16, 'Shillong', 'images/districts/shillong.jpg', 'March to June, September to December', '["Khasi", "English", "Hindi"]', '["Khasi Cuisine", "Jadoh", "Doh Khleh"]'),

-- Nagaland
(32, 18, 'Kohima', 'images/districts/kohima.jpg', 'October to March', '["English", "Nagamese", "Hindi"]', '["Naga Cuisine", "Axone", "Bamboo Shoot Curry"]'),

-- Odisha
(33, 19, 'Bhubaneswar', 'images/districts/bhubaneswar.jpg', 'October to March', '["Odia", "Hindi", "English"]', '["Odisha Cuisine", "Pakhala", "Dalma"]'),
(34, 19, 'Puri', 'images/districts/puri.jpg', 'October to March', '["Odia", "Hindi", "English"]', '["Odisha Cuisine", "Mahaprasad", "Chungdi Malai"]'),

-- Punjab
(35, 20, 'Chandigarh', 'images/districts/chandigarh.jpg', 'October to March', '["Punjabi", "Hindi", "English"]', '["Punjabi Cuisine", "Butter Chicken", "Makki di Roti"]'),
(36, 20, 'Amritsar', 'images/districts/amritsar.jpg', 'October to March', '["Punjabi", "Hindi", "English"]', '["Punjabi Cuisine", "Amritsari Kulcha", "Langar"]'),

-- Rajasthan
(37, 21, 'Jaipur', 'images/districts/jaipur.jpg', 'October to March', '["Hindi", "Rajasthani", "English"]', '["Rajasthani Cuisine", "Dal Baati Churma", "Ghewar"]'),
(38, 21, 'Jaisalmer', 'images/districts/jaisalmer.jpg', 'October to March', '["Hindi", "Rajasthani", "English"]', '["Rajasthani Cuisine", "Laal Maas", "Ker Sangri"]'),

-- Sikkim
(39, 22, 'Gangtok', 'images/districts/gangtok.jpg', 'March to June, October to December', '["Nepali", "English", "Hindi"]', '["Sikkimese Cuisine", "Thukpa", "Momos"]'),

-- Tamil Nadu
(40, 23, 'Chennai', 'images/districts/chennai.jpg', 'November to March', '["Tamil", "English", "Telugu"]', '["Tamil Cuisine", "Idli Sambar", "Dosa"]'),
(41, 23, 'Coimbatore', 'images/districts/coimbatore.jpg', 'October to March', '["Tamil", "English", "Malayalam"]', '["Kongunadu Cuisine", "Poriyal", "Rasam"]'),

-- Telangana
(42, 24, 'Hyderabad', 'images/districts/hyderabad.jpg', 'October to March', '["Telugu", "Urdu", "Hindi", "English"]', '["Hyderabadi Cuisine", "Hyderabadi Biryani", "Haleem"]'),
(43, 24, 'Warangal', 'images/districts/warangal.jpg', 'October to March', '["Telugu", "Urdu", "Hindi"]', '["Telangana Cuisine", "Pesarattu", "Gongura Pachadi"]'),

-- Tripura
(44, 25, 'Agartala', 'images/districts/agartala.jpg', 'October to March', '["Bengali", "Kokborok", "English", "Hindi"]', '["Tripuri Cuisine", "Bamboo Shoot Curry", "Fish Curry"]'),

-- Uttar Pradesh
(45, 26, 'Varanasi', 'images/districts/varanasi.jpg', 'October to March', '["Hindi", "Bhojpuri", "English"]', '["Banarasi Cuisine", "Banarasi Paan", "Kachori Sabzi"]'),
(46, 26, 'Agra', 'images/districts/agra.jpg', 'October to March', '["Hindi", "English", "Urdu"]', '["Mughlai Cuisine", "Agra Petha", "Bedai"]'),

-- Uttarakhand
(47, 27, 'Dehradun', 'images/districts/dehradun.jpg', 'March to June, September to November', '["Hindi", "Garhwali", "English"]', '["Garhwali Cuisine", "Kafuli", "Chainsoo"]'),
(48, 27, 'Rishikesh', 'images/districts/rishikesh.jpg', 'March to June, September to November', '["Hindi", "Garhwali", "English"]', '["Garhwali Cuisine", "Bhatt ki Churdkani", "Kafuli"]'),

-- West Bengal
(49, 28, 'Kolkata', 'images/districts/kolkata.jpg', 'October to March', '["Bengali", "Hindi", "English"]', '["Bengali Cuisine", "Roshogolla", "Macher Jhol"]'),
(50, 28, 'Darjeeling', 'images/districts/darjeeling.jpg', 'March to May, October to December', '["Nepali", "Bengali", "English", "Hindi"]', '["Tibetan Cuisine", "Momos", "Thukpa"]');

-- Insert sample places data
INSERT INTO places (district_id, name, description, image, category, rating, best_time, entry_fee) VALUES
-- Visakhapatnam places
(1, 'RK Beach', 'A popular beach in Visakhapatnam with golden sands and clear waters.', 'images/places/rk_beach.jpg', 'Beach', 4.5, 'October to March', 0.00),
(1, 'Kailasagiri', 'A hilltop park with scenic views of the city and Bay of Bengal.', 'images/places/kailasagiri.jpg', 'Park', 4.3, 'October to March', 50.00),
(1, 'Borra Caves', 'Ancient limestone caves with stunning stalactite and stalagmite formations.', 'images/places/borra_caves.jpg', 'Cave', 4.2, 'October to March', 100.00),

-- Guntur places
(2, 'Amaravati Stupa', 'Ancient Buddhist monument and archaeological site.', 'images/places/amaravati_stupa.jpg', 'Historical', 4.4, 'October to March', 25.00),
(2, 'Uppalapadu Bird Sanctuary', 'Sanctuary for migratory birds and local wildlife.', 'images/places/uppalapadu.jpg', 'Wildlife', 4.1, 'October to March', 30.00),

-- Itanagar places
(4, 'Ganga Lake', 'A serene lake surrounded by forest, perfect for boating and nature walks.', 'images/places/ganga_lake.jpg', 'Lake', 4.3, 'October to March', 20.00),
(4, 'Ita Fort', 'Historical fort in Itanagar with ancient architecture.', 'images/places/ita_fort.jpg', 'Fort', 4.0, 'October to March', 15.00),

-- Tawang places
(5, 'Tawang Monastery', 'Largest monastery in India with stunning mountain views.', 'images/places/tawang_monastery.jpg', 'Monastery', 4.7, 'March to June, September to December', 50.00),
(5, 'Sela Pass', 'Scenic mountain pass with breathtaking views of snow-capped peaks.', 'images/places/sela_pass.jpg', 'Mountain Pass', 4.6, 'March to June, September to December', 0.00),

-- Guwahati places
(6, 'Kamakhya Temple', 'Famous Hindu temple dedicated to Goddess Kamakhya.', 'images/places/kamakhya_temple.jpg', 'Temple', 4.5, 'October to March', 0.00),
(6, 'Umananda Island', 'River island with a temple and scenic Brahmaputra views.', 'images/places/umananda.jpg', 'Island', 4.2, 'October to March', 100.00),

-- Dibrugarh places
(7, 'Dibru-Saikhowa National Park', 'Biodiversity hotspot with diverse wildlife and bird species.', 'images/places/dibru_saikhowa.jpg', 'National Park', 4.4, 'October to March', 200.00),
(7, 'Radha Krishna Mandir', 'Beautiful temple in Dibrugarh with intricate architecture.', 'images/places/radha_krishna.jpg', 'Temple', 4.1, 'October to March', 0.00),

-- Patna places
(8, 'Mahavir Mandir', 'Famous temple dedicated to Lord Hanuman.', 'images/places/mahavir_mandir.jpg', 'Temple', 4.3, 'October to March', 0.00),
(8, 'Gandhi Maidan', 'Historic ground where Mahatma Gandhi held meetings.', 'images/places/gandhi_maidan.jpg', 'Historical', 4.0, 'October to March', 0.00),

-- Gaya places
(9, 'Mahabodhi Temple', 'UNESCO World Heritage Site where Buddha attained enlightenment.', 'images/places/mahabodhi_temple.jpg', 'Temple', 4.8, 'October to March', 100.00),
(9, 'Vishnupad Temple', 'Ancient temple with footprint of Lord Vishnu.', 'images/places/vishnupad_temple.jpg', 'Temple', 4.2, 'October to March', 50.00),

-- Raipur places
(10, 'Mahant Ghasidas Museum', 'State museum showcasing tribal culture and artifacts.', 'images/places/mahant_ghasidas_museum.jpg', 'Museum', 4.1, 'October to March', 20.00),
(10, 'Purkhouti Muktangan', 'Cultural complex with tribal art and crafts.', 'images/places/purkhouti_muktangan.jpg', 'Cultural', 4.0, 'October to March', 30.00),

-- Panaji places
(12, 'Basilica of Bom Jesus', 'UNESCO World Heritage Site with relics of St. Francis Xavier.', 'images/places/basilica_bom_jesus.jpg', 'Church', 4.6, 'November to March', 0.00),
(12, 'Fort Aguada', '17th-century Portuguese fort with lighthouse.', 'images/places/fort_aguada.jpg', 'Fort', 4.4, 'November to March', 100.00),

-- Ahmedabad places
(14, 'Sabarmati Ashram', 'Historic ashram where Mahatma Gandhi lived.', 'images/places/sabarmati_ashram.jpg', 'Historical', 4.5, 'October to March', 0.00),
(14, 'Adalaj Stepwell', 'Ancient stepwell with intricate carvings.', 'images/places/adalaj_stepwell.jpg', 'Historical', 4.3, 'October to March', 25.00),

-- Shimla places
(18, 'The Ridge', 'Popular promenade with colonial architecture and mountain views.', 'images/places/the_ridge.jpg', 'Promenade', 4.4, 'March to June, October to December', 0.00),
(18, 'Jakhu Temple', 'Ancient temple on Jakhu Hill with panoramic views.', 'images/places/jakhu_temple.jpg', 'Temple', 4.2, 'March to June, October to December', 50.00),

-- Bangalore places
(22, 'Lalbagh Botanical Garden', 'Historic botanical garden with rare plant species.', 'images/places/lalbagh.jpg', 'Garden', 4.5, 'October to March', 50.00),
(22, 'Cubbon Park', 'Central park with colonial buildings and walking trails.', 'images/places/cubbon_park.jpg', 'Park', 4.3, 'October to March', 0.00),

-- Mysore places
(23, 'Mysore Palace', 'Magnificent palace with Indo-Saracenic architecture.', 'images/places/mysore_palace.jpg', 'Palace', 4.7, 'October to March', 200.00),
(23, 'Chamundi Hills', 'Sacred hill with temple and panoramic city views.', 'images/places/chamundi_hills.jpg', 'Temple', 4.4, 'October to March', 50.00),

-- Thiruvananthapuram places
(24, 'Kovalam Beach', 'Famous beach with crescent-shaped shoreline.', 'images/places/kovalam_beach.jpg', 'Beach', 4.5, 'October to March', 0.00),
(24, 'Padmanabhaswamy Temple', 'Ancient temple with Dravidian architecture.', 'images/places/padmanabhaswamy_temple.jpg', 'Temple', 4.6, 'October to March', 0.00),

-- Kochi places
(25, 'Fort Kochi', 'Historic area with colonial architecture and Chinese fishing nets.', 'images/places/fort_kochi.jpg', 'Historical', 4.4, 'October to March', 0.00),
(25, 'Mattancherry Palace', 'Portuguese palace with Kerala murals.', 'images/places/mattancherry_palace.jpg', 'Palace', 4.2, 'October to March', 50.00),

-- Bhopal places
(26, 'Upper Lake', 'Large artificial lake perfect for boating and sunset views.', 'images/places/upper_lake.jpg', 'Lake', 4.3, 'October to March', 100.00),
(26, 'Taj-ul-Masajid', 'One of the largest mosques in India.', 'images/places/taj_ul_masajid.jpg', 'Mosque', 4.1, 'October to March', 0.00),

-- Mumbai places
(28, 'Gateway of India', 'Historic monument and popular tourist attraction.', 'images/places/gateway_of_india.jpg', 'Monument', 4.5, 'October to March', 0.00),
(28, 'Marine Drive', 'Scenic coastal road known as the Queen\'s Necklace.', 'images/places/marine_drive.jpg', 'Scenic Drive', 4.4, 'October to March', 0.00),

-- Jaipur places
(37, 'Amber Fort', 'Magnificent fort with stunning architecture and views.', 'images/places/amber_fort.jpg', 'Fort', 4.6, 'October to March', 500.00),
(37, 'Hawa Mahal', 'Palace of Winds with intricate latticework.', 'images/places/hawa_mahal.jpg', 'Palace', 4.3, 'October to March', 200.00),

-- Chennai places
(40, 'Marina Beach', 'Second longest urban beach in the world.', 'images/places/marina_beach.jpg', 'Beach', 4.4, 'November to March', 0.00),
(40, 'Kapaleeshwarar Temple', 'Ancient temple with Dravidian architecture.', 'images/places/kapaleeshwarar_temple.jpg', 'Temple', 4.2, 'November to March', 0.00),

-- Hyderabad places
(42, 'Charminar', 'Iconic monument and mosque in the heart of the city.', 'images/places/charminar.jpg', 'Monument', 4.5, 'October to March', 100.00),
(42, 'Golconda Fort', 'Historic fort with impressive acoustics.', 'images/places/golconda_fort.jpg', 'Fort', 4.4, 'October to March', 200.00),

-- Varanasi places
(45, 'Ghats of Varanasi', 'Sacred riverfront with numerous ghats for rituals.', 'images/places/varanasi_ghats.jpg', 'Sacred Site', 4.7, 'October to March', 0.00),
(45, 'Kashi Vishwanath Temple', 'One of the most sacred temples in Hinduism.', 'images/places/kashi_vishwanath.jpg', 'Temple', 4.8, 'October to March', 0.00),

-- Kolkata places
(49, 'Victoria Memorial', 'Magnificent marble building with museum and gardens.', 'images/places/victoria_memorial.jpg', 'Museum', 4.6, 'October to March', 500.00),
(49, 'Howrah Bridge', 'Iconic cantilever bridge over the Hooghly River.', 'images/places/howrah_bridge.jpg', 'Bridge', 4.3, 'October to March', 0.00);

-- Create views for common queries
CREATE VIEW popular_places AS
SELECT p.*, d.name as district_name, s.name as state_name
FROM places p
JOIN districts d ON p.district_id = d.id
JOIN states s ON d.state_id = s.id
WHERE p.rating >= 4.0
ORDER BY p.rating DESC;

CREATE VIEW state_summary AS
SELECT 
    s.id,
    s.name as state_name,
    COUNT(DISTINCT d.id) as district_count,
    COUNT(p.id) as place_count,
    AVG(p.rating) as avg_rating
FROM states s
LEFT JOIN districts d ON s.id = d.state_id
LEFT JOIN places p ON d.id = p.district_id
GROUP BY s.id, s.name;

-- Insert sample data complete
SELECT 'Database setup completed successfully!' as status; 