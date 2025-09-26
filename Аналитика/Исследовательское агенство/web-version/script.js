// Глобальные переменные для веб-версии
let currentScreen = 'dashboard-screen';
let navigationHistory = [];
let currentResearcher = null;
let currentRequest = null;
let isSidebarOpen = true;

// Расширенные моковые данные для веб-версии
const mockData = {
    researchers: [
        {
            id: 1,
            name: 'Иван Петров',
            email: 'ivan.petrov@example.com',
            phone: '+7 (912) 345-67-89',
            specialization: 'Маркетинговые исследования',
            experience: 5,
            hourlyRate: 45,
            status: 'available',
            completedProjects: 12,
            rating: 4.8,
            skills: ['Анализ рынка', 'Опросы', 'Статистика'],
            availability: 'Полная занятость',
            joinDate: '2023-01-15'
        },
        {
            id: 2,
            name: 'Мария Сидорова',
            email: 'maria.sidorova@example.com',
            phone: '+7 (911) 123-45-67',
            specialization: 'Data Science',
            experience: 3,
            hourlyRate: 55,
            status: 'busy',
            completedProjects: 8,
            rating: 4.6,
            skills: ['Python', 'Machine Learning', 'SQL'],
            availability: 'Частичная занятость',
            joinDate: '2023-06-20'
        },
        {
            id: 3,
            name: 'Алексей Козлов',
            email: 'alexey.kozlov@example.com',
            phone: '+7 (999) 888-77-66',
            specialization: 'UX Research',
            experience: 7,
            hourlyRate: 60,
            status: 'available',
            completedProjects: 18,
            rating: 4.9,
            skills: ['User Testing', 'Wireframing', 'Analytics'],
            availability: 'Полная занятость',
            joinDate: '2022-03-10'
        },
        {
            id: 4,
            name: 'Елена Васнецова',
            email: 'elena.vasnetsova@example.com',
            phone: '+7 (977) 555-44-33',
            specialization: 'Бизнес-аналитика',
            experience: 4,
            hourlyRate: 50,
            status: 'on-vacation',
            completedProjects: 9,
            rating: 4.7,
            skills: ['Excel', 'Power BI', 'SQL'],
            availability: 'Частичная занятость',
            joinDate: '2023-09-05'
        }
    ],
    requests: [
        {
            id: 1,
            title: 'Маркетинговое исследование рынка',
            client: 'ТехноПро',
            specialization: 'Маркетинг',
            minExperience: 3,
            duration: 30,
            budget: 75000,
            priority: 'high',
            status: 'new',
            createdAt: '2024-01-22T10:00:00Z',
            description: 'Комплексное исследование рынка IT-услуг в регионе'
        },
        {
            id: 2,
            title: 'Анализ пользовательского поведения',
            client: 'Digital Solutions',
            specialization: 'UX Research',
            minExperience: 2,
            duration: 45,
            budget: 60000,
            priority: 'medium',
            status: 'new',
            createdAt: '2024-01-22T11:30:00Z',
            description: 'Исследование пользовательского опыта мобильного приложения'
        },
        {
            id: 3,
            title: 'Прогнозирование продаж',
            client: 'Retail Corp',
            specialization: 'Data Science',
            minExperience: 4,
            duration: 60,
            budget: 120000,
            priority: 'high',
            status: 'new',
            createdAt: '2024-01-23T09:15:00Z',
            description: 'Разработка модели прогнозирования продаж на основе исторических данных'
        }
    ],
    projects: [
        {
            id: 1,
            title: 'Исследование рынка FinTech',
            client: 'Банк "Стандарт"',
            researcher: 'Мария Сидорова',
            status: 'in-progress',
            startDate: '2024-01-15',
            endDate: '2024-02-15',
            budget: 75000,
            progress: 65,
            tasks: [
                { name: 'Сбор данных', completed: true },
                { name: 'Анализ конкурентов', completed: true },
                { name: 'Интервью с экспертами', completed: false },
                { name: 'Подготовка отчета', completed: false }
            ]
        },
        {
            id: 2,
            title: 'Анализ пользовательского опыта',
            client: 'Digital Solutions',
            researcher: 'Алексей Козлов',
            status: 'in-progress',
            startDate: '2024-01-20',
            endDate: '2024-03-01',
            budget: 60000,
            progress: 40,
            tasks: [
                { name: 'User Testing', completed: true },
                { name: 'Анализ метрик', completed: false },
                { name: 'Рекомендации', completed: false }
            ]
        }
    ],
    financialData: {
        monthlyRevenue: 156000,
        expenses: 89500,
        profit: 66500,
        profitability: 42.6,
        monthlyGrowth: [
            { month: 'Сент', revenue: 120000 },
            { month: 'Окт', revenue: 135000 },
            { month: 'Нояб', revenue: 142000 },
            { month: 'Дек', revenue: 148000 },
            { month: 'Янв', revenue: 156000 }
        ]
    }
};

// Инициализация веб-приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeWebApp();
});

function initializeWebApp() {
    // Инициализация навигации
    initializeNavigation();
    
    // Загрузка начальных данных
    loadMockData();
    
    // Установка начального экрана
    showScreen('dashboard-screen');
    
    // Обновление статистики
    updateDashboardStats();
    
    // Инициализация поиска
    initializeSearch();
    
    // Инициализация переключения меню
    initializeMenuToggle();
}

// Навигация между экранами
function showScreen(screenId) {
    // Добавляем текущий экран в историю
    if (currentScreen !== screenId) {
        navigationHistory.push(currentScreen);
    }
    
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        
        // Обновляем активный пункт меню
        updateActiveMenu(screenId);
        
        // Обновляем заголовок страницы
        updatePageTitle(screenId);
        
        // Загружаем данные для экрана
        loadScreenData(screenId);
    }
}

function updateActiveMenu(screenId) {
    // Убираем активный класс у всех пунктов меню
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Добавляем активный класс к текущему пункту
    const activeMenuItem = document.querySelector(`[data-screen="${screenId}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
}

function updatePageTitle(screenId) {
    const titles = {
        'dashboard-screen': 'Дашборд',
        'researchers-screen': 'Исследователи',
        'add-researcher-screen': 'Добавить исследователя',
        'requests-screen': 'Запросы клиентов',
        'projects-screen': 'Проекты',
        'time-tracking-screen': 'Учет времени',
        'clients-screen': 'Клиенты',
        'reports-screen': 'Отчеты',
        'researcher-details-screen': 'Детали исследователя'
    };
    
    document.querySelector('.page-title').textContent = titles[screenId] || 'Research Agency';
}

function goBack() {
    if (navigationHistory.length > 0) {
        const previousScreen = navigationHistory.pop();
        showScreen(previousScreen);
    } else {
        showScreen('dashboard-screen');
    }
}

// Инициализация навигации
function initializeNavigation() {
    // Обработчики для пунктов меню
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            if (screenId) {
                showScreen(screenId);
            }
        });
    });
}

// Инициализация переключения меню
function initializeMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            isSidebarOpen = !isSidebarOpen;
            
            // Анимация гамбургер-меню
            const spans = menuToggle.querySelectorAll('span');
            if (isSidebarOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// Инициализация поиска
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 2) {
                performSearch(searchTerm);
            } else {
                clearSearchResults();
            }
        });
    }
}

function performSearch(term) {
    // Поиск по исследователям
    const researcherResults = mockData.researchers.filter(researcher =>
        researcher.name.toLowerCase().includes(term) ||
        researcher.specialization.toLowerCase().includes(term) ||
        researcher.skills.some(skill => skill.toLowerCase().includes(term))
    );
    
    // Поиск по проектам
    const projectResults = mockData.projects.filter(project =>
        project.title.toLowerCase().includes(term) ||
        project.client.toLowerCase().includes(term)
    );
    
    // Поиск по запросам
    const requestResults = mockData.requests.filter(request =>
        request.title.toLowerCase().includes(term) ||
        request.client.toLowerCase().includes(term)
    );
    
    // Показываем результаты поиска
    showSearchResults({
        researchers: researcherResults,
        projects: projectResults,
        requests: requestResults
    });
}

function showSearchResults(results) {
    // В реальном приложении здесь будет отображение результатов поиска
    console.log('Результаты поиска:', results);
}

function clearSearchResults() {
    // Очистка результатов поиска
}

// Загрузка данных для экранов
function loadScreenData(screenId) {
    switch(screenId) {
        case 'researchers-screen':
            loadResearchersGrid();
            break;
        case 'requests-screen':
            loadRequestsGrid();
            break;
        case 'dashboard-screen':
            updateDashboardStats();
            loadDashboardCharts();
            break;
        case 'projects-screen':
            loadProjectsGrid();
            break;
    }
}

// Обновление статистики дашборда
function updateDashboardStats() {
    const stats = {
        researchers: mockData.researchers.length,
        activeProjects: mockData.projects.filter(p => p.status === 'in-progress').length,
        newRequests: mockData.requests.filter(r => r.status === 'new').length,
        monthlyRevenue: mockData.financialData.monthlyRevenue
    };
    
    // Обновляем большую карточку
    const largeStatCard = document.querySelector('.stat-card.large');
    if (largeStatCard) {
        largeStatCard.querySelector('.stat-value').textContent = stats.researchers;
    }
    
    // Обновляем остальные карточки
    const statCards = document.querySelectorAll('.stat-card:not(.large)');
    if (statCards.length >= 3) {
        statCards[0].querySelector('.stat-value').textContent = stats.activeProjects;
        statCards[1].querySelector('.stat-value').textContent = stats.newRequests;
        statCards[2].querySelector('.stat-value').textContent = formatCurrency(stats.monthlyRevenue);
    }
}

// Загрузка графиков дашборда
function loadDashboardCharts() {
    // Имитация загрузки данных для графиков
    setTimeout(() => {
        // Здесь будет логика для реальных графиков
        console.log('Графики загружены');
    }, 500);
}

// Управление исследователями
function loadResearchersGrid() {
    const researchersGrid = document.querySelector('.researchers-grid');
    if (!researchersGrid) return;
    
    researchersGrid.innerHTML = '';
    
    mockData.researchers.forEach(researcher => {
        const researcherCard = createResearcherCard(researcher);
        researchersGrid.appendChild(researcherCard);
    });
}

function createResearcherCard(researcher) {
    const card = document.createElement('div');
    card.className = 'researcher-card-web';
    
    const statusTexts = {
        'available': 'Свободен',
        'busy': 'Занят',
        'on-vacation': 'В отпуске'
    };
    
    const statusColors = {
        'available': '#28a745',
        'busy': '#dc3545',
        'on-vacation': '#ffc107'
    };
    
    card.innerHTML = `
        <div class="researcher-card-header">
            <div class="researcher-avatar-web">${getResearcherAvatar(researcher.name)}</div>
            <div class="researcher-basic-info">
                <h3>${escapeHtml(researcher.name)}</h3>
                <p>${escapeHtml(researcher.specialization)}</p>
                <span class="status-badge-web" style="background: ${statusColors[researcher.status]}">
                    ${statusTexts[researcher.status]}
                </span>
            </div>
        </div>
        <div class="researcher-details-web">
            <div class="detail-row">
                <span>Опыт:</span>
                <strong>${researcher.experience} лет</strong>
            </div>
            <div class="detail-row">
                <span>Ставка:</span>
                <strong>${researcher.hourlyRate}$/ч</strong>
            </div>
            <div class="detail-row">
                <span>Проектов:</span>
                <strong>${researcher.completedProjects}</strong>
            </div>
            <div class="detail-row">
                <span>Рейтинг:</span>
                <strong>${researcher.rating}/5</strong>
            </div>
        </div>
        <div class="researcher-skills">
            ${researcher.skills.slice(0, 3).map(skill => 
                `<span class="skill-tag">${escapeHtml(skill)}</span>`
            ).join('')}
        </div>
        <div class="researcher-actions-web">
            <button class="btn-primary btn-sm" onclick="showResearcherDetails(${researcher.id})">
                Подробнее
            </button>
            <button class="btn-secondary btn-sm" onclick="assignResearcher(${researcher.id})">
                Назначить
            </button>
        </div>
    `;
    
    // Добавляем стили для карточки
    card.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    `;
    
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    });
    
    return card;
}

function getResearcherAvatar(name) {
    const emojis = ['👨‍💼', '👩‍🔬', '👨‍🔬', '👩‍💻', '👨‍💻'];
    const index = name.length % emojis.length;
    return emojis[index];
}

function showResearcherDetails(researcherId) {
    const researcher = mockData.researchers.find(r => r.id === researcherId);
    if (researcher) {
        currentResearcher = researcher;
        // В реальном приложении здесь будет модальное окно или отдельный экран
        showSuccessMessage(`Детали исследователя: ${researcher.name}`);
    }
}

function assignResearcher(researcherId) {
    const researcher = mockData.researchers.find(r => r.id === researcherId);
    if (researcher) {
        showSuccessMessage(`Исследователь ${researcher.name} назначен на проект`);
    }
}

// Утилиты
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(amount);
}

function showSuccessMessage(message) {
    try {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `
            <div class="toast-icon">✅</div>
            <div class="toast-message">${escapeHtml(message)}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #d4edda;
            color: #155724;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
        
    } catch (error) {
        alert('✅ ' + message);
    }
}

function showError(message) {
    try {
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML = `
            <div class="toast-icon">❌</div>
            <div class="toast-message">${escapeHtml(message)}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #f8d7da;
            color: #721c24;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #dc3545;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
        
    } catch (error) {
        alert('❌ ' + message);
    }
}

function loadMockData() {
    console.log('Моковые данные загружены для веб-версии:', mockData);
}

// Функции для других экранов
function loadRequestsGrid() {
    // Загрузка сетки запросов
    console.log('Загрузка сетки запросов');
}

function loadProjectsGrid() {
    // Загрузка сетки проектов
    console.log('Загрузка сетки проектов');
}

function generateReport() {
    showSuccessMessage('Отчет сформирован и отправлен на email');
}

// Экспорт функций для глобального использования
window.showScreen = showScreen;
window.goBack = goBack;
window.showResearcherDetails = showResearcherDetails;
window.assignResearcher = assignResearcher;
window.generateReport = generateReport;