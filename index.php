<?php
// index.php - Load the main application
// This handles routing and serves your HTML files

$request = $_SERVER['REQUEST_URI'];

// API routes go to api.php
if (strpos($request, '/api') === 0) {
    include 'api.php';
    exit;
}

// Serve HTML files
$file = __DIR__ . '/index.html';
if (file_exists($file)) {
    readfile($file);
} else {
    echo "Portfolio CMS is running!";
}
?>