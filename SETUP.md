# Project Inscape - Database & Backend Setup Guide

## Overview
This guide will help you set up the MySQL database and PHP backend for Project Inscape, an India-themed travel platform.

## Prerequisites
- MySQL Server (5.7 or higher)
- PHP (7.4 or higher)
- Web Server (Apache/Nginx)
- Basic knowledge of MySQL and PHP

## Step 1: Database Setup

### 1.1 Create Database
```sql
-- Run this in MySQL command line or phpMyAdmin
CREATE DATABASE inscape_db;
USE inscape_db;
```

### 1.2 Import Database Schema
```bash
# Method 1: Using MySQL command line
mysql -u your_username -p inscape_db < database/inscape_db.sql

# Method 2: Using phpMyAdmin
# 1. Open phpMyAdmin
# 2. Select inscape_db database
# 3. Go to Import tab
# 4. Choose database/inscape_db.sql file
# 5. Click Go
```

### 1.3 Verify Database Setup
```sql
-- Check if tables are created
SHOW TABLES;

-- Check sample data
SELECT COUNT(*) FROM states;
SELECT COUNT(*) FROM districts;
SELECT COUNT(*) FROM places;
```

## Step 2: PHP Backend Setup

### 2.1 Configure Database Connection
Edit `api/config.php` and update the database credentials:

```php
define('DB_HOST', 'localhost');     // Your MySQL host
define('DB_NAME', 'inscape_db');    // Database name
define('DB_USER', 'your_username'); // Your MySQL username
define('DB_PASS', 'your_password'); // Your MySQL password
```

### 2.2 Test API Endpoints
You can test the API endpoints using a web browser or tools like Postman:

#### Test States API:
```
http://your-domain/api/get_states.php
http://your-domain/api/get_states.php?search=Karnataka
```

#### Test Districts API:
```
http://your-domain/api/get_districts.php?state_id=11
http://your-domain/api/get_districts.php?state_id=11&search=Bangalore
```

#### Test Places API:
```
http://your-domain/api/get_places.php?district_id=22
http://your-domain/api/get_places.php?district_id=22&category=Temple
```

#### Test Search API:
```
http://your-domain/api/search.php?q=Temple
http://your-domain/api/search.php?q=Bangalore&type=districts
```

## Step 3: Frontend Integration

### 3.1 Update API Base URL
Edit `js/api.js` and update the base URL:

```javascript
constructor() {
    this.baseURL = '/api'; // Change this to match your server path
}
```

### 3.2 Include API Script
Make sure to include the API script in your HTML files before other scripts:

```html
<script src="js/api.js"></script>
<script src="js/main.js"></script>
```

## Step 4: File Structure
Ensure your project structure looks like this:

```
Project-Inscape/
├── index.html
├── map.html
├── state.html
├── contact.html
├── css/
│   ├── style.css
│   ├── home.css
│   ├── map.css
│   ├── state.css
│   ├── contact.css
│   └── responsive.css
├── js/
│   ├── api.js          # NEW: API service
│   ├── main.js         # UPDATED: Uses API
│   ├── home.js
│   ├── map.js
│   ├── state.js
│   └── contact.js
├── api/                # NEW: PHP backend
│   ├── config.php
│   ├── get_states.php
│   ├── get_districts.php
│   ├── get_places.php
│   └── search.php
├── database/           # NEW: Database files
│   └── inscape_db.sql
├── data/               # OLD: JSON files (can be removed after DB setup)
│   ├── states.json
│   └── districts.json
└── images/
    ├── states/
    ├── districts/
    └── places/
```

## Step 5: Testing

### 5.1 Test Database Connection
Create a test file `api/test_connection.php`:

```php
<?php
require_once 'config.php';

try {
    $pdo = getDBConnection();
    echo "Database connection successful!";
    
    // Test states query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM states");
    $result = $stmt->fetch();
    echo "<br>States count: " . $result['count'];
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
```

### 5.2 Test Frontend Integration
1. Open your website in a browser
2. Open Developer Tools (F12)
3. Go to Network tab
4. Navigate through the pages
5. Check if API calls are successful

## Step 6: Troubleshooting

### Common Issues:

#### 1. Database Connection Failed
- Check MySQL credentials in `api/config.php`
- Ensure MySQL service is running
- Verify database name exists

#### 2. API Returns 404
- Check if PHP files are in correct location
- Verify web server configuration
- Check file permissions

#### 3. CORS Errors
- The API includes CORS headers
- If still having issues, check your web server CORS configuration

#### 4. Empty Results
- Verify database has data
- Check API parameters
- Review browser console for errors

### Debug Mode
To enable debug mode, add this to `api/config.php`:

```php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## Step 7: Production Deployment

### 7.1 Security Considerations
- Change default MySQL credentials
- Use HTTPS in production
- Implement proper authentication if needed
- Sanitize all user inputs

### 7.2 Performance Optimization
- Enable MySQL query caching
- Use PHP OPcache
- Implement API response caching
- Optimize database indexes

### 7.3 Backup Strategy
```bash
# Create database backup
mysqldump -u username -p inscape_db > backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u username -p inscape_db < backup_20231201.sql
```

## API Documentation

### Endpoints Overview:

1. **GET /api/get_states.php**
   - Parameters: `search`, `limit`, `offset`
   - Returns: List of states

2. **GET /api/get_districts.php**
   - Parameters: `state_id` (required), `search`, `limit`, `offset`
   - Returns: List of districts for a state

3. **GET /api/get_places.php**
   - Parameters: `district_id` (required), `category`, `search`, `min_rating`, `limit`, `offset`
   - Returns: List of places in a district

4. **GET /api/search.php**
   - Parameters: `q` (required), `type`, `limit`, `offset`
   - Returns: Search results across states, districts, and places

### Response Format:
```json
{
    "success": true,
    "data": [...],
    "pagination": {
        "total": 100,
        "limit": 20,
        "offset": 0,
        "has_more": true
    }
}
```

## Support
If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check the web server error logs
3. Verify database connectivity
4. Test API endpoints directly

## Next Steps
After successful setup:
1. Add more sample data to the database
2. Implement user authentication
3. Add image upload functionality
4. Implement caching for better performance
5. Add admin panel for content management 