(() => {
    /* ---------------------- DOM helpers --------------------- */
    const $ = (id) => document.getElementById(id);

    /* ---------------------- Константи ----------------------- */
    const emojiSet = [
        "🍎","🚗","🐶","🏀","🎵","🌟","🍕","🎲","🎈","📚","🚀","🏖️",
        "🍩","🎧","🐱","🦋","⚽️","🎹","🪁","🌈","🍇","🚢","🦄","🥑"
    ];
    const diffSeconds = { easy: 180, normal: 120, hard: 60 };

    /* ---------------------- Стан гри ------------------------- */
    let settings = {
        rows: 4,
        cols: 3,
        difficulty: "easy",
        players: 1,
        rounds: 1,
        names: ["Player 1", "Player 2"],
    };

    let deck = [],
        flipped = [],
        moves = [0, 0],
        matchesPerPlayer = [0, 0],
        currentPlayer = 0,
        round = 1,
        timer = diffSeconds[settings.difficulty],
        timerInt = null,
        results = [];

    /* ---------------------- DOM посилання -------------------- */
    const boardEl = $("board");
    const timerEl = $("timer");
    const movesEl = $("moves");
    const currentPlayerEl = $("currentPlayer");
    const statsEl = $("stats");
    const restartBtn = $("restartBtn");
    const resultsEl = $("results");
    const settingsModal = $("settingsModal");
    const openSettingsBtn = $("openSettings");

    /* --- поля налаштувань --- */
    const rowsInput = $("rowsInput");
    const colsInput = $("colsInput");
    const difficultySelect = $("difficultySelect");
    const playersSelect = $("playersSelect");
    const name1Input = $("name1Input");
    const name2Input = $("name2Input");
    const roundsInput = $("roundsInput");
    const player2Label = $("player2Label");
    const startGameBtn = $("startGame");
    const resetSettingsBtn = $("resetSettings");

    /* -------------------- Утиліти --------------------------- */
    const shuffle = (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    const formatTime = (sec) => {
        const m = String(Math.floor(sec / 60)).padStart(2, "0");
        const s = String(sec % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    /* ------------------- Генерація колоди ------------------- */
    function generateDeck() {
        const total = settings.rows * settings.cols;
        const pairCount = total / 2;
        const values = shuffle(emojiSet).slice(0, pairCount);
        let id = 0;
        return shuffle(
            values.flatMap((v) => [
                { id: id++, value: v, matched: false, foundBy: null },
                { id: id++, value: v, matched: false, foundBy: null },
            ])
        );
    }

    /* ------------------ Створити DOM‑картку ----------------- */
    function createCard(cardObj, index) {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.index = index;
        card.innerHTML = `
      <div class="card-inner">
        <div class="card-face front">${cardObj.value}</div>
        <div class="card-face back">?</div>
      </div>
    `;
        card.addEventListener("click", onCardClick);
        return card;
    }

    /* ------------------- Почати / перезапустити раунд --------------- */
    function initRound(initial = false) {
        const totalCards = settings.rows * settings.cols;
        if (totalCards % 2 !== 0) {
            alert("Поле повинно містити парну кількість карток!");
            return;
        }

        deck = generateDeck();
        flipped = [];
        moves = [0, 0];
        matchesPerPlayer = [0, 0];
        currentPlayer = 0;
        timer = diffSeconds[settings.difficulty];

        /* оновити сітку */
        boardEl.style.gridTemplateColumns = `repeat(${settings.cols}, 1fr)`;
        boardEl.innerHTML = "";
        deck.forEach((c, i) => boardEl.appendChild(createCard(c, i)));

        /* оновлення статистики */
        timerEl.textContent = formatTime(timer);
        currentPlayerEl.textContent = `${settings.names[0]} ходить`;
        movesEl.textContent = "Ходи: 0";
        statsEl.classList.remove("hidden");
        resultsEl.classList.add("hidden");

        /* таймер */
        clearInterval(timerInt);
        timerInt = setInterval(() => {
            timer--;
            timerEl.textContent = formatTime(timer);
            if (timer === 0) {
                endRound();
            }
        }, 1000);
    }

    /* ------------------- Обробник кліку по картці --------------- */
    function onCardClick(e) {
        const idx = parseInt(e.currentTarget.dataset.index);
        const cardData = deck[idx];
        const cardEl = e.currentTarget;

        if (
            cardData.matched ||
            flipped.includes(idx) ||
            flipped.length === 2 ||
            timer === 0
        )
            return;

        cardEl.classList.add("flipped");
        flipped.push(idx);

        if (flipped.length === 2) {
            const [aIdx, bIdx] = flipped;
            const first = deck[aIdx];
            const second = deck[bIdx];

            if (first.value === second.value) {
                /* --- PARА --- */
                first.matched = second.matched = true;
                first.foundBy = second.foundBy = currentPlayer;
                matchesPerPlayer[currentPlayer]++;

                setTimeout(() => {
                    /* перевірити завершення раунду */
                    if (matchesPerPlayer[currentPlayer] + matchesPerPlayer[1 - currentPlayer] === deck.length / 2) {
                        endRound();
                    }
                }, 400);
            } else {
                /* --- НЕ ПАРА --- */
                setTimeout(() => {
                    document.querySelectorAll(
                        `.card[data-index='${aIdx}'], .card[data-index='${bIdx}']`
                    ).forEach((el) => el.classList.remove("flipped"));
                    if (settings.players === 2) {
                        currentPlayer = 1 - currentPlayer;
                        currentPlayerEl.textContent = `${settings.names[currentPlayer]} ходить`;
                    }
                }, 800);
            }

            /* оновити ходи */
            moves[currentPlayer]++;
            movesEl.textContent = `Ходи: ${moves[currentPlayer]}`;

            /* очистити flipped */
            flipped = [];
        }
    }

    /* ------------------- Завершення раунду ------------------- */
    function endRound() {
        clearInterval(timerInt);

        /* визначити переможця раунду */
        let winnerIdx = 0;
        if (settings.players === 2) {
            if (matchesPerPlayer[0] === matchesPerPlayer[1]) {
                winnerIdx = moves[0] <= moves[1] ? 0 : 1;
            } else {
                winnerIdx = matchesPerPlayer[0] > matchesPerPlayer[1] ? 0 : 1;
            }
        }

        results.push({ round, moves: [...moves], timeLeft: timer, winnerIndex: winnerIdx });

        if (round < settings.rounds) {
            round++;
            initRound();
        } else {
            showResults();
        }
    }

    /* ------------------- Показати фінал ------------------- */
    function showResults() {
        statsEl.classList.add("hidden");
        resultsEl.classList.remove("hidden");
        let html = "<h2>Фінальні результати</h2>";
        results.forEach((r) => {
            html += `<p><strong>Раунд ${r.round}</strong>: Переможець — ${settings.names[r.winnerIndex]}</p>`;
            if (settings.players === 2) {
                html += `<p class="small">${settings.names[0]}: ${r.moves[0]} ходів | ${settings.names[1]}: ${r.moves[1]} ходів</p>`;
            } else {
                html += `<p class="small">Ходи: ${r.moves[0]}</p>`;
            }
            html += `<p class="small">Залишилось часу: ${formatTime(r.timeLeft)}</p><hr/>`;
        });
        resultsEl.innerHTML = html;
    }

    /* ------------------- Робота з налаштуваннями ------------------ */
    function applySettings() {
        settings = {
            rows: parseInt(rowsInput.value),
            cols: parseInt(colsInput.value),
            difficulty: difficultySelect.value,
            players: parseInt(playersSelect.value),
            rounds: parseInt(roundsInput.value),
            names: [name1Input.value || "Player 1", name2Input.value || "Player 2"],
        };
        round = 1;
        results = [];
    }

    function resetSettings() {
        rowsInput.value = 4;
        colsInput.value = 3;
        difficultySelect.value = "easy";
        playersSelect.value = "1";
        name1Input.value = "Player 1";
        name2Input.value = "Player 2";
        roundsInput.value = 1;
        player2Label.classList.add("hidden");
    }

    /* ------------------- Події UI ------------------ */
    openSettingsBtn.addEventListener("click", () => {
        settingsModal.classList.remove("hidden");
    });

    playersSelect.addEventListener("change", () => {
        player2Label.classList.toggle("hidden", playersSelect.value === "1");
    });

    startGameBtn.addEventListener("click", () => {
        applySettings();
        settingsModal.classList.add("hidden");
        initRound();
    });

    resetSettingsBtn.addEventListener("click", resetSettings);
    restartBtn.addEventListener("click", () => initRound());

    /* ------------------- Ініціалізація при завантаженні --------------- */
    resetSettings();
})();
