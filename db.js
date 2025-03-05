const DB_NAME = "tasksDB";
const STORE_NAME = "tasks";
const DB_VERSION = 1;

// Open IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function () {
            reject("Failed to open IndexedDB.");
        };
    });
}

// Save task to IndexedDB
async function saveTask(task) {
    let db = await openDB();
    let transaction = db.transaction(STORE_NAME, "readwrite");
    let store = transaction.objectStore(STORE_NAME);
    store.add(task);
}

// Retrieve tasks from IndexedDB
async function getTasks() {
    let db = await openDB();
    let transaction = db.transaction(STORE_NAME, "readonly");
    let store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
        let request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Failed to retrieve tasks.");
    });
}

// Remove task from IndexedDB
async function removeTask(id) {
    let db = await openDB();
    let transaction = db.transaction(STORE_NAME, "readwrite");
    let store = transaction.objectStore(STORE_NAME);
    store.delete(id);
}
