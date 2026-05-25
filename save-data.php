<?php
// save-data.php - File-based storage API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Data file path
$dataFile = __DIR__ . '/portfolio_data.json';

// Initialize data file if not exists
if (!file_exists($dataFile)) {
    $defaultData = [
        'portfolio_profile' => [
            'name' => 'Rahul Mahato',
            'title' => 'Full Stack Developer',
            'bio' => 'I\'m a web Designer with extensive experience for over 2 months.',
            'image' => './images/ME.jpeg',
            'cv' => 'cv/cv-3.docx',
            'email' => 'rm91275@gmail.com',
            'phone' => '+977 98XXXXXXXX',
            'address' => 'Kathmandu, Nepal'
        ],
        'portfolio_about' => [
            'mainText' => 'Full Stack Developer',
            'paragraphs' => [
                "I'm a Computer Science student at Techspire College in Kathmandu, Nepal.",
                "My journey in technology started with curiosity about how things work.",
                "When I'm not coding, you can find me exploring new design trends."
            ]
        ],
        'portfolio_services' => [
            ['id' => 1, 'icon' => 'bx bx-code', 'title' => 'Web Development', 'description' => 'Modern responsive websites.'],
            ['id' => 2, 'icon' => 'bx bx-crop', 'title' => 'UI/UX Design', 'description' => 'Beautiful interfaces.'],
            ['id' => 3, 'icon' => 'bx bxl-apple', 'title' => 'App Design', 'description' => 'Mobile-first design.']
        ],
        'portfolio_skills_technical' => [
            ['id' => 1, 'name' => 'HTML5', 'level' => 90, 'icon' => 'bx bxl-html5'],
            ['id' => 2, 'name' => 'CSS3', 'level' => 85, 'icon' => 'bx bxl-css3'],
            ['id' => 3, 'name' => 'JavaScript', 'level' => 80, 'icon' => 'bx bxl-javascript'],
            ['id' => 4, 'name' => 'React', 'level' => 75, 'icon' => 'bx bxl-react']
        ],
        'portfolio_skills_professional' => [
            ['id' => 1, 'name' => 'Creativity', 'level' => 90],
            ['id' => 2, 'name' => 'Communication', 'level' => 65],
            ['id' => 3, 'name' => 'Problem Solving', 'level' => 85],
            ['id' => 4, 'name' => 'Team Work', 'level' => 89]
        ],
        'portfolio_projects' => [
            ['id' => 1, 'title' => 'E-Commerce Dashboard', 'description' => 'Modern admin dashboard.', 'image' => 'images/E-comerce.png', 'technologies' => ['React', 'Node.js']],
            ['id' => 2, 'title' => 'Task Management App', 'description' => 'Collaborative task management.', 'image' => 'images/task-management.png', 'technologies' => ['Vue.js', 'Express']],
            ['id' => 3, 'title' => 'Portfolio Website', 'description' => 'Responsive portfolio website.', 'image' => 'images/website.png', 'technologies' => ['HTML', 'CSS', 'JS']]
        ],
        'portfolio_teamwork' => [
            ['id' => 1, 'title' => 'Open Source Contribution', 'description' => 'Collaborated with global developers.', 'image' => '', 'role' => 'Contributor'],
            ['id' => 2, 'title' => 'Hackathon Winner', 'description' => 'First place at college hackathon.', 'image' => '', 'role' => 'Team Lead']
        ],
        'contact_messages' => [],
        'website_visitors' => [],
        'admin_account' => [
            'email' => 'rm91275@gmail.com',
            'password' => 'Admin@123',
            'name' => 'Rahul Mahato'
        ],
        'last_updated' => date('Y-m-d H:i:s')
    ];
    file_put_contents($dataFile, json_encode($defaultData, JSON_PRETTY_PRINT));
}

// Read current data
function getData() {
    global $dataFile;
    $content = file_get_contents($dataFile);
    return json_decode($content, true);
}

// Save data
function saveData($data) {
    global $dataFile;
    $data['last_updated'] = date('Y-m-d H:i:s');
    return file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
}

// Get request path
$path = isset($_GET['path']) ? $_GET['path'] : '';
$method = $_SERVER['REQUEST_METHOD'];

switch($path) {
    case 'all':
        if ($method === 'GET') {
            echo json_encode(getData());
        } elseif ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            if (saveData($input)) {
                echo json_encode(['success' => true, 'message' => 'All data saved']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to save']);
            }
        }
        break;
        
    case 'section':
        if ($method === 'GET') {
            $section = isset($_GET['section']) ? $_GET['section'] : '';
            $data = getData();
            echo json_encode($data[$section] ?? []);
        } elseif ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $section = $input['section'];
            $value = $input['value'];
            $data = getData();
            $data[$section] = $value;
            if (saveData($data)) {
                echo json_encode(['success' => true, 'message' => "$section saved"]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to save']);
            }
        }
        break;
        
    case 'backup':
        if ($method === 'GET') {
            $data = getData();
            header('Content-Disposition: attachment; filename="portfolio_backup_' . date('Y-m-d') . '.json"');
            echo json_encode($data, JSON_PRETTY_PRINT);
        } elseif ($method === 'POST') {
            $input = file_get_contents('php://input');
            if (file_put_contents($dataFile, $input)) {
                echo json_encode(['success' => true, 'message' => 'Backup restored']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to restore']);
            }
        }
        break;
        
    case 'visitor':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $data = getData();
            $visitors = $data['website_visitors'] ?? [];
            $today = date('Y-m-d');
            $existingToday = false;
            foreach ($visitors as $v) {
                if ($v['date'] === $today) {
                    $existingToday = true;
                    break;
                }
            }
            if (!$existingToday) {
                $visitors[] = [
                    'id' => time(),
                    'ip' => $_SERVER['REMOTE_ADDR'],
                    'city' => $input['city'] ?? 'Unknown',
                    'country' => $input['country'] ?? 'Unknown',
                    'device' => $input['device'] ?? 'Desktop',
                    'browser' => $input['browser'] ?? 'Unknown',
                    'date' => $today,
                    'timestamp' => date('Y-m-d H:i:s')
                ];
                $data['website_visitors'] = $visitors;
                saveData($data);
            }
            echo json_encode(['success' => true]);
        } elseif ($method === 'GET') {
            $data = getData();
            $visitors = $data['website_visitors'] ?? [];
            $today = date('Y-m-d');
            $todayCount = 0;
            foreach ($visitors as $v) {
                if ($v['date'] === $today) $todayCount++;
            }
            echo json_encode([
                'total' => count($visitors),
                'today' => $todayCount,
                'recent' => array_slice(array_reverse($visitors), 0, 10)
            ]);
        }
        break;
        
    case 'contact':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $data = getData();
            $messages = $data['contact_messages'] ?? [];
            $messages[] = [
                'id' => time(),
                'name' => $input['name'],
                'email' => $input['email'],
                'message' => $input['message'],
                'date' => date('Y-m-d H:i:s')
            ];
            $data['contact_messages'] = $messages;
            saveData($data);
            echo json_encode(['success' => true]);
        } elseif ($method === 'GET') {
            $data = getData();
            echo json_encode($data['contact_messages'] ?? []);
        }
        break;
        
    case 'login':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $data = getData();
            $admin = $data['admin_account'] ?? [];
            if ($input['email'] === $admin['email'] && $input['password'] === $admin['password']) {
                echo json_encode(['success' => true, 'user' => ['name' => $admin['name'], 'email' => $admin['email']]]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
            }
        }
        break;
        
    case 'ping':
        echo json_encode(['status' => 'ok', 'timestamp' => date('Y-m-d H:i:s')]);
        break;
        
    default:
        echo json_encode([
            'status' => 'API Running',
            'endpoints' => ['all', 'section', 'backup', 'visitor', 'contact', 'login', 'ping'],
            'data_file' => $dataFile,
            'file_size' => file_exists($dataFile) ? filesize($dataFile) . ' bytes' : 'not found'
        ]);
}
?>