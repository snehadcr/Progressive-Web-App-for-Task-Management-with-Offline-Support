document.addEventListener("DOMContentLoaded", loadTasks);

async function addTask() {
    let taskInput = document.getElementById("taskInput");
    
    if (!taskInput || !(taskInput instanceof HTMLInputElement)) {
        console.error("taskInput element not found or is not an input field");
        return;
    }

    let taskText = taskInput.value.trim();
    if (taskText === "") return;

    let task = { id: Date.now() + Math.random(), text: taskText };

    try {
        await saveTask(task);  // Save task to IndexedDB
        renderTask(task);  // Display task in UI
        taskInput.value = ""; // Reset input field
    } catch (error) {
        console.error("Error saving task:", error);
    }
}

async function loadTasks() {
    try {
        let tasks = await getTasks(); // Retrieve tasks from IndexedDB
        console.log("Loaded Tasks:", tasks);

        if (!Array.isArray(tasks) || tasks.length === 0) {
            console.warn("No tasks found.");
            return;
        }

        let ul = document.getElementById("taskList");
        if (!ul) {
            console.error("taskList element not found");
            return;
        }

        ul.innerHTML = ""; // Clear previous content
        tasks.forEach(renderTask);
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

function renderTask(task) {
    let ul = document.getElementById("taskList");
    if (!ul) {
        console.error("taskList element not found");
        return;
    }

    let li = document.createElement("li");
    li.innerHTML = `${task.text} <button class="delete" onclick="deleteTask(${task.id})">Delete</button>`;
    li.setAttribute("data-id", task.id);
    ul.appendChild(li);
}

async function deleteTask(id) {
    try {
        await removeTask(id);  // Remove from IndexedDB

        let taskElement = document.querySelector(`li[data-id='${id}']`);
        if (taskElement) {
            taskElement.remove();  // Remove from UI
        } else {
            console.error("Task element not found for id:", id);
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}
