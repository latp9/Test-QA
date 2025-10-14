// Глобальные переменные
let currentScreen = 'form-screen';
let userData = {};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    console.log('Приложение инициализировано');
    // Можно добавить дополнительную инициализацию
}

function setupEventListeners() {
    const form = document.getElementById('user-form');
    const nameInput = document.getElementById('name-input');
    const ageInput = document.getElementById('age-input');
    const workplaceInput = document.getElementById('workplace-input');
    const educationInput = document.getElementById('education-input');
    
    // Обработка отправки формы
    form.addEventListener('submit', handleFormSubmit);
    
    // Валидация в реальном времени
    nameInput.addEventListener('input', () => validateName(nameInput));
    ageInput.addEventListener('input', () => validateAge(ageInput));
    workplaceInput.addEventListener('input', () => validateWorkplace(workplaceInput));
    educationInput.addEventListener('change', () => validateEducation(educationInput));
    
    // Автосохранение в localStorage
    nameInput.addEventListener('blur', saveFormData);
    ageInput.addEventListener('blur', saveFormData);
    workplaceInput.addEventListener('blur', saveFormData);
    educationInput.addEventListener('change', saveFormData);
    
    // Загрузка сохраненных данных
    loadSavedData();
}

// Валидация имени
function validateName(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('name-error');
    
    hideError('name-error');
    
    if (value.length === 0) {
        return false;
    }
    
    if (value.length < 2) {
        showError('name-error', 'Имя должно содержать минимум 2 символа');
        return false;
    }
    
    if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(value)) {
        showError('name-error', 'Имя может содержать только буквы, пробелы и дефисы');
        return false;
    }
    
    if (value.length > 50) {
        showError('name-error', 'Имя не должно превышать 50 символов');
        return false;
    }
    
    return true;
}

// Валидация возраста
function validateAge(input) {
    const value = parseInt(input.value);
    const errorElement = document.getElementById('age-error');
    
    hideError('age-error');
    
    if (isNaN(value)) {
        return false;
    }
    
    if (value < 1) {
        showError('age-error', 'Возраст должен быть не менее 1 лет');
        return false;
    }
    
    if (value > 100) {
        showError('age-error', 'Возраст должен быть не более 100 лет');
        return false;
    }
    
    return true;
}

// Валидация места работы
function validateWorkplace(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('workplace-error');
    
    hideError('workplace-error');
    
    if (value.length === 0) {
        return false;
    }
    
    if (value.length < 3) {
        showError('workplace-error', 'Название места работы должно содержать минимум 3 символа');
        return false;
    }
    
    if (value.length > 100) {
        showError('workplace-error', 'Название места работы не должно превышать 100 символов');
        return false;
    }
    
    return true;
}

// Валидация образования
function validateEducation(input) {
    const value = input.value;
    const errorElement = document.getElementById('education-error');
    
    hideError('education-error');
    
    if (value === '') {
        showError('education-error', 'Пожалуйста, выберите уровень образования');
        return false;
    }
    
    return true;
}

// Обработка отправки формы
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('name-input');
    const ageInput = document.getElementById('age-input');
    const workplaceInput = document.getElementById('workplace-input');
    const educationInput = document.getElementById('education-input');
    
    // Валидация всех полей
    const isNameValid = validateName(nameInput);
    const isAgeValid = validateAge(ageInput);
    const isWorkplaceValid = validateWorkplace(workplaceInput);
    const isEducationValid = validateEducation(educationInput);
    
    if (isNameValid && isAgeValid && isWorkplaceValid && isEducationValid) {
        // Сохраняем данные
        userData = {
            name: nameInput.value.trim(),
            age: parseInt(ageInput.value),
            workplace: workplaceInput.value.trim(),
            education: educationInput.value
        };
        
        // Показываем экран успеха
        showSuccessScreen();
        
        // Очищаем localStorage после успешной отправки
        localStorage.removeItem('userFormData');
        
        // Отправка данных на реальный API
        try {
            await sendToApi(userData);
        } catch (error) {
            showNotification('Ошибка при отправке данных на сервер', 'error');
            return;
        }
    } else {
        // Показываем общее сообщение об ошибке
        showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
        
        // Прокручиваем к первой ошибке
        scrollToFirstError();
    }
}

// Показать экран успеха
function showSuccessScreen() {
    // Обновляем данные в сводке
    document.getElementById('summary-name').textContent = userData.name;
    document.getElementById('summary-age').textContent = userData.age + ' лет';
    document.getElementById('summary-workplace').textContent = userData.workplace;
    document.getElementById('summary-education').textContent = userData.education;
    
    // Переключаем экран
    showScreen('success-screen');
    
    // Показываем уведомление об успехе
    showNotification('Данные успешно отправлены!', 'success');
}

// Переключение между экранами
function showScreen(screenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
}

// Показать ошибку
function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Скрыть ошибку
function hideError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Прокрутка к первой ошибке
function scrollToFirstError() {
    const firstError = document.querySelector('.input-error.show');
    if (firstError) {
        firstError.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Реальный API вызов к вашему FastAPI
async function sendToApi(data) {
    try {
        console.log('Отправка данных на сервер:', data);
        
        // Преобразуем данные в формат вашей схемы
        const apiData = {
            "Имя": data.name,
            "Возраст": data.age,
            "Работа": data.workplace,
            "Образование": data.education
        };
        
        const response = await fetch('http://localhost:8000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Данные успешно отправлены на сервер:', result);
        return result;
        
    } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        throw error;
    }
}

// Сохранение данных в localStorage
function saveFormData() {
    const formData = {
        name: document.getElementById('name-input').value,
        age: document.getElementById('age-input').value,
        workplace: document.getElementById('workplace-input').value,
        education: document.getElementById('education-input').value
    };
    
    localStorage.setItem('userFormData', JSON.stringify(formData));
}

// Загрузка сохраненных данных
function loadSavedData() {
    const savedData = localStorage.getItem('userFormData');
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            
            document.getElementById('name-input').value = formData.name || '';
            document.getElementById('age-input').value = formData.age || '';
            document.getElementById('workplace-input').value = formData.workplace || '';
            document.getElementById('education-input').value = formData.education || '';
            
            // Валидируем загруженные данные
            validateName(document.getElementById('name-input'));
            validateAge(document.getElementById('age-input'));
            validateWorkplace(document.getElementById('workplace-input'));
            validateEducation(document.getElementById('education-input'));
            
            showNotification('Загружены ранее сохраненные данные', 'info');
        } catch (error) {
            console.error('Ошибка загрузки сохраненных данных:', error);
            localStorage.removeItem('userFormData');
        }
    }
}

// Дополнительные утилиты
function formatAge(age) {
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return age + ' лет';
    }
    
    if (lastDigit === 1) {
        return age + ' год';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return age + ' года';
    }
    
    return age + ' лет';
}

// Глобальные функции для HTML
window.showScreen = showScreen;
window.formatAge = formatAge;

// Добавляем CSS для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s;
    }
    
    .notification button:hover {
        background: rgba(255,255,255,0.2);
    }
`;
document.head.appendChild(notificationStyles);