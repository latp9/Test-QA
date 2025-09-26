# Backend логика для Research Agency

## UC-002: Обработка запроса клиента на исследователя

### 1. Общий обзор
**Назначение:** Автоматический подбор подходящих исследователей по критериям клиента с последующим созданием проекта.
**Высокоуровневая логика:** Валидация запроса → Поиск кандидатов → Расчет стоимости → Уведомления → Создание проекта

### 2. Входные данные

```typescript
interface ClientRequest {
  client_id: number;           // ID клиента
  title: string;               // Название запроса
  description?: string;        // Описание проекта
  required_specialization: string;  // Требуемая специализация
  min_experience: number;      // Минимальный опыт (лет)
  project_duration?: number;   // Длительность проекта (дни)
  budget_range?: string;       // Бюджетный диапазон
  priority: 'low' | 'medium' | 'high';  // Приоритет запроса
}

interface ResearcherCriteria {
  specialization: string;      // Специализация для поиска
  min_experience: number;      // Минимальный опыт
  status: 'available';         // Только доступные исследователи
  is_active: true;             // Только активные
}
```

### 3. Валидации

#### 3.1. Структурные валидации:
- `client_id` - существующий ID клиента в базе
- `title` - не пустой, максимум 255 символов
- `required_specialization` - не пустой, максимум 200 символов
- `min_experience` - число от 0 до 50
- `project_duration` - если указан, от 1 до 365 дней
- `priority` - одно из допустимых значений

#### 3.2. Бизнес-валидации:
- Клиент активен и не заблокирован
- Специализация существует в системе (проверка по справочнику)
- Бюджетный диапазон соответствует рыночным ставкам
- Приоритет влияет на срок обработки (high = 4 часа, medium = 8 часов, low = 24 часа)

### 4. Основная логика

#### Шаг 1: Сохранение запроса клиента
```sql
BEGIN TRANSACTION;

-- Проверка существования клиента
SELECT id, company_name, is_active 
FROM clients 
WHERE id = ? AND is_active = TRUE;

-- Создание запроса
INSERT INTO client_requests (
  client_id, title, description, required_specialization, 
  min_experience, project_duration, budget_range, priority, status
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new');

COMMIT;
```

#### Шаг 2: Поиск подходящих исследователей
```sql
-- Основной запрос поиска
SELECT 
  r.id,
  r.first_name,
  r.last_name,
  r.specialization,
  r.experience_years,
  r.hourly_rate,
  r.status,
  COUNT(DISTINCT p.id) as completed_projects,
  AVG(te.hours_worked) as avg_hours_per_project
FROM researchers r
LEFT JOIN projects p ON p.researcher_id = r.id AND p.status = 'completed'
LEFT JOIN time_entries te ON te.project_id = p.id
WHERE r.specialization LIKE CONCAT('%', ?, '%')
  AND r.experience_years >= ?
  AND r.status = 'available'
  AND r.is_active = TRUE
GROUP BY r.id
ORDER BY 
  r.experience_years DESC,
  completed_projects DESC,
  avg_hours_per_project DESC
LIMIT 5;
```

#### Шаг 3: Расчет стоимости услуг
```javascript
function calculateProjectCost(researcher, projectDuration, estimatedHours) {
  const baseRate = researcher.hourly_rate;
  
  // Учет приоритета (срочные проекты дороже)
  const priorityMultiplier = {
    'high': 1.2,
    'medium': 1.0,
    'low': 0.9
  };
  
  // Учет опыта исследователя
  const experienceMultiplier = Math.min(1 + (researcher.experience_years * 0.05), 2.0);
  
  // Расчет итоговой стоимости
  let totalCost = baseRate * estimatedHours;
  totalCost *= priorityMultiplier[priority];
  totalCost *= experienceMultiplier;
  
  // Округление до ближайших 1000
  return Math.ceil(totalCost / 1000) * 1000;
}
```

#### Шаг 4: Формирование коммерческого предложения
```javascript
function generateCommercialProposal(clientRequest, suitableResearchers) {
  const proposal = {
    request_id: clientRequest.id,
    client_name: clientRequest.company_name,
    project_title: clientRequest.title,
    candidates: suitableResearchers.map(researcher => ({
      researcher_id: researcher.id,
      name: `${researcher.first_name} ${researcher.last_name}`,
      specialization: researcher.specialization,
      experience: researcher.experience_years,
      hourly_rate: researcher.hourly_rate,
      estimated_cost: calculateProjectCost(researcher, clientRequest.project_duration, 40), // 40 часов по умолчанию
      rating: calculateResearcherRating(researcher)
    })),
    generated_at: new Date().toISOString(),
    validity_period: '7 дней'
  };
  
  return proposal;
}
```

#### Шаг 5: Создание проекта при выборе исследователя
```sql
BEGIN TRANSACTION;

-- Проверка доступности исследователя
SELECT status FROM researchers WHERE id = ? AND is_active = TRUE;

-- Создание проекта
INSERT INTO projects (
  client_id, researcher_id, request_id, title, description,
  start_date, estimated_hours, hourly_rate, total_budget, status
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'planned');

-- Обновление статуса исследователя
UPDATE researchers SET status = 'busy' WHERE id = ?;

-- Обновление статуса запроса
UPDATE client_requests SET status = 'completed' WHERE id = ?;

COMMIT;
```

### 5. Интеграции

#### 5.1. Внутренние сервисы:
- **Client Service**: управление клиентами и запросами
- **Researcher Service**: поиск и управление исследователями  
- **Project Service**: создание и управление проектами
- **Email Service**: отправка уведомлений

#### 5.2. Внешние интеграции:
- **Payment Gateway**: для онлайн-оплат (если реализовано)
- **Calendar Service**: синхронизация с календарями исследователей
- **Document Service**: генерация договоров и отчетов

#### 5.3. База данных:
- **Чтение**: clients, researchers, projects, time_entries
- **Запись**: client_requests, projects, researchers (обновление статуса)

#### 5.4. Кэширование (Redis):
- Справочник специализаций (TTL: 24 часа)
- Рейтинги исследователей (TTL: 1 час)
- Ставки по специализациям (TTL: 4 часа)

### 6. Исключительные ситуации

#### 6.1. Валидационные ошибки (400):
- Несуществующий клиент → "Клиент не найден или заблокирован"
- Неверная специализация → "Указанная специализация не поддерживается"
- Недопустимый опыт → "Минимальный опыт должен быть от 0 до 50 лет"

#### 6.2. Бизнес-ошибки (409):
- Нет подходящих исследователей → "По вашим критериям не найдено подходящих кандидатов"
- Исследователь недоступен → "Выбранный исследователь уже занят"
- Превышен лимит проектов → "Исследователь уже работает на максимальном количестве проектов"

#### 6.3. Серверные ошибки (500):
- Ошибка базы данных → повторная попытка с exponential backoff
- Недоступность внешнего сервиса → отложенная обработка
- Ошибка отправки email → логирование и повторная попытка

#### 6.4. Стратегии восстановления:
- **Транзакционные откаты**: при ошибках в многошаговых операциях
- **Ретри логика**: до 3 попыток с задержкой 1s, 3s, 9s
- **Компенсирующие операции**: отмена резервирования при ошибке создания проекта
- **Dead Letter Queue**: для неудачных уведомлений

### 7. Выходные данные

#### 7.1. Успешный ответ (200):
```json
{
  "request_id": 123,
  "status": "processing",
  "suitable_candidates": [
    {
      "researcher_id": 456,
      "name": "Иван Петров",
      "specialization": "Маркетинговые исследования",
      "experience_years": 5,
      "hourly_rate": 45.00,
      "estimated_cost": 18000.00,
      "rating": 4.8
    }
  ],
  "proposal_valid_until": "2024-01-22T18:42:47Z"
}
```

#### 7.2. Ошибка валидации (400):
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Неверные данные в запросе",
  "details": [
    {
      "field": "min_experience",
      "error": "Значение должно быть не менее 0"
    }
  ]
}
```

### 8. Производительность

#### 8.1. Оптимизации:
- **Индексы**: на researchers(specialization, experience_years, status)
- **Кэширование**: результатов поиска на 5 минут
- **Пакетная обработка**: массовые уведомления
- **Асинхронные операции**: отправка email и генерация документов

#### 8.2. Ограничения:
- **Максимальная нагрузка**: 100 запросов/минуту
- **Время ответа**: < 2 секунды (95-й перцентиль)
- **Размер результатов**: максимум 50 кандидатов в ответе
- **Частота обновления**: кэш обновляется каждые 5 минут

#### 8.3. Мониторинг:
- **Метрики**: время поиска, количество найденных кандидатов, процент успешных подборов
- **Логирование**: все шаги процесса для аудита и отладки
- **Алерты**: при падении производительности ниже SLA

## Дополнительные бизнес-правила

### Рейтинг исследователей
```javascript
function calculateResearcherRating(researcher) {
  const baseRating = 3.0; // Базовый рейтинг
  
  // Бонус за опыт (максимум +2.0)
  const experienceBonus = Math.min(researcher.experience_years * 0.1, 2.0);
  
  // Бонус за завершенные проекты
  const projectsBonus = Math.min(researcher.completed_projects * 0.05, 1.0);
  
  // Штраф за переработки (если среднее время > 8 часов/день)
  const overtimePenalty = researcher.avg_hours_per_day > 8 ? -0.5 : 0;
  
  return Math.min(baseRating + experienceBonus + projectsBonus + overtimePenalty, 5.0);
}
```

### Автоматическое уведомление менеджеров
```javascript
function notifyManager(clientRequest, suitableResearchers) {
  const urgency = clientRequest.priority === 'high' ? 'СРОЧНО' : 'Обычный';
  const message = {
    to: 'managers@research-agency.com',
    subject: `${urgency}: Новый запрос от ${clientRequest.company_name}`,
    body: `
      Поступил новый запрос на исследователя.
      
      Клиент: ${clientRequest.company_name}
      Проект: ${clientRequest.title}
      Специализация: ${clientRequest.required_specialization}
      
      Найдено кандидатов: ${suitableResearchers.length}
      ${suitableResearchers.length === 0 ? 'Требуется ручной подбор!' : ''}
    `
  };
  
  return emailService.send(message);
}
```

Эта логика обеспечивает полное покрытие бизнес-процесса обработки запросов клиентов с учетом всех возможных сценариев и ошибок.