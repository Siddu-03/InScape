<?php
require_once 'config.php';

// Set CORS headers
setCORSHeaders();

try {
    $pdo = getDBConnection();
    
    // Get query parameters
    $district_id = $_GET['district_id'] ?? null;
    $category = $_GET['category'] ?? '';
    $search = $_GET['search'] ?? '';
    $min_rating = $_GET['min_rating'] ?? 0;
    $limit = (int)($_GET['limit'] ?? 50);
    $offset = (int)($_GET['offset'] ?? 0);
    
    // Validate required parameters
    if (!$district_id) {
        sendJSONResponse(['error' => 'district_id parameter is required'], 400);
    }
    
    // Build query
    $query = "SELECT p.*, d.name as district_name, s.name as state_name 
              FROM places p 
              JOIN districts d ON p.district_id = d.id 
              JOIN states s ON d.state_id = s.id 
              WHERE p.district_id = :district_id";
    $params = [':district_id' => $district_id];
    
    // Add filters
    if (!empty($category)) {
        $query .= " AND p.category = :category";
        $params[':category'] = $category;
    }
    
    if (!empty($search)) {
        $query .= " AND (p.name LIKE :search OR p.description LIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    if ($min_rating > 0) {
        $query .= " AND p.rating >= :min_rating";
        $params[':min_rating'] = $min_rating;
    }
    
    // Add ordering and pagination
    $query .= " ORDER BY p.rating DESC, p.name ASC LIMIT :limit OFFSET :offset";
    $params[':limit'] = $limit;
    $params[':offset'] = $offset;
    
    // Prepare and execute query
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    
    $places = $stmt->fetchAll();
    
    // Get total count for pagination
    $countQuery = "SELECT COUNT(*) as total FROM places p WHERE p.district_id = :district_id";
    $countParams = [':district_id' => $district_id];
    
    if (!empty($category)) {
        $countQuery .= " AND p.category = :category";
        $countParams[':category'] = $category;
    }
    
    if (!empty($search)) {
        $countQuery .= " AND (p.name LIKE :search OR p.description LIKE :search)";
        $countParams[':search'] = "%$search%";
    }
    
    if ($min_rating > 0) {
        $countQuery .= " AND p.rating >= :min_rating";
        $countParams[':min_rating'] = $min_rating;
    }
    
    $countStmt = $pdo->prepare($countQuery);
    $countStmt->execute($countParams);
    $totalCount = $countStmt->fetch()['total'];
    
    // Send response
    sendJSONResponse([
        'success' => true,
        'data' => $places,
        'pagination' => [
            'total' => (int)$totalCount,
            'limit' => $limit,
            'offset' => $offset,
            'has_more' => ($offset + $limit) < $totalCount
        ]
    ]);
    
} catch (Exception $e) {
    sendJSONResponse(['error' => 'Failed to fetch places: ' . $e->getMessage()], 500);
}
?> 