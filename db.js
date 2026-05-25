// db.js - IndexedDB Database for Portfolio Data

const DB_NAME = 'PortfolioDB';
const DB_VERSION = 1;
const STORE_NAME = 'portfolioData';

// Open database connection
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
                store.createIndex('key', 'key', { unique: true });
                store.createIndex('timestamp', 'timestamp');
            }
        };
    });
}

// Save all data to IndexedDB
async function saveAllToDB() {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Get all data from localStorage
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allData[key] = localStorage.getItem(key);
    }
    
    // Add metadata
    allData['_backup_timestamp'] = new Date().toISOString();
    allData['_backup_version'] = DB_VERSION;
    
    // Save to IndexedDB
    return new Promise((resolve, reject) => {
        const request = store.put({ key: 'portfolio_backup', data: allData, timestamp: Date.now() });
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

// Load all data from IndexedDB to localStorage
async function loadAllFromDB() {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
        const request = store.get('portfolio_backup');
        request.onsuccess = () => {
            if (request.result && request.result.data) {
                const data = request.result.data;
                for (const [key, value] of Object.entries(data)) {
                    if (!key.startsWith('_')) {
                        localStorage.setItem(key, value);
                    }
                }
                resolve(true);
            } else {
                resolve(false);
            }
        };
        request.onerror = () => reject(request.error);
    });
}

// Get all backups history
async function getBackupHistory() {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    
    return new Promise((resolve, reject) => {
        const backups = [];
        const request = index.openCursor();
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                backups.push({
                    key: cursor.value.key,
                    timestamp: cursor.value.timestamp,
                    date: new Date(cursor.value.timestamp).toLocaleString()
                });
                cursor.continue();
            } else {
                resolve(backups);
            }
        };
        request.onerror = () => reject(request.error);
    });
}

// Auto backup function
async function autoBackupToDB() {
    try {
        await saveAllToDB();
        console.log('✅ Auto-backup saved to IndexedDB at:', new Date().toLocaleString());
    } catch (error) {
        console.error('Auto-backup failed:', error);
    }
}

// Check and restore on page load
async function checkAndRestore() {
    const lastBackup = localStorage.getItem('_last_db_restore');
    const now = Date.now();
    
    // Restore if no data or if it's been more than 7 days
    if (!lastBackup || (now - parseInt(lastBackup) > 7 * 24 * 60 * 60 * 1000)) {
        const restored = await loadAllFromDB();
        if (restored) {
            localStorage.setItem('_last_db_restore', now.toString());
            console.log('✅ Data restored from IndexedDB backup');
            return true;
        }
    }
    return false;
}

// Export IndexedDB data to JSON file
async function exportDBToJSON() {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
        const allData = [];
        const request = store.openCursor();
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                allData.push(cursor.value);
                cursor.continue();
            } else {
                const exportData = {
                    exportDate: new Date().toISOString(),
                    version: DB_VERSION,
                    backups: allData
                };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `portfolio_db_backup_${new Date().toISOString().slice(0,19)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                resolve(true);
            }
        };
        request.onerror = () => reject(request.error);
    });
}

// Import JSON file to IndexedDB
async function importJSONToDB(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const db = await openDB();
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                
                for (const backup of data.backups) {
                    await new Promise((res, rej) => {
                        const request = store.put(backup);
                        request.onsuccess = () => res();
                        request.onerror = () => rej(request.error);
                    });
                }
                resolve(true);
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsText(file);
    });
}

// Clear all IndexedDB data
async function clearDB() {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

// Run auto-backup every hour
setInterval(autoBackupToDB, 60 * 60 * 1000);

// Run on page load
window.addEventListener('load', () => {
    setTimeout(checkAndRestore, 1000);
});