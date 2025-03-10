const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 1. Оператори порівняння
// Функція для знаходження мінімального та максимального значення у масиві
function findMinMax(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    let min = arr[0], max = arr[0];
    for (let num of arr) {
        if (num < min) min = num;
        if (num > max) max = num;
    }
    return { min, max };
}

// Функція для порівняння двох об'єктів за властивостями
function compareObjects(obj1, obj2) {
    if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
    let keys1 = Object.keys(obj1), keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => obj1[key] === obj2[key]);
}

// 2. Логічні оператори
// Функція для перевірки, чи число знаходиться в діапазоні
function isInRange(num, min, max) {
    return typeof num === 'number' && num >= min && num <= max;
}

// Функція для зміни стану змінної
function toggleBoolean(value) {
    return !value;
}

// 3. Умовні розгалуження
// Функція для отримання оцінки студента у словесному форматі
function getGradeDescription(grade) {
    if (typeof grade !== 'number' || grade < 0 || grade > 100) return "Некоректна оцінка";
    if (grade >= 90) return "Відмінно";
    if (grade >= 75) return "Добре";
    if (grade >= 60) return "Задовільно";
    return "Незадовільно";
}

// Функція для визначення сезону за місяцем (if)
function getSeasonIf(month) {
    if (typeof month !== 'number' || month < 1 || month > 12) return "Некоректний місяць";
    if (month >= 3 && month <= 5) return "Весна";
    if (month >= 6 && month <= 8) return "Літо";
    if (month >= 9 && month <= 11) return "Осінь";
    return "Зима";
}

// Функція для визначення сезону за місяцем (? оператор)
function getSeasonTernary(month) {
    return (typeof month !== 'number' || month < 1 || month > 12) ? "Некоректний місяць" :
        (month >= 3 && month <= 5) ? "Весна" :
            (month >= 6 && month <= 8) ? "Літо" :
                (month >= 9 && month <= 11) ? "Осінь" : "Зима";
}

// Взаємодія з користувачем через консоль
rl.question("Введіть масив чисел через пробіл: ", (input) => {
    let numbers = input.split(" ").map(Number);
    console.log("Мінімальне та максимальне значення: ", findMinMax(numbers));

    rl.question("Введіть два числа для перевірки діапазону (мін і макс): ", (rangeInput) => {
        let [min, max] = rangeInput.split(" ").map(Number);
        rl.question("Введіть число для перевірки: ", (num) => {
            console.log("Число в діапазоні: ", isInRange(Number(num), min, max));

            rl.question("Введіть оцінку студента: ", (grade) => {
                console.log("Оцінка: ", getGradeDescription(Number(grade)));

                rl.question("Введіть номер місяця: ", (month) => {
                    console.log("Сезон (if): ", getSeasonIf(Number(month)));
                    console.log("Сезон (тернарний оператор): ", getSeasonTernary(Number(month)));
                    rl.close();
                });
            });
        });
    });
});
