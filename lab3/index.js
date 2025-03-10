// 1. Знаходження суми перших 50 натуральних чисел (цикл while)
function sumFirst50() {
    let sum = 0, i = 1;
    while (i <= 50) {
        sum += i;
        i++;
    }
    console.log("Завдання 1: Сума перших 50 натуральних чисел:", sum);
}

// 2. Обчислення факторіала числа (цикл for)
function factorial(n) {
    if (n < 0) return "Факторіал не визначений для від’ємних чисел";
    let fact = 1;
    for (let i = 1; i <= n; i++) {
        fact *= i;
    }
    console.log("Завдання 2: Факторіал числа", n, "дорівнює", fact);
}

// 3. Визначення місяця за номером (switch)
function getMonthName(month) {
    let monthName;
    switch (Number(month)) {
        case 1: monthName = "Січень"; break;
        case 2: monthName = "Лютий"; break;
        case 3: monthName = "Березень"; break;
        case 4: monthName = "Квітень"; break;
        case 5: monthName = "Травень"; break;
        case 6: monthName = "Червень"; break;
        case 7: monthName = "Липень"; break;
        case 8: monthName = "Серпень"; break;
        case 9: monthName = "Вересень"; break;
        case 10: monthName = "Жовтень"; break;
        case 11: monthName = "Листопад"; break;
        case 12: monthName = "Грудень"; break;
        default: monthName = "Некоректне число";
    }
    console.log("Завдання 3: Місяць номер", month, "- це", monthName);
}

// 4. Сума всіх парних чисел у масиві
function sumEvenNumbers(arr) {
    let sum = arr.filter(num => num % 2 === 0).reduce((acc, num) => acc + num, 0);
    console.log("Завдання 4: Сума парних чисел у масиві:", sum);
}

// 5. Підрахунок голосних у рядку (стрілкова функція)
const countVowels = str => {
    let count = (str.match(/[aeiouаеєиіїоуюя]/gi) || []).length;
    console.log("Завдання 5: Кількість голосних у рядку:", count);
};

// 6. Піднесення числа до степеня
function power(base, exponent) {
    let result = Math.pow(base, exponent);
    console.log("Завдання 6:", base, "в степені", exponent, "дорівнює", result);
}