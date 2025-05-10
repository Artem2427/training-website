import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Population() {
  return (
    <main className="container px-4 py-4">
      <div className="row">
        <aside className="col-md-3">
          <nav className="sticky-top pt-3" aria-label="Зміст сторінки">
            <h2 className="h4">Зміст</h2>
            <ul className="nav flex-column">
              <a href="#continentsList" className="nav-link" data-bs-toggle="collapse">Континенти</a>
              <a href="#subcontinentsList" className="nav-link" data-bs-toggle="collapse">Субконтиненти</a>
              <a href="#countriesList" className="nav-link" data-bs-toggle="collapse">Країни</a>
              <a href="#introducedList" className="nav-link" data-bs-toggle="collapse">Інтродуковані в</a>
              <a href="#biogeographicList" className="nav-link" data-bs-toggle="collapse">Біогеографічні зони</a>
              <a href="#biomesList" className="nav-link" data-bs-toggle="collapse">WWF Біоми</a>
            </ul>
          </nav>
        </aside>

        <div class="col-md-9">
        <h2 class="h2 text-success">Ареал гепардів</h2>
  
        <article class="mt-4">
          <section id="continents">
            <h3>
              <button class="btn btn-success w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#continentsList">
                Континенти
              </button>
            </h3>
            <div class="collapse show" id="continentsList">
              <ul class="list-group mb-3">
                <li class="list-group-item">Африка</li>
                <li class="list-group-item">Азія (лише в Ірані)</li>
              </ul>
            </div>
          </section>
  
          <section id="subcontinents">
            <h3>
              <button class="btn btn-success w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#subcontinentsList">
                Субконтиненти
              </button>
            </h3>
            <div class="collapse show" id="subcontinentsList">
              <ul class="list-group mb-3">
                <li class="list-group-item">Центральна Азія (лише Іран)</li>
                <li class="list-group-item">Східна Африка</li>
                <li class="list-group-item">Південна Африка</li>
                <li class="list-group-item">Західна Африка</li>
              </ul>
            </div>
          </section>
  
          <section id="countries">
            <h3>
              <button class="btn btn-success w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#countriesList">
                Країни
              </button>
            </h3>
            <div class="collapse show" id="countriesList">
              <ul class="list-group mb-3">
                <li class="list-group-item">Намібія</li>
                <li class="list-group-item">Ботсвана</li>
                <li class="list-group-item">Кенія</li>
                <li class="list-group-item">Танзанія</li>
                <li class="list-group-item">Південна Африка</li>
                <li class="list-group-item">Мозамбік</li>
                <li class="list-group-item">Зімбабве</li>
                <li class="list-group-item">Іран (останній залишок популяції в Азії)</li>
              </ul>
            </div>
          </section>
  
          <section id="introduced">
            <h3>
              <button class="btn btn-success w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#introducedList">
                Інтродуковані в
              </button>
            </h3>
            <div class="collapse" id="introducedList">
              <ul class="list-group mb-3">
                <li class="list-group-item">Немає підтверджених випадків успішної інтродукції в інші регіони.</li>
              </ul>
            </div>
          </section>
  
          <section id="biogeographic">
            <h3>
              <button class="btn btn-success w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#biogeographicList">
                Біогеографічні зони
              </button>
            </h3>
            <div class="collapse show" id="biogeographicList">
              <ul class="list-group mb-3">
                <li class="list-group-item">Палеарктика (лише Іран)</li>
                <li class="list-group-item">Афротропіка (основна частина популяції)</li>
              </ul>
            </div>
          </section>
  
          <section id="biomes">
            <h3>
              <button class="btn btn-success w-100 text-start" type="button" data-bs-toggle="collapse" data-bs-target="#biomesList">
                WWF Біоми
              </button>
            </h3>
            <div class="collapse show" id="biomesList">
              <ul class="list-group">
                <li class="list-group-item">Саванни та чагарники</li>
                <li class="list-group-item">Трав'янисті рівнини</li>
                <li class="list-group-item">Пустелі та напівпустелі</li>
              </ul>
            </div>
          </section>
        </article>
        </div>
      </div>
    </main>
  );
}

export default Population;