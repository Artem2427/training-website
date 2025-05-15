import { Cheetah, ICheetah } from '../models/cheetah';
import { injectable } from 'inversify';

// Клас-репозиторій для роботи з гепардами
// Анотація injectable дозволяє впровадити цей репозиторій через IoC контейнер
@injectable()
export class CheetahRepository {
    // Метод для отримання всіх гепардів з бази даних
    public async findAll(): Promise<ICheetah[]> {
        return Cheetah.find();
    }

    // Метод для пошуку гепарла за унікальним ідентифікатором
    public async findById(id: string): Promise<ICheetah | null> {
        return Cheetah.findById(id);
    }

    // Метод для створення нового гепарда в базі даних
    public async create(cheetahData: ICheetah): Promise<ICheetah> {
        const cheetah = new Cheetah(cheetahData);
        return cheetah.save();
    }

    // Метод для видалення гепарда за ідентифікатором
    public async delete(id: string): Promise<boolean> {
        const result = await Cheetah.findByIdAndDelete(id);
        return result !== null;
    }

    // Метод для повного оновлення даних про гепарда (заміна всіх полів)
    public async update(id: string, chettahData: ICheetah): Promise<ICheetah | null> {
        return Cheetah.findByIdAndUpdate(id, chettahData, { new: true });
    }

    // Метод для часткового оновлення даних про гепарда (оновлення лише вказаних полів)
    public async patch(id: string, cheetahData: Partial<ICheetah>): Promise<ICheetah | null> {
        return Cheetah.findByIdAndUpdate(id, { $set: cheetahData }, { new: true });
    }
}
