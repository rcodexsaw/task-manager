const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const pendingContainer = document.getElementById('pending-container');
const completedContainer = document.getElementById('completed-container');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');
const clearAllBtn = document.getElementById('clear-all-btn');

// Array to sync with LocalStorage
let tasksArray = JSON.parse(localStorage.getItem('tasks_data')) || [];

// 2. Demonstration Required: Attributes vs Properties
console.log("Initial Attribute 'value':", taskInput.getAttribute("value"));
console.log("Live Property 'value' reference loaded.");

// Form Submission handling
taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = taskInput.value.trim();
    const category = taskCategory.value;
    const dueDate = document.getElementById('task-date').value || new Date().toISOString().split('T')[0];

    if (!title) return;

    const taskObj = {
        id: 'task-' + Date.now(),
        title: title,
        category: category,
        date: dueDate,
        status: 'pending'
    };

    tasksArray.push(taskObj);
    saveAndRender();

    taskInput.value = '';
    endCountUpdater();
});

// --- CORE METHOD: USING DOCUMENT FRAGMENT FOR RENDERING ---
function renderTasks(arrayToRender = tasksArray) {
    // Containers को क्लियर करना
    pendingContainer.innerHTML = '';
    completedContainer.innerHTML = '';

    // Create Document Fragments (Bonus Target Optimization)
    const pendingFragment = document.createDocumentFragment();
    const completedFragment = document.createDocumentFragment();

    arrayToRender.forEach(task => {
        // Element Creation
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.setAttribute('data-id', task.id);
        taskCard.setAttribute('data-category', task.category);
        taskCard.setAttribute('data-status', task.status);

        const formattedDate = new Date(task.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric'
        });

        taskCard.innerHTML = `
            <div class="task-details">
                <span class="task-title-text">${task.title}</span>
                <div class="task-sub-meta">
                    <span class="badge ${task.category.toLowerCase()}">${task.category}</span>
                    <span class="date-string">📅 ${formattedDate}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-btn">Edit</button>
                <button class="complete-btn">✓</button>
                <button class="delete-btn">✕</button>
            </div>
        `;

        // Distribute nodes to respective fragments
        if (task.status === 'pending') {
            pendingFragment.appendChild(taskCard);
        } else {
            completedFragment.appendChild(taskCard);
        }
    });

    // Only 2 Repaints onto DOM Tree instead of heavy individual layout reflows
    pendingContainer.appendChild(pendingFragment);
    completedContainer.appendChild(completedFragment);

    updateCounters();
}

// --- 6. Event Delegation on Columns ---
const handleActions = function (e) {
    const target = e.target;
    const card = target.closest('.task-card');
    if (!card) return;

    const id = card.getAttribute('data-id');
    const taskIndex = tasksArray.findIndex(t => t.id === id);

    if (target.classList.contains('delete-btn')) {
        tasksArray.splice(taskIndex, 1);
        saveAndRender();
    }

    if (target.classList.contains('complete-btn')) {
        tasksArray[taskIndex].status = 'completed';
        saveAndRender();
    }

    if (target.classList.contains('edit-btn')) {
        const titleNode = card.querySelector('.task-title-text');
        const oldText = titleNode.textContent;

        const editDiv = document.createElement('div');
        editDiv.className = 'edit-mode-container';
        editDiv.innerHTML = `
            <input type="text" class="edit-input" value="${oldText}">
            <button class="save-btn">Save</button>
        `;

        titleNode.style.display = 'none';
        card.querySelector('.task-details').prepend(editDiv);

        editDiv.querySelector('.save-btn').addEventListener('click', function () {
            const updatedText = editDiv.querySelector('.edit-input').value.trim();
            if (updatedText) {
                tasksArray[taskIndex].title = updatedText;
                saveAndRender();
            }
        });
    }
};

pendingContainer.addEventListener('click', handleActions);
completedContainer.addEventListener('click', handleActions);

// --- LocalStorage & Counters ---
function saveAndRender() {
    localStorage.setItem('tasks_data', JSON.stringify(tasksArray));
    renderTasks();
}

function updateCounters() {
    pendingCount.textContent = pendingContainer.childElementCount;
    completedCount.textContent = completedContainer.childElementCount;
}

// Clear All
clearAllBtn.addEventListener('click', function () {
    tasksArray = [];
    saveAndRender();
});

// --- Search & Filter Architecture ---
function filterEngine() {
    const searchVal = searchInput.value.toLowerCase();
    const catVal = filterCategory.value;

    const filtered = tasksArray.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchVal);
        const matchesCat = (catVal === 'all' || task.category === catVal);
        return matchesSearch && matchesCat;
    });

    renderTasks(filtered);
}
searchInput.addEventListener('input', filterEngine);
filterCategory.addEventListener('change', filterEngine);

// --- 4. Theme Toggle Implementation ---
themeToggleBtn.addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
});
