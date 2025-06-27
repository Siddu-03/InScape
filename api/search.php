<?php
require_once 'config.php';

// Set CORS headers
setCORSHeaders();

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $pdo = getDBConnection();
    
    // Get query parameters
    $q = $_GET['q'] ?? '';
    $type = $_GET['type'] ?? 'all'; // all, states, districts, places
    $limit = (int)($_GET['limit'] ?? 20);
    $offset = (int)($_GET['offset'] ?? 0);
    
    // Debug logging
    error_log("Search API called with: q='$q', type='$type', limit=$limit, offset=$offset");
    
    // Validate required parameters
    if (empty($q)) {
        sendJSONResponse(['error' => 'Search query parameter "q" is required'], 400);
    }
    
    $results = [];
    
    // Search states
    if ($type === 'all' || $type === 'states') {
        $stateQuery = "SELECT 
                        'state' as type,
                        id,
                        name,
                        image,
                        best_time,
                        languages,
                        cuisine
                       FROM states 
                       WHERE name LIKE :search 
                       ORDER BY name ASC 
                       LIMIT :limit";
        
        $stateStmt = $pdo->prepare($stateQuery);
        $stateStmt->execute([':search' => "%$q%", ':limit' => $limit]);
        $stateResults = $stateStmt->fetchAll();
        $results = array_merge($results, $stateResults);
        
        error_log("States found: " . count($stateResults));
    }
    
    // Search districts
    if ($type === 'all' || $type === 'districts') {
        $districtQuery = "SELECT 
                           'district' as type,
                           d.id,
                           d.name,
                           d.image,
                           d.best_time,
                           d.languages,
                           d.cuisine,
                           s.name as state_name,
                           s.id as state_id
                          FROM districts d 
                          JOIN states s ON d.state_id = s.id 
                          WHERE d.name LIKE :search 
                          ORDER BY d.name ASC 
                          LIMIT :limit";
        
        $districtStmt = $pdo->prepare($districtQuery);
        $districtStmt->execute([':search' => "%$q%", ':limit' => $limit]);
        $districtResults = $districtStmt->fetchAll();
        $results = array_merge($results, $districtResults);
        
        error_log("Districts found: " . count($districtResults));
    }
    
    // Search places
    if ($type === 'all' || $type === 'places') {
        $placeQuery = "SELECT 
                        'place' as type,
                        p.id,
                        p.name,
                        p.description,
                        p.image,
                        p.category,
                        p.rating,
                        p.best_time,
                        p.entry_fee,
                        d.name as district_name,
                        d.id as district_id,
                        s.name as state_name,
                        s.id as state_id
                       FROM places p 
                       JOIN districts d ON p.district_id = d.id 
                       JOIN states s ON d.state_id = s.id 
                       WHERE p.name LIKE :search OR p.description LIKE :search 
                       ORDER BY p.rating DESC, p.name ASC 
                       LIMIT :limit";
        
        $placeStmt = $pdo->prepare($placeQuery);
        $placeStmt->execute([':search' => "%$q%", ':limit' => $limit]);
        $placeResults = $placeStmt->fetchAll();
        $results = array_merge($results, $placeResults);
        
        error_log("Places found: " . count($placeResults));
    }
    
    // Sort results by relevance (exact matches first, then partial matches)
    usort($results, function($a, $b) use ($q) {
        $aExact = stripos($a['name'], $q) === 0;
        $bExact = stripos($b['name'], $q) === 0;
        
        if ($aExact && !$bExact) return -1;
        if (!$aExact && $bExact) return 1;
        
        return strcasecmp($a['name'], $b['name']);
    });
    
    // Apply pagination
    $totalResults = count($results);
    $results = array_slice($results, $offset, $limit);
    
    error_log("Total results before pagination: $totalResults, After pagination: " . count($results));
    
    // Send response
    sendJSONResponse([
        'success' => true,
        'query' => $q,
        'type' => $type,
        'data' => $results,
        'pagination' => [
            'total' => $totalResults,
            'limit' => $limit,
            'offset' => $offset,
            'has_more' => ($offset + $limit) < $totalResults
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Search API error: " . $e->getMessage());
    sendJSONResponse(['error' => 'Search failed: ' . $e->getMessage()], 500);
}
?> 