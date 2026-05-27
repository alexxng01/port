<?php
// neon-api.php - PostgreSQL connection for Neon
// File location: /Rahul Kumar Mahato/neon-api.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ==================== NEON POSTGRESQL CONFIGURATION ====================
// Load environment variables from .env file
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    foreach ($env as $key => $value) {
        putenv("$key=$value");
    }
}

// Neon Database Configuration (from .env)
$host     = getenv('NEON_HOST')     ?: 'ep-soft-star-aoog8ae5-pooler.c-2.ap-southeast-1.aws.neon.tech';
$port     = getenv('NEON_PORT')     ?: '5432';
$dbname   = getenv('NEON_DATABASE') ?: 'neondb';
$user     = getenv('NEON_USER')     ?: 'neondb_owner';
$password = getenv('NEON_PASSWORD') ?: '';

// ✅ FIX 1: Added sslmode=require (required by Neon)
$connectionString = "pgsql:host=$host;port=$port;dbname=$dbname;user=$user;password=$password;sslmode=require";

try {
    $pdo = new PDO($connectionString);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode([
        'error'   => 'Neon connection failed',
        'message' => $e->getMessage()
    ]));
}

$method = $_SERVER['REQUEST_METHOD'];
$path   = isset($_GET['path']) ? $_GET['path'] : '';

switch ($path) {
    case 'data':
        handleData($pdo, $method);
        break;
    case 'visitor':
        handleVisitor($pdo, $method);
        break;
    case 'contact':
        handleContact($pdo, $method);
        break;
    case 'login':
        handleLogin($pdo, $method);
        break;
    case 'backup':
        handleBackup($pdo, $method);
        break;
    case 'sync':
        handleSync($pdo, $method);
        break;
    case 'stats':
        handleStats($pdo, $method);
        break;
    case 'ping':
        echo json_encode([
            'status'    => 'ok',
            'database'  => $dbname,
            'host'      => $host,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        break;
    default:
        echo json_encode([
            'status'    => 'Neon PostgreSQL API Running',
            'endpoints' => ['data', 'visitor', 'contact', 'login', 'backup', 'sync', 'stats', 'ping'],
            'database'  => $dbname,
            'host'      => $host
        ]);
}

// ==================== HANDLER FUNCTIONS ====================

// ─── DATA ────────────────────────────────────────────────────────────────────
function handleData($pdo, $method) {
    if ($method === 'GET') {
        $key = isset($_GET['key']) ? $_GET['key'] : null;

        if ($key) {
            // Get single key
            $stmt = $pdo->prepare("SELECT data_key, data_value FROM portfolio_data WHERE data_key = :key");
            $stmt->execute(['key' => $key]);
            $row = $stmt->fetch();
            if ($row) {
                echo json_encode(json_decode($row['data_value'], true));
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Key not found']);
            }
        } else {
            // Get all portfolio data
            $stmt = $pdo->prepare("SELECT data_key, data_value FROM portfolio_data ORDER BY data_key");
            $stmt->execute();
            $result = $stmt->fetchAll();

            $data = [];
            foreach ($result as $row) {
                $data[$row['data_key']] = json_decode($row['data_value'], true);
            }
            echo json_encode($data);
        }

    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['key']) || !isset($input['value'])) {
            http_response_code(400);
            echo json_encode(['error' => 'key and value are required']);
            return;
        }

        $key   = $input['key'];
        $value = json_encode($input['value']);

        // ✅ FIX 2: Proper upsert for PostgreSQL
        $stmt = $pdo->prepare("
            INSERT INTO portfolio_data (data_key, data_value, updated_at, created_at)
            VALUES (:key, :value, NOW(), NOW())
            ON CONFLICT (data_key)
            DO UPDATE SET data_value = EXCLUDED.data_value, updated_at = NOW()
        ");
        $stmt->execute(['key' => $key, 'value' => $value]);

        echo json_encode(['success' => true, 'message' => 'Data saved to Neon PostgreSQL', 'key' => $key]);

    } elseif ($method === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['key'])) {
            http_response_code(400);
            echo json_encode(['error' => 'key is required']);
            return;
        }

        $stmt = $pdo->prepare("DELETE FROM portfolio_data WHERE data_key = :key");
        $stmt->execute(['key' => $input['key']]);

        echo json_encode(['success' => true, 'message' => "Data deleted: {$input['key']}"]);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

// ─── VISITOR ─────────────────────────────────────────────────────────────────
function handleVisitor($pdo, $method) {
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $today = date('Y-m-d');
        $ip    = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

        // Check if already counted today from same IP
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM visitors WHERE visit_date = :date AND ip_address = :ip");
        $stmt->execute(['date' => $today, 'ip' => $ip]);
        $count = (int)$stmt->fetchColumn();

        if ($count === 0) {
            $stmt = $pdo->prepare("
                INSERT INTO visitors (ip_address, city, country, device_type, browser, visit_date, visit_time)
                VALUES (:ip, :city, :country, :device, :browser, :date, NOW())
            ");
            $stmt->execute([
                'ip'      => $ip,
                'city'    => $input['city']    ?? 'Unknown',
                'country' => $input['country'] ?? 'Unknown',
                'device'  => $input['device']  ?? 'Desktop',
                'browser' => $input['browser'] ?? 'Unknown',
                'date'    => $today
            ]);
        }

        // ✅ FIX 3: Properly fetch total and today counts
        $totalStmt = $pdo->query("SELECT COUNT(*) FROM visitors");
        $total     = (int)$totalStmt->fetchColumn();

        $todayStmt = $pdo->prepare("SELECT COUNT(*) FROM visitors WHERE visit_date = :date");
        $todayStmt->execute(['date' => $today]);
        $todayCount = (int)$todayStmt->fetchColumn();

        $recentStmt = $pdo->query("SELECT city, country, device_type, visit_time FROM visitors ORDER BY id DESC LIMIT 10");
        $recent     = $recentStmt->fetchAll();

        echo json_encode([
            'success' => true,
            'total'   => $total,
            'today'   => $todayCount,
            'recent'  => $recent
        ]);

    } elseif ($method === 'GET') {
        $today = date('Y-m-d');

        $totalStmt = $pdo->query("SELECT COUNT(*) FROM visitors");
        $total     = (int)$totalStmt->fetchColumn();

        // ✅ FIX 4: Use CURRENT_DATE instead of MySQL's CURDATE()
        $todayStmt = $pdo->prepare("SELECT COUNT(*) FROM visitors WHERE visit_date = CURRENT_DATE");
        $todayStmt->execute();
        $todayCount = (int)$todayStmt->fetchColumn();

        $recentStmt = $pdo->query("SELECT * FROM visitors ORDER BY id DESC LIMIT 20");
        $recent     = $recentStmt->fetchAll();

        echo json_encode([
            'total'  => $total,
            'today'  => $todayCount,
            'recent' => $recent
        ]);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function handleContact($pdo, $method) {
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['name'], $input['email'], $input['message'])) {
            http_response_code(400);
            echo json_encode(['error' => 'name, email and message are required']);
            return;
        }

        $stmt = $pdo->prepare("
            INSERT INTO contact_messages (name, email, message, created_at)
            VALUES (:name, :email, :message, NOW())
        ");
        $stmt->execute([
            'name'    => htmlspecialchars($input['name']),
            'email'   => filter_var($input['email'], FILTER_SANITIZE_EMAIL),
            'message' => htmlspecialchars($input['message'])
        ]);

        echo json_encode(['success' => true, 'message' => 'Message saved to Neon']);

    } elseif ($method === 'GET') {
        $stmt     = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        $messages = $stmt->fetchAll();

        // Mark all as read
        $pdo->query("UPDATE contact_messages SET is_read = TRUE WHERE is_read = FALSE");

        echo json_encode($messages);

    } elseif ($method === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'id is required']);
            return;
        }

        $stmt = $pdo->prepare("DELETE FROM contact_messages WHERE id = :id");
        $stmt->execute(['id' => (int)$input['id']]);

        echo json_encode(['success' => true, 'message' => 'Message deleted']);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function handleLogin($pdo, $method) {
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['email'], $input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'email and password are required']);
            return;
        }

        $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE email = :email");
        $stmt->execute(['email' => $input['email']]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
            return;
        }

        // ✅ FIX 5: Support both plain text (legacy) and bcrypt hashed passwords
        $passwordValid = false;
        if (strpos($user['password'], '$2y$') === 0) {
            // Bcrypt hashed password
            $passwordValid = password_verify($input['password'], $user['password']);
        } else {
            // Plain text (legacy - should be updated)
            $passwordValid = ($input['password'] === $user['password']);
        }

        if ($passwordValid) {
            // Update last login
            $updateStmt = $pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = :id");
            $updateStmt->execute(['id' => $user['id']]);

            echo json_encode([
                'success' => true,
                'user'    => [
                    'id'    => $user['id'],
                    'name'  => $user['name'],
                    'email' => $user['email'],
                    'role'  => $user['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }

    } elseif ($method === 'PUT') {
        // Update admin password
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['email'], $input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'email and password are required']);
            return;
        }

        // ✅ Hash the new password with bcrypt
        $hashedPassword = password_hash($input['password'], PASSWORD_BCRYPT);

        $stmt = $pdo->prepare("UPDATE admin_users SET password = :password WHERE email = :email");
        $stmt->execute(['password' => $hashedPassword, 'email' => $input['email']]);

        echo json_encode(['success' => true, 'message' => 'Password updated and hashed']);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

// ─── BACKUP ──────────────────────────────────────────────────────────────────
function handleBackup($pdo, $method) {
    if ($method === 'GET') {
        $tables = ['portfolio_data', 'visitors', 'contact_messages'];
        $backup = [
            'exported_at' => date('Y-m-d H:i:s'),
            'database'    => 'Neon PostgreSQL',
            'data'        => []
        ];

        foreach ($tables as $table) {
            $stmt                      = $pdo->query("SELECT * FROM $table");
            $backup['data'][$table]    = $stmt->fetchAll();
        }

        header('Content-Disposition: attachment; filename="neon_backup_' . date('Y-m-d') . '.json"');
        echo json_encode($backup, JSON_PRETTY_PRINT);

    } elseif ($method === 'POST') {
        $input  = file_get_contents('php://input');
        $backup = json_decode($input, true);

        if (!isset($backup['data'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid backup file']);
            return;
        }

        $pdo->beginTransaction();
        try {
            if (isset($backup['data']['portfolio_data'])) {
                $pdo->query("TRUNCATE portfolio_data RESTART IDENTITY CASCADE");
                foreach ($backup['data']['portfolio_data'] as $row) {
                    $stmt = $pdo->prepare("
                        INSERT INTO portfolio_data (data_key, data_value, updated_at, created_at)
                        VALUES (:key, :value, :updated, :created)
                    ");
                    $stmt->execute([
                        'key'     => $row['data_key'],
                        'value'   => $row['data_value'],
                        'updated' => $row['updated_at'],
                        'created' => $row['created_at'] ?? $row['updated_at']
                    ]);
                }
            }
            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Backup restored successfully']);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Restore failed: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

// ─── SYNC ────────────────────────────────────────────────────────────────────
function handleSync($pdo, $method) {
    if ($method === 'POST') {
        $input  = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';

        if ($action === 'local_to_neon') {
            $data  = $input['data'] ?? [];
            $count = 0;

            $pdo->beginTransaction();
            try {
                foreach ($data as $key => $value) {
                    $stmt = $pdo->prepare("
                        INSERT INTO portfolio_data (data_key, data_value, updated_at, created_at)
                        VALUES (:key, :value, NOW(), NOW())
                        ON CONFLICT (data_key)
                        DO UPDATE SET data_value = EXCLUDED.data_value, updated_at = NOW()
                    ");
                    $stmt->execute(['key' => $key, 'value' => json_encode($value)]);
                    $count++;
                }
                $pdo->commit();
                echo json_encode(['success' => true, 'synced' => $count, 'message' => "Synced $count items to Neon"]);
            } catch (Exception $e) {
                $pdo->rollBack();
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Sync failed: ' . $e->getMessage()]);
            }

        } elseif ($action === 'neon_to_local') {
            $stmt   = $pdo->query("SELECT data_key, data_value FROM portfolio_data ORDER BY data_key");
            $result = $stmt->fetchAll();

            $data = [];
            foreach ($result as $row) {
                $data[$row['data_key']] = json_decode($row['data_value'], true);
            }

            echo json_encode(['success' => true, 'data' => $data, 'count' => count($data)]);

        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid sync action. Use local_to_neon or neon_to_local']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

// ─── STATS ───────────────────────────────────────────────────────────────────
function handleStats($pdo, $method) {
    if ($method === 'GET') {
        $today = date('Y-m-d');

        // Total visitors
        $stats['total_visitors'] = (int)$pdo->query("SELECT COUNT(*) FROM visitors")->fetchColumn();

        // ✅ FIX 6: Use CURRENT_DATE (PostgreSQL) not CURDATE() (MySQL)
        $todayStmt = $pdo->prepare("SELECT COUNT(*) FROM visitors WHERE visit_date = CURRENT_DATE");
        $todayStmt->execute();
        $stats['today_visitors'] = (int)$todayStmt->fetchColumn();

        // Total messages
        $stats['total_messages'] = (int)$pdo->query("SELECT COUNT(*) FROM contact_messages")->fetchColumn();

        // Unread messages
        $stats['unread_messages'] = (int)$pdo->query("SELECT COUNT(*) FROM contact_messages WHERE is_read = FALSE")->fetchColumn();

        // Total portfolio sections
        $stats['total_sections'] = (int)$pdo->query("SELECT COUNT(*) FROM portfolio_data")->fetchColumn();

        // Last updated
        $stats['last_updated'] = $pdo->query("SELECT MAX(updated_at) FROM portfolio_data")->fetchColumn();

        // Visitors by country (top 5)
        $countryStmt             = $pdo->query("SELECT country, COUNT(*) as count FROM visitors GROUP BY country ORDER BY count DESC LIMIT 5");
        $stats['top_countries']  = $countryStmt->fetchAll();

        // Visitors by device
        $deviceStmt              = $pdo->query("SELECT device_type, COUNT(*) as count FROM visitors GROUP BY device_type ORDER BY count DESC");
        $stats['devices']        = $deviceStmt->fetchAll();

        // Last 7 days visitors
        $weekStmt = $pdo->query("
            SELECT visit_date, COUNT(*) as count 
            FROM visitors 
            WHERE visit_date >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY visit_date 
            ORDER BY visit_date ASC
        ");
        $stats['last_7_days'] = $weekStmt->fetchAll();

        echo json_encode($stats);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}
?>