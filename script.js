//-------------------------------------
// Lista de cidades com fuso horário
//-------------------------------------
const cities = [
  { name: "Brasília", tz: "America/Sao_Paulo" },
  { name: "Nova York", tz: "America/New_York" },
  { name: "Tóquio", tz: "Asia/Tokyo" },
  { name: "Londres", tz: "Europe/London" },
  { name: "Sydney", tz: "Australia/Sydney" },
];

//-------------------------------------
// Criar cards dinamicamente
//-------------------------------------
const slider = document.getElementById("slider");
const dotsContainer = document.getElementById("dots");

cities.forEach((city, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${city.name}</h2>
    <div class="time" id="time-${i}">00:00:00</div>
  `;
  slider.appendChild(card);

  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  dotsContainer.appendChild(dot);
});

const dots = [...document.querySelectorAll(".dots span")];

//-------------------------------------
// Relógio atualizado a cada segundo
//-------------------------------------
function updateClocks() {
  cities.forEach((c, i) => {
    const time = new Date().toLocaleTimeString("pt-BR", {
      timeZone: c.tz,
      hour12: false,
    });
    document.getElementById(`time-${i}`).textContent = time;
  });
}

setInterval(updateClocks, 1000);
updateClocks();

//-------------------------------------
// Slider
//-------------------------------------
let current = 0;

function updateSlider() {
  const cardWidth = slider.children[0].offsetWidth + 20; // margem
  slider.style.transform = `translateX(${-current * cardWidth}px)`;

  dots.forEach((d, i) => d.classList.toggle("active", i === current));
}

document.querySelector(".prev").onclick = () => {
  current = (current - 1 + cities.length) % cities.length;
  updateSlider();
};

document.querySelector(".next").onclick = () => {
  current = (current + 1) % cities.length;
  updateSlider();
};

dots.forEach((dot, i) => {
  dot.onclick = () => {
    current = i;
    updateSlider();
  };
});

//-------------------------------------
// Tema Claro/Escuro
//-------------------------------------
const btnTheme = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  btnTheme.textContent = theme === "dark" ? "☀️" : "🌙";
}

function loadTheme() {
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
}

btnTheme.onclick = () => {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
};

loadTheme();


