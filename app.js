// 1. Демонстрационные данные
const defaultItems = [
    { id: "1", title: "Даже если попадёшь в историю о призраках, всё равно придётся идти на работу", description: "Мечтая отдохнуть на мероприятии по любимой вселенной, главный герой неожиданно переносится в этот фэнтезийный мир и становится новичком в крупной корпорации Day Dream Inc. Невероятные льготы, отличная зарплата и компетентное руководство быстро омрачаются мелким примечанием в контракте: компания не несёт ответственности за гибель сотрудников. И хотя благодаря знанию сюжета герой стремительно делает карьеру среди привидений и аномалий, его единственное желание — бросить работу мечты и вернуться домой.", genres: ["Комедия", "Мистика"], status: "Выпускается", rating: 8.5, image: "assets/images/ghost.jpg" },
    { id: "2", title: "Точка зрения Всеведущего читателя", description: "Ким Докчжа — единственный человек, дочитавший до конца веб-роман из трёх тысяч глав, длившийся десять лет. Сразу после финальной главы автор присылает ему полную копию текста, а описанный в нём апокалипсис мгновенно становится реальностью. Вооружившись уникальным знанием сюжета, Докчжа начинает отчаянную борьбу за жизнь в мире, где сценарии игры со смертью диктует сама вселенная.", genres: ["Экшен", "Фэнтези"], status: "Завершено", rating: 9.2, image: "assets/images/orv.jpg" },
    { id: "3", title: "Я не тот, за кого меня принимают", description: "Деон Харт славится как непобедимый, кровожадный боец и идеальный командир, заслуживший безоговорочное доверие союзников и уважение врагов. На самом же деле он смертельно болен и слаб, а любое физическое или эмоциональное напряжение доводит его буквально до кровавой рвоты. Напряжение растёт, ведь окружающие отказываются видеть в нём немощного человека, непрестанно принимая его мучения за проявления жуткой, сдерживаемой силы.", genres: ["Фэнтези", "Комедия"], status: "Выпускается", rating: 8.8, image: "assets/images/talent.jpg" },
    { id: "4", title: "Я стал графским ублюдком", description: "Очнувшись внутри популярной новеллы, герой обнаруживает себя в теле никчёмного графского сына — местного отброса, которому суждено быть избитым до полусмерти главным героем. Ситуация осложняется тем, что родная деревня вот-вот будет уничтожена ради развития сюжета и становления истинного протагониста. Понимая всю плачевность своего положения, новый хозяин тела решает переписать судьбу и использовать знания о мире себе во благо.", genres: ["Фэнтези", "Приключения"], status: "Выпускается", rating: 8.0, image: "assets/images/trash.jpg" },
    { id: "5", title: "Повелитель тайн", description: "Оказавшись в альтернативном мире эпохи пара, магии и карт Таро, обычный человек Чжоу Минжуй перерождается в теле Клейна Моретти. Погружаясь в опасные тайны мировых церквей и скрытого зла, он постепенно обретает могущество с помощью загадочных Потусторонних зелий. Это история восхождения легендарного «Шута» — фигуры с нулевым номером и безграничным потенциалом.", genres: ["Мистика", "Фэнтези"], status: "Завершено", rating: 9.5, image: "assets/images/lotm.jpg" },
    { id: "6", title: "Я же юный бог — взрастите меня", description: "Бывший киберспортсмен, потерявший карьеру из-за травмы и годами живший в любимой игре, неожиданно переносится в её реальную версию. Вот только вместо игрока он становится самой Системой планеты «Земля», обязанной регистрировать людей без каких-либо инструкций. Чтобы разобраться в происходящем, герой решает пройти этот мир насквозь, ведь он знает его вдоль и поперёк.", genres: ["Повседневность", "Комедия"], status: "Выпускается", rating: 7.9, image: "assets/images/god.jpg" }
];

// 2. Состояние
const state = {
    items: [],
    searchQuery: '',
    selectedGenre: 'all',
    sortBy: 'title-asc'
};

const STORAGE_KEY = 'novel-tracker-data';

const cardsContainer = document.getElementById('cards-container');
const searchInput = document.getElementById('search-text');
const sortSelect = document.getElementById('sort-select');
const genreSelect = document.getElementById('genre-select');
const newGenresContainer = document.getElementById('new-genres-container');
const modal = document.getElementById('add-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal');
const cancelModalBtn = document.getElementById('cancel-add');
const addForm = document.getElementById('add-form');
const searchForm = document.getElementById('search-form');
const resetFiltersBtn = document.getElementById('reset-filters-btn');

// Работа с localStorage
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try { state.items = JSON.parse(stored); } catch (e) { state.items = [...defaultItems]; }
    } else {
        state.items = [...defaultItems];
        saveToLocalStorage();
    }
}

// Обновление выпадающего списка жанров и чекбоксов в модалке
function updateGenresUI() {
    const allGenres = state.items.flatMap(item => item.genres || []);
    const uniqueGenres = [...new Set(allGenres)].sort();

    // Сохраняем текущий выбор фильтра
    const currentFilter = genreSelect.value;

    genreSelect.innerHTML = '<option value="all">Все жанры</option>';
    newGenresContainer.textContent = '';

    uniqueGenres.forEach(genre => {
        // Опция для фильтра
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        if (genre === currentFilter) option.selected = true;
        genreSelect.appendChild(option);

        // Чекбокс для модалки
        const labelNew = document.createElement('label');
        labelNew.className = 'checkbox-label';
        const inputNew = document.createElement('input');
        inputNew.type = 'checkbox';
        inputNew.value = genre;
        inputNew.name = 'new-genres';
        labelNew.appendChild(inputNew);
        labelNew.appendChild(document.createTextNode(genre));
        newGenresContainer.appendChild(labelNew);
    });
}

// Отрисовка
function render() {
    cardsContainer.textContent = '';

    let filteredItems = state.items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(state.searchQuery.toLowerCase());

        // Если выбрано "Все жанры", пропускаем фильтрацию по жанру
        let matchesGenre = true;
        if (state.selectedGenre !== 'all') {
            matchesGenre = (item.genres || []).includes(state.selectedGenre);
        }

        return matchesSearch && matchesGenre;
    });

    filteredItems.sort((a, b) => {
        switch (state.sortBy) {
            case 'title-asc': return a.title.localeCompare(b.title);
            case 'title-desc': return b.title.localeCompare(a.title);
            case 'rating-desc': return b.rating - a.rating;
            case 'rating-asc': return a.rating - b.rating;
            default: return 0;
        }
    });

    if (filteredItems.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Ничего не найдено.';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.gridColumn = '1 / -1';
        emptyMsg.style.fontSize = '1.2rem';
        emptyMsg.style.marginTop = '2rem';
        cardsContainer.appendChild(emptyMsg);
        return;
    }

    filteredItems.forEach(item => {
        const article = document.createElement('article');
        article.dataset.id = item.id;

        const img = document.createElement('img');
        img.src = item.image || 'https://placehold.co/300x400?text=No+Cover';
        img.alt = item.title;
        img.onerror = function () { this.onerror = null; this.src = 'https://placehold.co/300x400?text=No+Cover'; };
        article.appendChild(img);

        const h2 = document.createElement('h2');
        h2.textContent = item.title;
        article.appendChild(h2);

        const desc = document.createElement('p');
        desc.textContent = `Описание: ${item.description}`;
        article.appendChild(desc);

        const genre = document.createElement('p');
        genre.textContent = `Жанр: ${(item.genres || []).join(', ')}`;
        article.appendChild(genre);

        const status = document.createElement('p');
        status.textContent = `Статус: ${item.status}`;
        article.appendChild(status);

        const rating = document.createElement('p');
        rating.textContent = `Оценка: ${item.rating}/10`;
        article.appendChild(rating);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Удалить';
        deleteBtn.dataset.action = 'delete';
        article.appendChild(deleteBtn);

        cardsContainer.appendChild(article);
    });
}

// --- События ---
searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    render();
});

genreSelect.addEventListener('change', (e) => {
    state.selectedGenre = e.target.value;
    render();
});

sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    render();
});

// Сброс фильтров
resetFiltersBtn.addEventListener('click', () => {
    state.searchQuery = '';
    state.selectedGenre = 'all';
    state.sortBy = 'title-asc';

    searchInput.value = '';
    genreSelect.value = 'all';
    sortSelect.value = 'title-asc';

    render();
});

// Делегирование для удаления
cardsContainer.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const article = deleteBtn.closest('article');
        const id = article.dataset.id;
        state.items = state.items.filter(item => item.id !== id);

        // Если удалили последнюю книгу с выбранным жанром, сбрасываем фильтр на "Все"
        if (state.selectedGenre !== 'all' && !state.items.some(item => (item.genres || []).includes(state.selectedGenre))) {
            state.selectedGenre = 'all';
        }

        saveToLocalStorage();
        updateGenresUI();
        render();
    }
});

if (searchForm) searchForm.addEventListener('submit', (e) => e.preventDefault());

// Модальное окно
openModalBtn.addEventListener('click', () => {
    modal.hidden = false;
    addForm.reset();
    clearErrors();
    document.getElementById('new-title').focus();
});

function closeModal() { modal.hidden = true; }
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

// Валидация
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorSpan = formGroup.querySelector('.error-msg');
    if (errorSpan) errorSpan.textContent = message;
    input.classList.add('invalid');
}

function clearErrors() {
    document.querySelectorAll('#add-form .error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('#add-form input, #add-form select, #add-form textarea').forEach(el => el.classList.remove('invalid'));
}

addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const titleInput = document.getElementById('new-title');
    const statusInput = document.getElementById('new-status');
    const ratingInput = document.getElementById('new-rating');
    const descInput = document.getElementById('new-description');
    const imageInput = document.getElementById('new-image');

    const checkedGenres = Array.from(newGenresContainer.querySelectorAll('input:checked')).map(cb => cb.value);
    const genreError = document.getElementById('genre-error');

    let isValid = true;

    if (titleInput.validity.valueMissing) { showError(titleInput, 'Введите название'); isValid = false; }
    else if (titleInput.validity.tooShort) { showError(titleInput, `Минимум ${titleInput.minLength} символа`); isValid = false; }

    if (checkedGenres.length === 0) {
        genreError.textContent = 'Выберите хотя бы один жанр';
        isValid = false;
    }

    if (ratingInput.validity.valueMissing) { showError(ratingInput, 'Введите оценку'); isValid = false; }
    else if (ratingInput.validity.rangeUnderflow) { showError(ratingInput, 'Оценка не может быть меньше 1'); isValid = false; }
    else if (ratingInput.validity.rangeOverflow) { showError(ratingInput, 'Оценка не может быть больше 10'); isValid = false; }

    if (descInput.validity.valueMissing) { showError(descInput, 'Введите описание'); isValid = false; }
    else if (descInput.validity.tooShort) { showError(descInput, `Минимум ${descInput.minLength} символов`); isValid = false; }

    if (imageInput.validity.typeMismatch) { showError(imageInput, 'Введите корректный URL'); isValid = false; }

    if (!isValid) return;

    const newItem = {
        id: Date.now().toString(),
        title: titleInput.value.trim(),
        genres: checkedGenres,
        status: statusInput.value,
        rating: parseFloat(ratingInput.value),
        description: descInput.value.trim(),
        image: imageInput.value.trim() || 'https://placehold.co/300x400?text=No+Cover'
    };

    state.items.push(newItem);
    saveToLocalStorage();
    updateGenresUI();
    render();
    closeModal();
});

// Инициализация
loadFromLocalStorage();
updateGenresUI();
render();