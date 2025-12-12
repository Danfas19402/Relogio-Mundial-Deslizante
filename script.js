// Lista de fusos
const timezones = [
  { city: "São Paulo", tz: "America/Sao_Paulo" },
  { city: "Lisboa",  tz: "Europe/Lisbon" },
  { city: "Londres", tz: "Europe/London" },
  { city: "Nova York", tz: "America/New_York" },
  { city: "São Francisco", tz: "America/Los_Angeles" },
  { city: "Tóquio", tz: "Asia/Tokyo" },
  { city: "Sydney", tz: "Australia/Sydney" }
];

const slider = document.getElementById("slider");
const viewport = document.getElementById("viewport");
const dotsWrap = document.getElementById("dots");

let currentIndex = 0;
let cardWidth = 260;
let gap = 16;

// Criar card
function makeCard(t) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${t.city}</h2>
    <div class="time" data-tz="${t.tz}">--:--:--</div>
    <div class="date" data-tz-date="${t.tz}">--</div>
  `;
  return card;
}

// Construir slider
function buildSlider() {
  slider.innerHTML = "";
  dotsWrap.innerHTML = ""; // ← CORRIGIDO

  timezones.forEach((tz, i) => {
    slider.appendChild(makeCard(tz));

    const dot = document.createElement("div");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.dataset.index = i;
    dot.addEventListener("click", () => goToIndex(i));
    dotsWrap.appendChild(dot);
  });

  // descobrir gap do CSS
  const style = getComputedStyle(slider);
  gap = parseInt(style.gap) || 16;

  // descobrir tamanho real do card
  const card = slider.querySelector(".card");
  if (card) {
    cardWidth = card.getBoundingClientRect().width + gap;
  }
}

// Atualizar relógios
function updateTimes() {
  document.querySelectorAll(".time").forEach(el => {
    const tz = el.dataset.tz;
    el.textContent = new Intl.DateTimeFormat("pt-BR", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());
  });

  document.querySelectorAll(".date").forEach(el => {
    const tz = el.dataset.tzDate;
    el.textContent = new Intl.DateTimeFormat("pt-BR", {
      timeZone: tz,
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date());
  });
}

// Ir para slide
function goToIndex(i) {
  currentIndex = Math.max(0, Math.min(timezones.length - 1, i));
  slider.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
  updateDots();
}

function updateDots() {
  dotsWrap.querySelectorAll(".dot").forEach(dot => dot.classList.remove("active"));
  dotsWrap.querySelector(`.dot[data-index="${currentIndex}"]`).classList.add("active");
}

// Botões de navegação
document.querySelector(".prev").addEventListener("click", () => goToIndex(currentIndex - 1));
document.querySelector(".next").addEventListener("click", () => goToIndex(currentIndex + 1));

// Arrastar
let isDown = false, startX = 0;

viewport.addEventListener("pointerdown", e => {
  isDown = true;
  startX = e.clientX;
  slider.style.transition = "none";
  viewport.setPointerCapture(e.pointerId);
});

viewport.addEventListener("pointermove", e => {
  if (!isDown) return;
  const dx = e.clientX - startX;
  slider.style.transform = `translateX(${-(currentIndex * cardWidth) + dx}px)`;
});

viewport.addEventListener("pointerup", e => {
  isDown = false;
  slider.style.transition = "";

  const dx = e.clientX - startX;
  if (Math.abs(dx) > cardWidth / 3) {
    if (dx < 0) goToIndex(currentIndex + 1);
    else goToIndex(currentIndex - 1);
  } else {
    goToIndex(currentIndex);
  }
});

// Recalcular no resize
window.addEventListener("resize", () => {
  const card = slider.querySelector(".card");
  const style = getComputedStyle(slider);
  gap = parseInt(style.gap) || 16;

  if (card) cardWidth = card.getBoundingClientRect().width + gap;
  goToIndex(currentIndex);
});

// Tema claro/escuro
const themeBtn = document.getElementById("theme-toggle");

function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.classList.toggle("light", saved === "light");
    return;
  }
  const prefers = window.matchMedia("(prefers-color-scheme: light)").matches;
  document.documentElement.classList.toggle("light", prefers);
}
loadTheme();

themeBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
  const active = document.documentElement.classList.contains("light");
  localStorage.setItem("theme", active ? "light" : "dark");
});

// Init
buildSlider();
updateTimes();
setInterval(updateTimes, 1000);
