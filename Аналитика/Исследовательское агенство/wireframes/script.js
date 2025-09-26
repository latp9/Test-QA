// Глобальные переменные
let currentScreen = 'dashboard-screen';
let navigationHistory = [];
let currentResearcher = null;
let currentRequest = null;

// Моковые данные
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
            rating: 4.8
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
            rating: 4.6
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
            rating: 4.9
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
            priority: 'high',
            status: 'new',
            createdAt: '2024-01-22T10:00:00Z'
        },
        {
            id: 2,
            title: 'Анализ пользовательского поведения',
            client: 'Digital Solutions',
            specialization: 'UX Research',
            minExperience: 2,
            duration: 45,
            priority: 'medium',
            status: 'new',
            createdAt: '2024-01-22T11:30:00Z'
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
            budget: 75000
        }
    ]
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Загрузка начальных данных
    loadMockData();
    
    // Установка начального экрана
    showScreen('dashboard-screen');
    
    // Обновление статистики
    updateDashboardStats();
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
        
        // Обновляем заголовок
        updateHeaderTitle(screenId);
        
        // Загружаем данные для экрана
        loadScreenData(screenId);
    }
}

function goBack() {
    if (navigationHistory.length > 0) {
        const previousScreen = navigationHistory.pop();
        showScreen(previousScreen);
    } else {
        showScreen('dashboard-screen');
    }
}

function updateHeaderTitle(screenId) {
    const titles = {
        'dashboard-screen': 'Главная',
        'researchers-screen': 'Исследователи',
        'add-researcher-screen': 'Добавить исследователя',
        'requests-screen': 'Запросы клиентов',
        'projects-screen': 'Проекты',
        'time-tracking-screen': 'Учет времени',
        'clients-screen': 'Клиенты',
        'reports-screen': 'Отчеты',
        'researcher-details-screen': 'Детали исследователя'
    };
    
    document.querySelector('.header-title').textContent = titles[screenId] || 'Research Agency';
}

function loadScreenData(screenId) {
    switch(screenId) {
        case 'researchers-screen':
            loadResearchersList();
            break;
        case 'requests-screen':
            loadRequestsList();
            break;
        case 'dashboard-screen':
            updateDashboardStats();
            break;
    }
}

// Загрузка моковых данных
function loadMockData() {
    // Данные уже загружены в mockData
    console.log('Моковые данные загружены:', mockData);
}

// Обновление статистики дашборда
function updateDashboardStats() {
    const stats = {
        researchers: mockData.researchers.length,
        activeProjects: mockData.projects.filter(p => p.status === 'in-progress').length,
        newRequests: mockData.requests.filter(r => r.status === 'new').length,
        monthlyRevenue: 156000
    };
    
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = stats.researchers;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = stats.activeProjects;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = stats.newRequests;
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = formatCurrency(stats.monthlyRevenue);
}

// Управление исследователями
function loadResearchersList() {
    const researchersList = document.querySelector('.researchers-list');
    if (!researchersList) return;
    
    researchersList.innerHTML = '';
    
    mockData.researchers.forEach(researcher => {
        const researcherCard = createResearcherCard(researcher);
        researchersList.appendChild(researcherCard);
    });
}

function createResearcherCard(researcher) {
    const card = document.createElement('div');
    card.className = 'researcher-card';
    
    // Безопасное создание HTML с экранированием
    const avatar = getResearcherAvatar(researcher.name);
    const name = escapeHtml(researcher.name);
    const specialization = escapeHtml(researcher.specialization);
    const status = escapeHtml(getStatusText(researcher.status));
    
    card.innerHTML = `
        <div class="researcher-avatar">${avatar}</div>
        <div class="researcher-info">
            <h3>${name}</h3>
            <p>${specialization}</p>
            <div class="researcher-details">
                <span class="experience">Опыт: ${researcher.experience} лет</span>
                <span class="rate">Ставка: ${researcher.hourlyRate}$/ч</span>
                <span class="status ${researcher.status}">${status}</span>
            </div>
        </div>
        <button class="btn-secondary" onclick="showResearcherDetails(${researcher.id})">Подробнее</button>
    `;
    
    return card;
}

function getResearcherAvatar(name) {
    // Простая эмоджи на основе имени
    const emojis = ['👨‍💼', '👩‍🔬', '👨‍🔬', '👩‍💻', '👨‍💻'];
    const index = name.length % emojis.length;
    return emojis[index];
}

function getStatusText(status) {
    const statusTexts = {
        'available': 'Свободен',
        'busy': 'Занят',
        'on-vacation': 'В отпуске'
    };
    return statusTexts[status] || status;
}

function showResearcherDetails(researcherId) {
    try {
        const researcher = mockData.researchers.find(r => r.id === researcherId);
        if (!researcher) {
            throw new Error('Исследователь не найден');
        }
        
        currentResearcher = researcher;
        loadResearcherDetails(researcher);
        showScreen('researcher-details-screen');
        
    } catch (error) {
        console.error('Ошибка при загрузке деталей исследователя:', error);
        showError('Не удалось загрузить данные исследователя');
    }
}

function loadResearcherDetails(researcher) {
    try {
        document.getElementById('detail-name').textContent = escapeHtml(researcher.name);
        document.getElementById('detail-specialization').textContent = escapeHtml(researcher.specialization);
        document.getElementById('detail-email').textContent = escapeHtml(researcher.email);
        document.getElementById('detail-phone').textContent = escapeHtml(researcher.phone);
        document.getElementById('detail-experience').textContent = `${researcher.experience} лет`;
        document.getElementById('detail-rate').textContent = `${researcher.hourlyRate}$/ч`;
        document.getElementById('detail-projects').textContent = researcher.completedProjects;
        document.getElementById('detail-rating').textContent = `${researcher.rating}/5`;
        
        const statusElement = document.getElementById('detail-status');
        statusElement.textContent = getStatusText(researcher.status);
        statusElement.className = `status-badge-large ${researcher.status}`;
        
        const avatarElement = document.querySelector('.researcher-avatar-large');
        avatarElement.textContent = getResearcherAvatar(researcher.name);
        
    } catch (error) {
        console.error('Ошибка при заполнении деталей исследователя:', error);
        throw error;
    }
}

// Добавление нового исследователя
function addResearcher() {
    const formData = {
        name: document.getElementById('researcher-name').value,
        email: document.getElementById('researcher-email').value,
        phone: document.getElementById('researcher-phone').value,
        specialization: document.getElementById('researcher-specialization').value,
        experience: parseInt(document.getElementById('researcher-experience').value),
        hourlyRate: parseInt(document.getElementById('researcher-rate').value)
    };
    
    // Валидация
    if (!validateResearcherForm(formData)) {
        return;
    }
    
    // Имитация API запроса
    setTimeout(() => {
        const newResearcher = {
            id: mockData.researchers.length + 1,
            ...formData,
            status: 'available',
            completedProjects: 0,
            rating: 3.0
        };
        
        mockData.researchers.push(newResearcher);
        
        // Показываем успешное сообщение
        showSuccessMessage('Исследователь успешно зарегистрирован!');
        
        // Возвращаемся к списку исследователей
        showScreen('researchers-screen');
        
        // Обновляем статистику
        updateDashboardStats();
        
    }, 1000);
}

function validateResearcherForm(data) {
    // Проверка обязательных полей
    if (!data.name || !data.email || !data.specialization || !data.experience || !data.hourlyRate) {
        showError('Заполните все обязательные поля');
        return false;
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showError('Введите корректный email адрес');
        return false;
    }
    
    // Проверка уникальности email
    const emailExists = mockData.researchers.some(r => r.email === data.email);
    if (emailExists) {
        showError('Исследователь с таким email уже зарегистрирован');
        return false;
    }
    
    // Проверка опыта
    if (data.experience < 0 || data.experience > 50) {
        showError('Опыт работы должен быть от 0 до 50 лет');
        return false;
    }
    
    // Проверка ставки
    if (data.hourlyRate < 10 || data.hourlyRate > 200) {
        showError('Часовая ставка должна быть от 10$ до 200$');
        return false;
    }
    
    return true;
}

// Управление запросами клиентов
function loadRequestsList() {
    const requestsList = document.querySelector('.requests-list');
    if (!requestsList) return;
    
    requestsList.innerHTML = '';
    
    const activeTab = getActiveTab();
    const filteredRequests = mockData.requests.filter(request => request.status === activeTab);
    
    if (filteredRequests.length === 0) {
        requestsList.innerHTML = '<div class="empty-state">Нет запросов</div>';
        return;
    }
    
    filteredRequests.forEach(request => {
        const requestCard = createRequestCard(request);
        requestsList.appendChild(requestCard);
    });
}

function createRequestCard(request) {
    const card = document.createElement('div');
    card.className = 'request-card';
    
    // Безопасное создание HTML с экранированием
    const title = escapeHtml(request.title);
    const client = escapeHtml(request.client);
    const specialization = escapeHtml(request.specialization);
    const priorityText = escapeHtml(getPriorityText(request.priority));
    
    card.innerHTML = `
        <div class="request-header">
            <h3>${title}</h3>
            <span class="priority ${request.priority}">${priorityText}</span>
        </div>
        <div class="request-client">Компания: ${client}</div>
        <div class="request-details">
            <span>Специализация: ${specialization}</span>
            <span>Опыт: от ${request.minExperience} лет</span>
            <span>Срок: ${request.duration} дней</span>
        </div>
        <div class="request-actions">
            <button class="btn-primary" onclick="processRequest(${request.id})">Обработать</button>
            <button class="btn-secondary" onclick="declineRequest(${request.id})">Отклонить</button>
        </div>
    `;
    
    return card;
}

function getPriorityText(priority) {
    const priorityTexts = {
        'high': 'Высокий',
        'medium': 'Средний',
        'low': 'Низкий'
    };
    return priorityTexts[priority] || priority;
}

function switchRequestTab(tab) {
    // Обновляем активную вкладку
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tab.toLowerCase())) {
            btn.classList.add('active');
        }
    });
    
    // Перезагружаем список запросов
    loadRequestsList();
}

function getActiveTab() {
    const activeBtn = document.querySelector('.tab-btn.active');
    if (!activeBtn) return 'new';
    
    const text = activeBtn.textContent.toLowerCase();
    if (text.includes('новые')) return 'new';
    if (text.includes('обработке')) return 'processing';
    if (text.includes('завершенные')) return 'completed';
    return 'new';
}

function processRequest(requestId) {
    const request = mockData.requests.find(r => r.id === requestId);
    if (request) {
        currentRequest = request;
        
        // Имитация обработки запроса
        showLoading('Поиск подходящих исследователей...');
        
        setTimeout(() => {
            hideLoading();
            
            // Поиск подходящих исследователей
            const suitableResearchers = findSuitableResearchers(request);
            
            if (suitableResearchers.length > 0) {
                showCandidateSelection(request, suitableResearchers);
            } else {
                showError('Не найдено подходящих исследователей по заданным критериям');
            }
        }, 1500);
    }
}

function findSuitableResearchers(request) {
    return mockData.researchers.filter(researcher => 
        researcher.specialization.toLowerCase().includes(request.specialization.toLowerCase()) &&
        researcher.experience >= request.minExperience &&
        researcher.status === 'available'
    ).slice(0, 3); // Ограничиваем 3 кандидатами
}

function showCandidateSelection(request, candidates) {
    let message = `Найдено ${candidates.length} подходящих исследователей для запроса "${request.title}":\n\n`;
    
    candidates.forEach((candidate, index) => {
        const cost = calculateProjectCost(candidate, request.duration);
        message += `${index + 1}. ${candidate.name} (${candidate.specialization})\n`;
        message += `   Опыт: ${candidate.experience} лет, Ставка: ${candidate.hourlyRate}$/ч\n`;
        message += `   Примерная стоимость: ${formatCurrency(cost)}\n\n`;
    });
    
    message += 'Выберите исследователя для формирования коммерческого предложения.';
    
    if (confirm(message)) {
        showSuccessMessage('Коммерческое предложение сформировано и отправлено клиенту!');
        
        // Обновляем статус запроса
        request.status = 'processing';
        loadRequestsList();
        updateDashboardStats();
    }
}

function calculateProjectCost(researcher, duration) {
    const estimatedHours = duration * 8; // 8 часов в день
    return researcher.hourlyRate * estimatedHours;
}

function declineRequest(requestId) {
    if (confirm('Вы уверены, что хотите отклонить этот запрос?')) {
        const request = mockData.requests.find(r => r.id === requestId);
        if (request) {
            request.status = 'declined';
            showSuccessMessage('Запрос отклонен');
            loadRequestsList();
            updateDashboardStats();
        }
    }
}

// Утилиты
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/"/g, '"')
        .replace(/'/g, "&#039;");
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(amount);
}

function showError(message) {
    try {
        // Создаем красивый toast вместо alert
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
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .toast-icon { font-size: 20px; }
            .toast-message { flex: 1; font-size: 14px; }
            .toast-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #721c24;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(toast);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
        
    } catch (error) {
        // Fallback на обычный alert
        alert('Ошибка: ' + message);
    }
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

function showLoading(message) {
    // Создаем индикатор загрузки
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-message">${escapeHtml(message)}</div>
    `;
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const spinnerStyle = `
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    const messageStyle = `
        margin-top: 16px;
        font-size: 16px;
        color: #333;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loading-spinner { ${spinnerStyle} }
        .loading-message { ${messageStyle} }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loadingOverlay);
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Обработчики событий для полей ввода
document.addEventListener('input', function(e) {
    if (e.target.type === 'email') {
        validateEmail(e.target);
    }
});

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (input.value && !emailRegex.test(input.value)) {
        input.style.borderColor = 'var(--error-color)';
    } else {
        input.style.borderColor = 'var(--border-color)';
    }
}

// Функции для экрана деталей исследователя
function assignToProject() {
    if (!currentResearcher) return;
    
    showLoading('Поиск доступных проектов...');
    
    setTimeout(() => {
        hideLoading();
        
        const availableProjects = mockData.requests.filter(r => r.status === 'new');
        
        if (availableProjects.length > 0) {
            const projectList = availableProjects.map(p =>
                `- ${p.title} (${p.client})`
            ).join('\n');
            
            if (confirm(`Доступные проекты для назначения ${currentResearcher.name}:\n\n${projectList}\n\nНазначить на проект?`)) {
                showSuccessMessage(`${currentResearcher.name} назначен на проект!`);
            }
        } else {
            showError('Нет доступных проектов для назначения');
        }
    }, 1000);
}

function editResearcher() {
    if (!currentResearcher) return;
    
    showSuccessMessage('Функция редактирования в разработке');
    // В реальном приложении здесь будет переход на экран редактирования
}