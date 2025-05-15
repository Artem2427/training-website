import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { API_BASE_URL } from '../config/api';
import { Toast } from 'bootstrap';

// Компонент для управління гепардами, які перебувають на реабілітації, через API
function Rehabilitation() {  // Стан для зберігання даних та стану інтерфейсу
  const [cheetahs, setCheetahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Стан для модального вікна видалення
  const [cheetahToDelete, setCheetahToDelete] = useState(null); // Ідентифікатор гепарда для видалення
  const [currentCheetah, setCurrentCheetah] = useState(null);
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });
  
  // Посилання до елемента спливаючих сповіщень toast
  const toastRef = useRef(null);
  // Стан форми для додавання/редагування гепарда
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    description: '',
    tailWidth: '',
  });

  // При рендерингу компонента, отримуємо всіх гепардів
  useEffect(() => {
    document.title = 'Реабілітація гепардів - Сайт про гепардів';
    fetchCheetahs();
  }, []);

  // Показуємо toast повідомлення, коли змінюється toastMessage
  useEffect(() => {
    if (toastMessage.text && toastRef.current) {
      const toastElement = new Toast(toastRef.current);
      toastElement.show();
    }
  }, [toastMessage]);
  
  // Отримуємо всіх гепардів з API
  const fetchCheetahs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/cheetahs`);
      setCheetahs(Array.isArray(response.data) ? response.data : []);

    } catch (err) {
      setError(`Помилка завантаження даних: ${err.message}`);
      console.error('Помилка при отриманні даних про гепардів:', err);
      setCheetahs([]);

    } finally {
      setLoading(false);
    }
  };

  // Обробляємо зміни вводу у формі
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Конвертуємо числові значення з рядків у числа
    if (['age', 'height', 'weight', 'tailWidth'].includes(name)) {
      processedValue = value === '' ? '' : Number(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  // Відкриваємо модальне вікно для додавання нового гепарда
  const handleShowAddModal = () => {
    setFormData({
      name: '',
      age: '',
      height: '',
      weight: '',
      gender: 'male',
      description: '',
      tailWidth: '',
    });
    setShowAddModal(true);
  };

  // Відкриваємо модальне вікно для редагування гепарда
  const handleShowEditModal = (cheetah) => {
    setCurrentCheetah(cheetah);
    setFormData({
      name: cheetah.name,
      age: cheetah.age,
      height: cheetah.height,
      weight: cheetah.weight,
      gender: cheetah.gender,
      description: cheetah.description || '',
      tailWidth: cheetah.cheetah,
    });
    setShowEditModal(true);
  };

  // Додаємо нового гепарда
  const handleAddCheetah = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/cheetahs`, formData);
      const newCheetah = response.data;
      setCheetahs([...cheetahs, newCheetah]);
      setShowAddModal(false);
      setToastMessage({ text: `Гепарда "${newCheetah.name}" успішно додано!`, type: 'success' });

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Помилка при створенні: ${errorMessage}`);
      setToastMessage({ text: `Помилка при створенні: ${errorMessage}`, type: 'danger' });
      console.error('Помилка при додаванні гепарда:', err);

    } finally {
      setLoading(false);
    }
  };

  // Оновлюємо існуючого гепарда
  const handleUpdateCheetah = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/cheetahs/${currentCheetah._id}`, formData);
      const updatedCheetah = response.data;
      setCheetahs(cheetahs.map(cheetah => 
        cheetah._id === currentCheetah._id ? updatedCheetah : cheetah
      ));
      setShowEditModal(false);
      setToastMessage({ text: `Дані про гепарда "${updatedCheetah.name}" оновлено!`, type: 'success' });

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Помилка при оновленні: ${errorMessage}`);
      setToastMessage({ text: `Помилка при оновленні: ${errorMessage}`, type: 'danger' });
      console.error('Помилка при оновленні гепарда:', err);
      
    } finally {
      setLoading(false);
    }
  };
   
  // Показуємо модальне вікно підтвердження видалення
  const handleShowDeleteModal = (cheetah) => {
    setCheetahToDelete(cheetah);
    setShowDeleteModal(true);
  };

  // Видаляємо Гепарда
  const handleDeleteCheetah = async () => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/cheetahs/${cheetahToDelete._id}`);
      setCheetahs(cheetahs.filter(cheetah => cheetah._id !== cheetahToDelete._id));
      setToastMessage({ text: `Гепарда "${cheetahToDelete.name}" успішно видалено!`, type: 'success' });
      setShowDeleteModal(false); // Закриваємо модальне вікно
      setCheetahToDelete(null); // Очищаємо дані гепарда для видалення

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Помилка при видаленні: ${errorMessage}`);
      setToastMessage({ text: `Помилка при видаленні: ${errorMessage}`, type: 'danger' });
      console.error('Помилка при видаленні гепарда:', err);

    } finally {
      setLoading(false);
    }
  };

  // Форматуємо дату для відображення
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uk-UA', options);
  };
  
  return (
    <main className="container px-4 py-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-success">Реабілітація гепардів</h1>
        <button 
          className="btn btn-success" 
          onClick={handleShowAddModal}
          disabled={loading}
        >
          Додати гепарда
        </button>
      </header>

      {/* Повідомлення про помилку */}
      {error && (
        <section className="alert alert-danger mb-4" role="alert">
          {error}
        </section>
      )}
      
      {/* Toast для повідомлень */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div 
          ref={toastRef}
          className={`toast align-items-center text-white bg-${toastMessage.type} border-0`} 
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
          data-bs-delay="3000"
        >
          <div className="d-flex">
            <div className="toast-body">
              {toastMessage.text}
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white me-2 m-auto" 
              data-bs-dismiss="toast" 
              aria-label="Закрити"
            ></button>
          </div>
        </div>
      </div>

      {/* Таблиця гепардів */}
      {loading && !error && (
        <div className="text-center my-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Завантаження...</span>
          </div>
          <p className="mt-2">Завантаження записів гепардів...</p>
        </div>
      )}
      
      {!loading && cheetahs.length === 0 && (
        <section className="alert alert-info">
          Немає доступних записів про гепардів у реабілітації. Додайте першого гепарда!
        </section>
      )}
      
      {!loading && cheetahs.length > 0 && (
        <section className="table-responsive">
          <table className="table table-striped table-bordered table-hover vertical-align-middle">
            <thead>
              <tr>
                <th>Ім'я</th>
                <th>Вік (роки)</th>
                <th>Висота (см)</th>
                <th>Вага (кг)</th>
                <th>Стать</th>
                <th>Опис</th>
                <th>Довжина хвоста (см)</th>
                <th>Дата додавання</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {cheetahs.map(cheetah => (
                <tr key={cheetah._id}>
                  <td>{cheetah.name}</td>
                  <td>{cheetah.age}</td>
                  <td>{cheetah.height}</td>
                  <td>{cheetah.weight}</td>
                  <td>{cheetah.gender === 'male' ? 'Самець' : 'Самиця'}</td>
                  <td>{cheetah.description}</td>
                  <td>{cheetah.tailWidth}</td>
                  <td>{cheetah.dateAdded ? formatDate(cheetah.dateAdded) : 'Н/Д'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleShowEditModal(cheetah)}
                      disabled={loading}
                    >
                      Редагувати
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleShowDeleteModal(cheetah)}
                      disabled={loading}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Модальне вікно для додавання нового гепарда */}
      <div 
        className={`modal fade ${showAddModal ? 'show' : ''}`} 
        id="addCheetahModal" 
        tabIndex="-1" 
        aria-labelledby="addCheetahModalLabel" 
        aria-hidden="true"
        style={{ display: showAddModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title h5" id="addCheetahModalLabel">Додати нового гепарда</h2>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Закрити"></button>
            </header>
            <div className="modal-body">
              <form onSubmit={handleAddCheetah}>
                <fieldset>
                  <div className="row mb-3">
                    <label htmlFor="name" className="col-sm-3 col-form-label">Ім'я</label>
                    <div className="col-sm-9">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="age" className="col-sm-3 col-form-label">Вік (роки)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="age" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="height" className="col-sm-3 col-form-label">Висота (см)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="height" 
                        name="height" 
                        value={formData.height} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="weight" className="col-sm-3 col-form-label">Вага (кг)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="weight" 
                        name="weight" 
                        value={formData.weight} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="gender" className="col-sm-3 col-form-label">Стать</label>
                    <div className="col-sm-9">
                      <select 
                        className="form-select" 
                        id="gender" 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange}
                        required
                      >
                        <option value="male">Самець</option>
                        <option value="female">Самиця</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="tailWidth" className="col-sm-3 col-form-label">Довжина хвоста (см)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="tailWidth" 
                        name="tailWidth" 
                        value={formData.tailWidth} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="description" className="col-sm-3 col-form-label">Опис</label>
                    <div className="col-sm-9">
                      <textarea 
                        className="form-control" 
                        id="description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleInputChange}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                </fieldset>
                <footer className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddModal(false)}>
                    Скасувати
                  </button>
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Зачекайте...
                      </>
                    ) : 'Додати гепарда'}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Фон для модального вікна додавання */}
      {showAddModal && (
        <div className="modal-backdrop fade show" 
             onClick={() => setShowAddModal(false)}></div>
      )}

      {/* Модальне вікно для редагування існуючого гепарда */}
      <div 
        className={`modal fade ${showEditModal ? 'show' : ''}`} 
        id="editCheetahModal" 
        tabIndex="-1" 
        aria-labelledby="editCheetahModalLabel" 
        aria-hidden="true"
        style={{ display: showEditModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title h5" id="editCheetahModalLabel">Редагувати гепарда</h2>
              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Закрити"></button>
            </header>
            <div className="modal-body">
              <form onSubmit={handleUpdateCheetah}>
                <fieldset>
                  <div className="row mb-3">
                    <label htmlFor="edit-name" className="col-sm-3 col-form-label">Ім'я</label>
                    <div className="col-sm-9">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="edit-name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-age" className="col-sm-3 col-form-label">Вік (роки)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="edit-age" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-height" className="col-sm-3 col-form-label">Висота (см)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="edit-height" 
                        name="height" 
                        value={formData.height} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-weight" className="col-sm-3 col-form-label">Вага (кг)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="edit-weight" 
                        name="weight" 
                        value={formData.weight} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-gender" className="col-sm-3 col-form-label">Стать</label>
                    <div className="col-sm-9">
                      <select 
                        className="form-select" 
                        id="edit-gender" 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange}
                        required
                      >
                        <option value="male">Самець</option>
                        <option value="female">Самка</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="tailWidth" className="col-sm-3 col-form-label">Довжина хвоста (см)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="tailWidth" 
                        name="tailWidth" 
                        value={formData.tailWidth} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-description" className="col-sm-3 col-form-label">Опис</label>
                    <div className="col-sm-9">
                      <textarea 
                        className="form-control" 
                        id="edit-description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleInputChange}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                </fieldset>                
                <footer className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setShowEditModal(false)}>
                    Скасувати
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Зачекайте...
                      </>
                    ) : 'Зберегти зміни'}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Фон для модального вікна редагування */}
      {showEditModal && (
        <div className="modal-backdrop fade show" 
             onClick={() => setShowEditModal(false)}></div>
      )}

      {/* Модальне вікно для підтвердження видалення гепарда */}
      <div 
        className={`modal fade ${showDeleteModal ? 'show' : ''}`} 
        id="deleteCheetahModal" 
        tabIndex="-1" 
        aria-labelledby="deleteCheetahModalLabel" 
        aria-hidden="true"
        style={{ display: showDeleteModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title h5" id="deleteCheetahModalLabel">Підтвердження видалення</h2>
              <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} aria-label="Закрити"></button>
            </header>
            <div className="modal-body">
              {cheetahToDelete && (
                <p>Ви впевнені, що хочете видалити гепарда <strong>{cheetahToDelete.name}</strong>?</p>
              )}
            </div>
            <footer className="modal-footer">              
              <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Скасувати
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={handleDeleteCheetah}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Видалення...
                  </>
                ) : 'Видалити'}
              </button>
            </footer>
          </div>
        </div>
      </div>
      
      {/* Фон для модального вікна видалення */}
      {showDeleteModal && (
        <div className="modal-backdrop fade show" 
             onClick={() => setShowDeleteModal(false)}></div>
      )}
    </main>
  );
}

export default Rehabilitation;
