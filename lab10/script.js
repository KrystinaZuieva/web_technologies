/* === Utility === */
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];
const by = (fn) => (a, b) => fn(a) > fn(b) ? 1 : -1;
const debounce = (fn, ms = 400) => {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, a), ms); };
};

/* === Constants === */
const API_URL = 'https://randomuser.me/api/';
const RESULTS = 30; // per page
const SEED = 'friendfinder2025';

/* === State === */
let userState = {
    page: 1,
    loadedPages: new Set(),
    users: [],
    search: '',
    sort: 'name-asc',
    filters: { ageMin: '', ageMax: '', country: '', email: '' },
    favorites: loadFavorites()
};

function loadFavorites() {
    return JSON.parse(localStorage.getItem('friendFinderFavorites') || '[]');
}
function saveFavorites(arr) {
    localStorage.setItem('friendFinderFavorites', JSON.stringify(arr));
}

/* === Authentication === */
const root = qs('#root');
const currentUser = JSON.parse(localStorage.getItem('friendFinderUser') || 'null');
if (!currentUser) {
    showAuthForm();
} else {
    renderApp();
}

function showAuthForm() {
    root.innerHTML = `<form id="auth"><h2>Friend Finder</h2>
    <input type="email" name="email" placeholder="Е-мейл" required />
    <input type="password" name="pass" placeholder="Пароль" required />
    <button type="submit">Увійти</button>
  </form>`;
    qs('#auth').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim();
        if (!email) return;
        localStorage.setItem('friendFinderUser', JSON.stringify({ email }));
        renderApp();
    });
}

/* === Fetch users === */
async function fetchPage(page) {
    const url = `${API_URL}?results=${RESULTS}&page=${page}&seed=${SEED}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    return data.results;
}

/* === Filters & Sorting === */
const applySearch = (u, term) => term ? (`${u.name.first} ${u.name.last}`.toLowerCase().includes(term.toLowerCase())) : true;
const applyFilters = (u, f) => {
    const age = u.dob.age;
    if (f.ageMin && age < +f.ageMin) return false;
    if (f.ageMax && age > +f.ageMax) return false;
    if (f.country && !u.location.country.toLowerCase().includes(f.country.toLowerCase())) return false;
    if (f.email && !u.email.toLowerCase().includes(f.email.toLowerCase())) return false;
    return true;
};
const sorters = {
    'name-asc': by(u => u.name.first),
    'name-desc': (a, b) => by(u => u.name.first)(b, a),
    'age-asc': by(u => u.dob.age),
    'age-desc': (a, b) => by(u => u.dob.age)(b, a),
    'reg-asc': by(u => new Date(u.registered.date)),
    'reg-desc': (a, b) => by(u => new Date(u.registered.date))(b, a)
};

/* === Render === */
async function renderApp() {
    root.innerHTML = `<header><h1>Friend Finder</h1><div class="user"><span>${JSON.parse(localStorage.getItem('friendFinderUser')).email}</span><button id="logout">Logout</button></div></header>
    <main>
      <section class="controls">
        <input type="search" id="search" placeholder="Пошук за ім'ям…" />
        <select id="sort">
          <option value="name-asc">Ім'я A→Z</option>
          <option value="name-desc">Ім'я Z→A</option>
          <option value="age-asc">Вік ↑</option>
          <option value="age-desc">Вік ↓</option>
          <option value="reg-asc">Реєстрація ↑</option>
          <option value="reg-desc">Реєстрація ↓</option>
        </select>
        <input type="number" id="ageMin" placeholder="Вік від" min="0" />
        <input type="number" id="ageMax" placeholder="Вік до" min="0" />
        <input type="search" id="country" placeholder="Країна" />
        <input type="search" id="email" placeholder="Е-мейл" />
      </section>
      <section id="grid" class="grid"></section>
      <div id="sentinel" class="center"></div>
      <nav id="pager" class="pagination"></nav>
    </main>`;

    qs('#logout').onclick = () => {
        localStorage.removeItem('friendFinderUser');
        location.reload();
    };

    // Restore state from URL
    readURLParams();
    // Attach listeners
    qs('#search').value = userState.search;
    qs('#search').addEventListener('input', debounce((e) => {
        userState.search = e.target.value.trim();
        updateURL();
        refreshGrid();
    }, 300));
    qs('#sort').value = userState.sort;
    qs('#sort').onchange = (e) => { userState.sort = e.target.value; updateURL(); refreshGrid(); };
    ['ageMin','ageMax','country','email'].forEach(id => {
        qs(`#${id}`).value = userState.filters[id] || '';
        qs(`#${id}`).addEventListener('input', debounce((e) => {
            userState.filters[id] = e.target.value.trim(); updateURL(); refreshGrid();
        }, 300));
    });

    // Infinite scroll
    const io = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
            await loadNextPage();
        }
    }, { rootMargin: '200px' });
    io.observe(qs('#sentinel'));

    // Initial load
    await loadNextPage();
}

async function loadNextPage() {
    const p = userState.page;
    if (userState.loadedPages.has(p)) return; // already fetched
    try {
        const users = await fetchPage(p);
        userState.users.push(...users);
        userState.loadedPages.add(p);
        userState.page++;
        refreshGrid();
    } catch (e) {
        showError(e);
    }
}

function refreshGrid() {
    const grid = qs('#grid');
    if (!grid) return;
    const filtered = userState.users
        .filter(u => applySearch(u, userState.search) && applyFilters(u, userState.filters))
        .sort(sorters[userState.sort]);

    grid.innerHTML = '';
    const tpl = qs('#card-tpl').content;
    filtered.forEach(u => {
        const node = tpl.cloneNode(true);
        const img = qs('img', node);
        img.src = u.picture.large;
        img.alt = `${u.name.first} ${u.name.last}`;
        qs('h2', node).textContent = `${u.name.first} ${u.name.last}`;
        qs('.age', node).textContent = `Вік: ${u.dob.age}`;
        qs('.phone', node).textContent = u.phone;
        const favBtn = qs('.fav', node);
        favBtn.classList.toggle('active', userState.favorites.includes(u.login.uuid));
        favBtn.onclick = () => toggleFav(u.login.uuid, favBtn);
        grid.appendChild(node);
    });

    renderPagination();
}

function toggleFav(id, el) {
    const idx = userState.favorites.indexOf(id);
    if (idx >= 0) userState.favorites.splice(idx, 1);
    else userState.favorites.push(id);
    saveFavorites(userState.favorites);
    el.classList.toggle('active');
}

function renderPagination() {
    const nav = qs('#pager');
    if (!nav) return;
    nav.innerHTML = '';
    const pages = [...userState.loadedPages].sort((a,b)=>a-b);
    pages.forEach(p => {
        const btn = document.createElement('button');
        btn.textContent = p;
        btn.classList.toggle('active', p === userState.page - 1);
        btn.onclick = () => { scrollToPage(p); };
        nav.appendChild(btn);
    });
}

function scrollToPage(page) {
    const cardsPerPage = RESULTS;
    const index = (page - 1) * cardsPerPage;
    const card = qs('#grid').children[index];
    card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(err) {
    const grid = qs('#grid');
    grid.innerHTML = `<p class="error">Помилка завантаження даних (status ${err.message}). Спробуйте пізніше.</p>`;
}

/* === URL Sync === */
function updateURL() {
    const params = new URLSearchParams();
    if (userState.search) params.set('q', userState.search);
    params.set('sort', userState.sort);
    Object.entries(userState.filters).forEach(([k,v]) => { if (v) params.set(k, v); });
    history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
}
function readURLParams() {
    const p = new URLSearchParams(location.search);
    userState.search = p.get('q') || '';
    userState.sort = p.get('sort') || 'name-asc';
    ['ageMin','ageMax','country','email'].forEach(k => userState.filters[k] = p.get(k) || '');
}

window.addEventListener('popstate', () => {
    readURLParams();
    refreshGrid();
});
