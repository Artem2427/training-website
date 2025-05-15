// Експорт специфікації Swagger/OpenAPI для документації про API
export const swaggerSpec = {
    // Версія специфікації OpenAPI
    openapi: '3.0.0',
    // Загальна інформація про API
    info: {
        title: 'API Сайту про Гепардів',
        version: '1.0.0',
        description: 'Документація API для Сайту про Гепардів',
    },
    // Налаштування серверів для тестування API
    servers: [
        {
            url:
                process.env.CODESPACE_NAME !== undefined
                    ? `https://${process.env.CODESPACE_NAME}-5001.app.github.dev`
                    : 'http://localhost:5001',
            description: 'Development server',
        },
    ],
    tags: [
        {
            name: 'Cheetahs',
            description: 'Операції з гепардами',
        },
    ],
    // Визначення кінцевих точок (endpoints) REST API та операцій з ними
    paths: {
        '/api/cheetahs': {
            // GET запит для отримання всіх гепардів
            get: {
                tags: ['Cheetahs'],
                summary: 'Отримати всіх гепардів',
                responses: {
                    '200': {
                        description: 'Список всіх гепардів',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Cheetah' },
                                },
                            },
                        },
                    },
                },
            },

            // POST запит для створення нового гепарда
            post: {
                tags: ['Cheetahs'],
                summary: 'Створити нового гепарда',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Cheetah' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: "Створений об'єкт гепарда",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Cheetah' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретного гепарда за ID
        '/api/cheetahs/{id}': {
            // GET запит для отримання гепарда за ID
            get: {
                tags: ['Cheetahs'],
                summary: 'Отримати гепарда за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID гепарда',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт гепарда",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Cheetah' },
                            },
                        },
                    },
                    '404': { description: 'Гепарда не знайдено' },
                },
            },

            // PUT запит для повного оновлення гепарда за ID
            put: {
                tags: ['Cheetahs'],
                summary: 'Повністю оновити гепарда',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID гепарда',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Cheetah' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт гепарда",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Cheetah' },
                            },
                        },
                    },
                    '404': { description: 'Гепарда не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення гепарда за ID
            patch: {
                tags: ['Cheetahs'],
                summary: 'Частково оновити гепарда',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID гепарда',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Cheetah' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт гепарда",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Cheetah' },
                            },
                        },
                    },
                    '404': { description: 'Гепарда не знайдено' },
                },
            },
            // DELETE запит для видалення даних про гепарда за ID
            delete: {
                tags: ['Cheetahs'],
                summary: 'Видалити дані про гепарда',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID гепарда',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'Гепарда не знайдено' },
                },
            },
        },
    },

    // Визначення компонентів для повторного використання
    components: {
        // Схеми даних
        schemas: {
            // Схема об'єкта Гепарда
            Cheetah: {
                type: 'object',
                required: ['name', 'age', 'height', 'weight', 'gender', 'tailWidth'],
                properties: {
                    name: {
                        type: 'string',
                        description: "Ім'я гепарда",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік гепарда у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота гепарда в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага гепарда в кілограмах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать гепарда',
                    },
                    description: {
                        type: 'string',
                        description: "Опис гепарда (необов'язкове поле)",
                    },
                    tailWidth: {
                        type: 'number',
                        description: 'Довжина хвоста гепарда в сантиметрах',
                    },
                },
            },
        },
    },
};
