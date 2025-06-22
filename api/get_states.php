<?php
require_once 'config.php';

// Set CORS headers
setCORSHeaders();

try {
    $pdo = getDBConnection();
    
    // Get query parameters
    $search = $_GET['search'] ?? '';
    $limit = (int)($_GET['limit'] ?? 50);
    $offset = (int)($_GET['offset'] ?? 0);
    
    // Build query
    $query = "SELECT * FROM states";
    $params = [];
    
    // Add search filter if provided
    if (!empty($search)) {
        $query .= " WHERE name LIKE :search";
        $params[':search'] = "%$search%";
    }
    
    // Add ordering and pagination
    $query .= " ORDER BY name ASC LIMIT :limit OFFSET :offset";
    $params[':limit'] = $limit;
    $params[':offset'] = $offset;
    
    // Prepare and execute query
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    
    $states = $stmt->fetchAll();
    
    // Get total count for pagination
    $countQuery = "SELECT COUNT(*) as total FROM states";
    if (!empty($search)) {
        $countQuery .= " WHERE name LIKE :search";
    }
    $countStmt = $pdo->prepare($countQuery);
    if (!empty($search)) {
        $countStmt->execute([':search' => "%$search%"]);
    } else {
        $countStmt->execute();
    }
    $totalCount = $countStmt->fetch()['total'];
    
    // Send response
    sendJSONResponse([
        'success' => true,
        'data' => $states,
        'pagination' => [
            'total' => (int)$totalCount,
            'limit' => $limit,
            'offset' => $offset,
            'has_more' => ($offset + $limit) < $totalCount
        ]
    ]);
    
} catch (Exception $e) {
    sendJSONResponse(['error' => 'Failed to fetch states: ' . $e->getMessage()], 500);
}
?> 