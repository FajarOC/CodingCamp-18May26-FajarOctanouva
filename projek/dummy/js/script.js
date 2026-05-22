// ==========================================================================
//   LOGIKA JAVASCRIPT: NORDIC EMERALD DASHBOARD (Fajar)
// ==========================================================================

// --- 1. THEME SWITCHER (Dark/Light Mode) ---
const themeBtn = document.getElementById('theme-toggle-btn');
const body = document.body;

// Cek tema yang tersimpan
if (localStorage.getItem('emerald_theme') === 'dark') {
    body.classList.add('dark-mode');
    themeBtn.textContent = '☀️ Light Mode';
}

themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('emerald_theme', 'dark');
        themeBtn.textContent = '☀️ Light Mode';
    } else {
        localStorage.setItem('emerald_theme', 'light');
        themeBtn.textContent = '🌙 Dark Mode';
    }
});

// --- 2. LIVE CLOCK & DATE ---
const timeDisplay = document.getElementById('time-text');
const dateDisplay = document.getElementById('date-text');

function updateTime() {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
    dateDisplay.textContent = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateTime, 1000);
updateTime(); // Panggil sekali agar tidak delay 1 detik di awal

// --- 3. GREETING NAME ---
const nameInput = document.getElementById('name-input');
const savedName = localStorage.getItem('emerald_name');
if (savedName) nameInput.value = savedName;

nameInput.addEventListener('input', (e) => {
    localStorage.setItem('emerald_name', e.target.value);
});

// --- 4. TO-DO LIST (Dengan Fitur Counter & Placeholder Acak) ---
const todoInput = document.getElementById('todo-input');
const btnAddTodo = document.getElementById('btn-add-todo');
const btnClearAll = document.getElementById('btn-clear-all');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');

let tasks = JSON.parse(localStorage.getItem('emerald_tasks')) || [];

// Fitur Eksklusif 1: Placeholder teks acak
const placeholders = [
    "Membaca buku 10 halaman...",
    "Olahraga sore hari...",
    "Belajar framework baru...",
    "Membalas email kerjaan...",
    "Rapihkan folder laptop..."
];
function randomizePlaceholder() {
    const randomText = placeholders[Math.floor(Math.random() * placeholders.length)];
    todoInput.setAttribute('placeholder', randomText);
}
randomizePlaceholder(); 

function saveAndRenderTasks() {
    localStorage.setItem('emerald_tasks', JSON.stringify(tasks));
    taskList.innerHTML = '';
    
    let activeCount = 0; // Hitung tugas yang belum selesai

    tasks.forEach((task, index) => {
        if (!task.completed) activeCount++;

        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-checkbox-wrapper" onclick="toggleTask(${index})">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
            </div>
            <button class="btn-delete-task" onclick="deleteTask(${index})" title="Hapus tugas">✕</button>
        `;
        taskList.appendChild(li);
    });

    // Update badge angka
    taskCounter.textContent = `(${activeCount})`;
}

function addTask() {
    const text = todoInput.value.trim();
    if (text) {
        tasks.push({ text: text, completed: false });
        todoInput.value = '';
        randomizePlaceholder(); // Acak ulang teks setelah input
        saveAndRenderTasks();
    }
}

window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRenderTasks();
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveAndRenderTasks();
};

btnAddTodo.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

btnClearAll.addEventListener('click', () => {
    if(confirm('Hapus semua tugas dari daftar?')) {
        tasks = [];
        saveAndRenderTasks();
    }
});

saveAndRenderTasks(); // Render awal

// --- 5. FOCUS TIMER (Dengan Animasi Glow) ---
const timerDisplay = document.getElementById('timer-display');
const btnTimerStart = document.getElementById('btn-timer-start');
const btnTimerReset = document.getElementById('btn-timer-reset');

const WORK_TIME = 25 * 60; // 25 menit
let timeLeft = WORK_TIME;
let timerInterval = null;
let isRunning = false;

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        btnTimerStart.textContent = 'Start';
        btnTimerStart.classList.replace('btn-secondary', 'btn-success');
        timerDisplay.classList.remove('active-glow'); // Matikan efek glow
    } else {
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                alert("Waktu fokus selesai! Istirahatlah sejenak.");
                resetTimer();
            }
        }, 1000);
        btnTimerStart.textContent = 'Pause';
        btnTimerStart.classList.replace('btn-success', 'btn-secondary');
        timerDisplay.classList.add('active-glow'); // Aktifkan efek glow saat berjalan
    }
    isRunning = !isRunning;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = WORK_TIME;
    updateTimerDisplay();
    btnTimerStart.textContent = 'Start';
    btnTimerStart.classList.replace('btn-secondary', 'btn-success');
    timerDisplay.classList.remove('active-glow');
}

btnTimerStart.addEventListener('click', toggleTimer);
btnTimerReset.addEventListener('click', resetTimer);
updateTimerDisplay();

// --- 6. QUICK LINKS SHORTCUTS ---
const linkNameInput = document.getElementById('link-name-input');
const linkUrlInput = document.getElementById('link-url-input');
const btnAddLink = document.getElementById('btn-add-link');
const linksContainer = document.getElementById('links-container');

let links = JSON.parse(localStorage.getItem('emerald_links')) || [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'ChatGPT', url: 'https://chat.openai.com' }
];

function saveAndRenderLinks() {
    localStorage.setItem('emerald_links', JSON.stringify(links));
    linksContainer.innerHTML = '';

    links.forEach((link, index) => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'link-tag';
        
        a.innerHTML = `
            ${link.name} 
            <button class="btn-delete-link" onclick="deleteLink(event, ${index})" title="Hapus link">✕</button>
        `;
        linksContainer.appendChild(a);
    });
}

function addLink() {
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();

    if (name && url) {
        // Otomatis tambahkan https:// jika belum ada
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        links.push({ name, url });
        linkNameInput.value = '';
        linkUrlInput.value = '';
        saveAndRenderLinks();
    } else {
        alert('Masukkan nama situs dan URL dengan lengkap!');
    }
}

// Gunakan window.deleteLink agar fungsi bisa diakses oleh onclick di HTML
window.deleteLink = function(event, index) {
    event.preventDefault(); // Mencegah link terbuka saat menekan tombol silang
    links.splice(index, 1);
    saveAndRenderLinks();
};

btnAddLink.addEventListener('click', addLink);
saveAndRenderLinks();