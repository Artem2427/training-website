import 'reflect-metadata';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import { Cheetah } from '../src/models/cheetah';
import { container } from '../src/config/container';
import { TYPES } from '../src/types/types';
import { IDatabase } from '../src/interfaces/IDatabase';
import { MONGODB_URI } from '../src/config/env';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

// Тести API вебдодатку сайту про гепардів
describe('API вебдодатку сайту про гепардів', () => {
    // Отримуємо екземпляр бази даних з контейнера
    const database = container.get<IDatabase>(TYPES.IDatabase);
    // Створюємо спеціальний URI для тестової бази даних
    const testMongoURI = MONGODB_URI.replace(/\/[^/]*$/, '/cheetahs-test');

    // Перед запуском тестів підключаємось до тестової бази даних
    before(async () => {
        await database.connect(testMongoURI);
        console.log('Підключено до тестової бази даних:', testMongoURI);
    });

    // Після всіх тестів очищуємо базу даних і відключаємося
    after(async () => {
        try {
            // Видаляємо тестову базу даних
            await mongoose.connection.db.dropDatabase();
            console.log('Тестову базу даних "cheetahs-test" успішно видалено');
        } catch (error) {
            // Обробляємо можливі помилки
            console.log(
                'Помилка видалення тестової бази даних:',
                error instanceof Error ? error.message : 'Невідома помилка',
            );
        } finally {
            // В будь-якому разі відключаємося від бази даних
            await database.disconnect();
            console.log('Відключено від тестової бази даних');
        }
    });

    // Тести для перевірки підключення до бази даних
    describe('Підключення до бази даних', () => {
        it('має перевірити підключення до тестової бази даних', () => {
            expect(database.isConnected()).to.be.true;
            expect(database.getConnectionUri()).to.equal(testMongoURI);
            console.log('Підключення до бази даних успішно перевірено');
        });
    });

    // Перед кожним тестом очищуємо колекцію гепардід
    beforeEach(async () => {
        await Cheetah.deleteMany({});
    });

    // Тести для створення запису про нового гепарда (POST-запит)
    describe('POST /api/cheetahs', () => {
        it('має створити запис про нового гепарда', done => {
            // Тестові дані гепарда
            const cheetah = {
                name: 'Стрункий',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'male' as const,
                description: 'Гепард стрункий',
                tailWidth: 50,
            };

            // Виконуємо POST-запит для створення запису про гепарда
            chai.request(app)
                .post('/api/cheetahs')
                .send(cheetah)
                .end((err, res) => {
                    if (err !== null && err !== undefined) {
                        return done(err);
                    }
                    // Перевіряємо відповідь
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('name', cheetah.name);
                    expect(res.body).to.have.property('age', cheetah.age);
                    expect(res.body).to.have.property('height', cheetah.height);
                    expect(res.body).to.have.property('weight', cheetah.weight);
                    expect(res.body).to.have.property('gender', cheetah.gender);
                    expect(res.body).to.have.property('description', cheetah.description);
                    expect(res.body).to.have.property('dateAdded');
                    expect(res.body).to.have.property('tailWidth', cheetah.tailWidth);
                    expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
                    done();
                });
        });
    });

    // Тести для отримання всіх записів гепардів (GET-запит)
    describe('GET /api/cheetahs', () => {
        it('має отримати всіх гепардів', async () => {
            // Створюємо тестовий запис гепарда
            const testCheetah = new Cheetah({
                name: 'Звичайний',
                age: 3,
                height: 35,
                weight: 3.2,
                gender: 'male',
                description: 'Звичайний гепард',
                tailWidth: 50,
            });
            await testCheetah.save();

            // Виконуємо GET-запит для отримання всіх записів гепардів
            const res = await chai.request(app).get('/api/cheetahs');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'Звичайний');
            expect(res.body[0]).to.have.property('gender', 'male');
            expect(res.body[0]).to.have.property('description', 'Звичайний гепард');
            expect(res.body[0]).to.have.property('tailWidth', 50);
            expect(res.body[0]).to.have.property('dateAdded');
            expect(new Date(res.body[0].dateAdded)).to.be.instanceOf(Date);
        });
    });

    // Тести для отримання запису конкретного гепарда за ID (GET-запит)
    describe('GET /api/cheetahs/:id', () => {
        it('має отримати конкретного гепарда за id', async () => {
            // Створюємо запис тестового гепарда
            const testCheetah = new Cheetah({
                name: 'Стрункий',
                age: 2,
                height: 60,
                weight: 47,
                gender: 'male',
                description: 'Стрункий гепард',
                tailWidth: 45,
            });
            const savedCheetah = await testCheetah.save();

            // Виконуємо GET-запит для отримання запису гепарда за ID
            const res = await chai.request(app).get(`/api/cheetahs/${String(savedCheetah._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Стрункий');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('height', 60);
            expect(res.body).to.have.property('weight', 47);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Стрункий гепард');
            expect(res.body).to.have.property('tailWidth', 45);
        });

        it('має повернути 404 для неіснуючого гепарда', async () => {
            // Виконуємо GET-запит для неіснуючого ID гепарда
            const res = await chai.request(app).get('/api/cheetahs/654321654321654321654321');
            expect(res).to.have.status(404);
        });
    });

    // Тести для повного оновлення запису про гепарда (PUT-запит)
    describe('PUT /api/cheetahs/:id', () => {
        it('має повністю оновити запис про гепарда', async () => {
            // Створюємо тестового гепарда
            const testCheetah = new Cheetah({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 39,
                gender: 'male',
                description: 'Початковий опис',
                tailWidth: 45,
            });
            const savedCheetah = await testCheetah.save();

            // Дані для оновлення гепарда
            const updatedData = {
                name: 'Оновлений',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'female',
                description: 'Оновлений опис',
                tailWidth: 49,
            };

            // Виконуємо PUT-запит для повного оновлення запису про гепарда
            const res = await chai
                .request(app)
                .put(`/api/cheetahs/${String(savedCheetah._id)}`)
                .send(updatedData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('height', 30);
            expect(res.body).to.have.property('weight', 2.5);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('tailWidth', 49);
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it("має завершитися невдачею при відсутності обов'язкових полів", async () => {
            // Створюємо тестового гепарда
            const testCheetah = new Cheetah({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                tailWidth: 49,
            });
            const savedCheetah = await testCheetah.save();

            // Неповні дані для оновлення (відсутні обов'язкові поля)
            const incompleteData = {
                name: 'Оновлений',
                age: 2,
                // height і weight і tailWidth відсутні
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PUT-запит з неповними даними
            const res = await chai
                .request(app)
                .put(`/api/cheetahs/${String(savedCheetah._id)}`)
                .send(incompleteData);

            // Перевіряємо, що запит завершився з помилкою
            expect(res).to.have.status(400);

            // Перевіряємо, що гепард не змінився
            const unchangedCheetah = await Cheetah.findById(savedCheetah._id);
            expect(unchangedCheetah).to.have.property('name', 'Оригінальний');
            expect(unchangedCheetah).to.have.property('height', 25);
            expect(unchangedCheetah).to.have.property('weight', 1.8);
        });
    });

    // Тести для часткового оновлення запису про гепарда (PATCH-запит)
    describe('PATCH /api/cheetahs/:id', () => {
        it('має частково оновити запис про гепарда', async () => {
            // Створюємо тестового гепарда
            const testCheetah = new Cheetah({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                tailWidth: 49,
            });
            const savedCheetah = await testCheetah.save();

            // Дані для часткового оновлення
            const patchData = {
                name: 'Частково оновлений',
                age: 3,
                description: 'Оновлений опис',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/cheetahs/${String(savedCheetah._id)}`)
                .send(patchData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Частково оновлений');
            expect(res.body).to.have.property('age', 3);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('tailWidth', 49);
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it('демонструє різницю між PATCH і PUT з частковими оновленнями', async () => {
            // Створюємо тестового гепарда
            const testCheetah = new Cheetah({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                tailWidth: 49,
            });
            const savedCheetah = await testCheetah.save();

            // Ті самі неповні дані, що не спрацювали з PUT, мають працювати з PATCH
            const partialData = {
                name: 'Оновлений',
                age: 2,
                // height і weight і tailwidth навмисно відсутні
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/cheetahs/${String(savedCheetah._id)}`)
                .send(partialData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            // Ці поля мають зберегти свої початкові значення
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('tailWidth', 49);
            expect(res.body).to.have.property('description', 'Оновлений опис');
        });
    });

    // Тести для отримання метаданих (HEAD-запит)
    describe('HEAD /api/cheetahs', () => {
        it('має повернути заголовки метаданих', async () => {
            // Виконуємо HEAD-запит
            const res = await chai
                .request(app)
                .head('/api/cheetahs')
                .set('Accept', 'application/json');

            // Перевіряємо статус відповіді
            expect(res).to.have.status(200);

            // Виводимо отримані заголовки
            console.log('Заголовки:');
            console.log('-----------------');
            Object.entries(res.headers).forEach(([key, value]) => {
                console.log(`${key}: ${String(value)}`);
            });

            // Перевіряємо наявність необхідних заголовків
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(res.headers['x-powered-by']).to.equal('Express');
            expect(res.headers['content-length']).to.equal('2');
        });
    });

    // Тести для видалення запису гепарда (DELETE-запит)
    describe('DELETE /api/cheetahs/:id', () => {
        it('має видалити запис про гепарда', async () => {
            // Створюємо тестового гепарда
            const testCheetah = new Cheetah({
                name: 'Стрибунець',
                age: 2,
                height: 28,
                weight: 2.1,
                gender: 'female',
                description: 'Чорний гепард',
                tailWidth: 49,
            });
            const savedCheetah = await testCheetah.save();

            // Виконуємо DELETE-запит
            const res = await chai.request(app).delete(`/api/cheetahs/${String(savedCheetah._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Запис про гепарда видалено');

            // Перевіряємо, що запис про гепарда дійсно видалено з бази
            const findCheetah = await Cheetah.findById(savedCheetah._id);
            expect(findCheetah).to.be.null;
        });
    });
});
