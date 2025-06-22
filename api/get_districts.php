<?php
require_once 'config.php';

// Set CORS headers
setCORSHeaders();

try {
    $pdo = getDBConnection();
    
    // Get query parameters
    $state_id = $_GET['state_id'] ?? null;
    $search = $_GET['search'] ?? '';
    $limit = (int)($_GET['limit'] ?? 50);
    $offset = (int)($_GET['offset'] ?? 0);
    
    // Validate required parameters
    if (!$state_id) {
        sendJSONResponse(['error' => 'state_id parameter is required'], 400);
    }
    
    // Build query
    $query = "SELECT d.*, s.name as state_name 
              FROM districts d 
              JOIN states s ON d.state_id = s.id 
              WHERE d.state_id = :state_id";
    $params = [':state_id' => $state_id];
    
    // Add search filter if provided
    if (!empty($search)) {
        $query .= " AND d.name LIKE :search";
        $params[':search'] = "%$search%";
    }
    
    // Add ordering and pagination
    $query .= " ORDER BY d.name ASC LIMIT :limit OFFSET :offset";
    $params[':limit'] = $limit;
    $params[':offset'] = $offset;
    
    // Prepare and execute query
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    
    $districts = $stmt->fetchAll();
    
    // Get total count for pagination
    $countQuery = "SELECT COUNT(*) as total FROM districts d WHERE d.state_id = :state_id";
    if (!empty($search)) {
        $countQuery .= " AND d.name LIKE :search";
    }
    $countStmt = $pdo->prepare($countQuery);
    $countParams = [':state_id' => $state_id];
    if (!empty($search)) {
        $countParams[':search'] = "%$search%";
    }
    $countStmt->execute($countParams);
    $totalCount = $countStmt->fetch()['total'];
    
    // Send response
    sendJSONResponse([
        'success' => true,
        'data' => $districts,
        'pagination' => [
            'total' => (int)$totalCount,
            'limit' => $limit,
            'offset' => $offset,
            'has_more' => ($offset + $limit) < $totalCount
        ]
    ]);
    
} catch (Exception $e) {
    sendJSONResponse(['error' => 'Failed to fetch districts: ' . $e->getMessage()], 500);
}
?> 