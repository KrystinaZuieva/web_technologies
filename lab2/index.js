// 1. Оператори порівняння
function findMaxMin() {
    let numbers = prompt("Введіть масив чисел через кому (наприклад, 1,2,3,4,5):");
    numbers = numbers.split(',').map(Number);  // Перетворення в масив чисел

    const max = Math.max(...numbers);
    const min = Math.min(...numbers);
    console.log(`Максимальний елемент: ${max}, Мінімальний елемент: ${min}`);
}

function compareObjects() {
    let obj1 = prompt("Введіть перший об'єкт у форматі JSON (наприклад, {\"name\": \"John\", \"age\": 25}):");
    let obj2 = prompt("Введіть другий об'єкт у форматі JSON:");

    obj1 = JSON.parse(obj1);
    obj2 = JSON.parse(obj2);

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        console.log("Об'єкти не рівні (різна кількість властивостей).");
        return false;
    }

    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
            console.log("Об'єкти не рівні (різні значення властивостей).");
            return false;
        }
    }
    console.log(`Об'єкти рівні: ${JSON.stringify(obj1)} === ${JSON.stringify(obj2)}`);
    return true;
}

// 2. Логічні оператори
function checkNumberInRange() {
    let num = prompt("Введіть число для перевірки:");
    let min = prompt("Введіть мінімальне значення діапазону:");
    let max = prompt("Введіть максимальне значення діапазону:");

    num = Number(num);
    min = Number(min);
    max = Number(max);

    if (num >= min && num <= max) {
        console.log(`${num} знаходиться в діапазоні ${min} - ${max}`);
    } else {
        console.log(`${num} не знаходиться в діапазоні ${min} - ${max}`);
    }
}

function toggleBooleanState() {
    let state = prompt("Введіть поточний стан (true або false):");
    state = (state === 'true');

    let toggledState = !state;
    console.log(`Нове значення: ${toggledState}`);
    return toggledState;
}

// 3. Умовні розгалуження
function getGradeDescription() {
    let grade = prompt("Введіть оцінку студента:");
    grade = Number(grade);

    let description;
    if (grade >= 90) {
        description = 'Відмінно';
    } else if (grade >= 70) {
        description = 'Добре';
    } else if (grade >= 50) {
        description = 'Задовільно';
    } else {
        description = 'Незадовільно';
    }
    console.log(`Оцінка: ${description}`);
}

// Використання вкладених умов для визначення сезону
function getSeason() {
    let month = prompt("Введіть місяць для визначення сезону:");
    month = Number(month);

    // Визначаємо сезон за допомогою вкладених умовних операторів
    if (month >= 1 && month <= 2 || month === 12) {
        console.log(`Місяць: ${month} - Сезон: Зима`);
    } else if (month >= 3 && month <= 5) {
        console.log(`Місяць: ${month} - Сезон: Весна`);
    } else if (month >= 6 && month <= 8) {
        console.log(`Місяць: ${month} - Сезон: Літо`);
    } else if (month >= 9 && month <= 11) {
        console.log(`Місяць: ${month} - Сезон: Осінь`);
    } else {
        console.log("Невірний місяць");
    }

    // Використання оператора тернарного виразу (?)
    let season = (month >= 1 && month <= 2 || month === 12) ? "Зима" :
        (month >= 3 && month <= 5) ? "Весна" :
            (month >= 6 && month <= 8) ? "Літо" :
                (month >= 9 && month <= 11) ? "Осінь" : "Невірний місяць";
    console.log(`Місяць: ${month} - Сезон (тернарний оператор): ${season}`);
}

// Виклик функцій
findMaxMin();
getGradeDescription();
checkNumberInRange();
let toggleState = true;
toggleState = toggleBooleanState();
compareObjects();
getSeason();
