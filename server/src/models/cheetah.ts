import { Schema, model } from 'mongoose';

// Інтерфейс для об'єкта "Гепард"
interface ICheetah {
    name: string; // Ім'я гепарда
    age: number; // Вік гепарда у роках
    height: number; // Висота гепарда в сантиметрах
    weight: number; // Вага гепарда в кілограмах
    gender: 'male' | 'female'; // Стать гепарда: 'male' - самець, 'female' - самка
    description?: string; // Опис гепарда (необов'язкове поле)
    dateAdded: Date; // Дата додавання запису до бази даних
    tailWidth: number; // Довжина хвоста в сантиметрах
}

// Схема MongoDB для моделі "Гепард"
const cheetahSchema = new Schema<ICheetah>({
    name: {
        type: String,
        required: true, // Поле є обов'язковим
    },
    age: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    height: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    weight: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    gender: {
        type: String,
        required: true, // Поле є обов'язковим
        enum: ['male', 'female'], // Допустимі значення: 'male' або 'female'
    },
    description: String, // Необов'язкове текстове поле
    dateAdded: {
        type: Date,
        default: Date.now, // Значення за замовчуванням - поточна дата і час
    },
    tailWidth: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
});

// Створення моделі Mongoose на основі схеми
export const Cheetah = model<ICheetah>('Cheetah', cheetahSchema);
export type { ICheetah }; // Експортуємо інтерфейс для використання в інших файлах
