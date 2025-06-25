const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const message = document.getElementById("message");

loginTab.addEventListener("click", () => {
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    message.textContent = "";
});

registerTab.addEventListener("click", () => {
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    message.textContent = "";
});

document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", () => {
        const input = document.getElementById(icon.dataset.target);
        input.type = input.type === "password" ? "text" : "password";
    });
});

// Реєстрація
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const phone = document.getElementById("phone").value.trim();
    const dob = new Date(document.getElementById("dob").value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const isBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && today.getDate() >= dob.getDate());

    const sex = document.querySelector("input[name='sex']:checked");
    const country = document.getElementById("country").value;
    const city = document.getElementById("city").value;

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^\+380\d{9}$/;

    if (firstName.length < 3 || lastName.length < 3) {
        message.textContent = "Ім'я та прізвище повинні містити 3-15 символів.";
        return;
    }

    if (!emailRegex.test(email)) {
        message.textContent = "Невірний формат Email.";
        return;
    }

    if (password.length < 6 || password !== confirmPassword) {
        message.textContent = "Паролі не збігаються або коротші за 6 символів.";
        return;
    }

    if (!phoneRegex.test(phone)) {
        message.textContent = "Невірний номер телефону (формат +380XXXXXXXXX).";
        return;
    }

    if (dob > today || (age < 12 || (age === 12 && !isBirthdayPassed))) {
        message.textContent = "Вам має бути не менше 12 років.";
        return;
    }

    if (!sex || !country || !city) {
        message.textContent = "Будь ласка, заповніть усі обов'язкові поля.";
        return;
    }

    message.style.color = "green";
    message.textContent = "Реєстрація успішна!";
});

// Динамічні міста
const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");

const cities = {
    ukraine: ["Київ", "Львів", "Одеса"],
    poland: ["Варшава", "Краків"]
};

countrySelect.addEventListener("change", () => {
    citySelect.innerHTML = '<option value="">Оберіть місто</option>';
    const selectedCountry = countrySelect.value;
    if (selectedCountry && cities[selectedCountry]) {
        cities[selectedCountry].forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
        citySelect.disabled = false;
    } else {
        citySelect.disabled = true;
    }
});
