<?php
// test-neon.php
require_once 'neon-api.php';

// This will test if connection works
echo "Testing Neon connection...\n";
$pdo = getDBConnection();
if ($pdo) {
    echo "✅ Connected to Neon PostgreSQL!\n";
    $result = $pdo->query("SELECT version()")->fetch();
    echo "PostgreSQL version: " . $result['version'] . "\n";
} else {
    echo "❌ Connection failed\n";
}
?>