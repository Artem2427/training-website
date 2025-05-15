import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { CheetahRepository } from '../repositories/CheetahRepository';

// Створюємо новий обробник HTTP-запитів Express
const router = Router();
// Отримуємо екземпляр репозиторію гепардів з контейнера інверсії залежностей
const cheetahRepository = container.get(CheetahRepository);

// Обробка HTTP-запиту GET / - отримання всіх записів гепардів
router.get('/', (async (_req: Request, res: Response) => {
    try {
        // Отримуємо всі записи гепардів з бази даних через репозиторій
        const cheetahs = await cheetahRepository.findAll();
        res.json(cheetahs);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту GET /:id - отримання запису одного гепарда за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        // Пошук гепарда за ідентифікатором
        const cheetah = await cheetahRepository.findById(req.params.id);
        if (cheetah) {
            res.json(cheetah);
        } else {
            // Якщо гепард не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис гепарда не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту POST / - створення нового запису гепарда
router.post('/', (async (req: Request, res: Response) => {
    try {
        // Створюємо новий запис гепарда з даних запиту
        const newCheetah = await cheetahRepository.create(req.body);
        // Повертаємо статус 201 (Created) і дані створеного гепарда
        res.status(201).json(newCheetah);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PUT /:id - повне оновлення запису гепарда
router.put('/:id', (async (req: Request, res: Response) => {
    try {
        // Перевірка наявності всіх обов'язкових полів для PUT запиту
        const requiredFields = ['name', 'age', 'height', 'weight', 'gender'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        // Якщо є відсутні поля, повертаємо помилку 400 Bad Request
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Відсутні обов'язкові поля: ${missingFields.join(', ')}`,
            });
        }

        // Оновлюємо гепарда з вказаним ID
        const cheetah = await cheetahRepository.update(req.params.id, req.body);
        if (cheetah) {
            return res.json(cheetah);
        } else {
            // Якщо гепард не знайдений, повертаємо 404 помилку
            return res.status(404).json({ message: 'Запис гепарда не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PATCH /:id - часткове оновлення запису гепарда
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        // Часткове оновлення запису гепарда - передаються лише ті поля, які потрібно змінити
        const cheetah = await cheetahRepository.patch(req.params.id, req.body);
        if (cheetah) {
            res.json(cheetah);
        } else {
            // Якщо гепард не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис гепарда не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту DELETE /:id - видалення запису гепарда
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        // Видаляємо дані про гепарда за ID
        const cheetah = await cheetahRepository.delete(req.params.id);
        if (cheetah) {
            // У разі успіху повертаємо повідомлення про видалення
            res.json({ message: 'Запис про гепарда видалено' });
        } else {
            // Якщо гепард не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис про гепарда не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
