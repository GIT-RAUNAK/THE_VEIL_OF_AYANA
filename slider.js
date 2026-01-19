const cards = Array.from(document.querySelectorAll(".card"));

cards.forEach(card => {
  const img = card.dataset.image;
  if (img) {
    card.style.backgroundImage = `url("${img}")`;
  }
});

const totalCards = cards.length;
const body = document.body;

const heroTitle  = document.getElementById("hero-title");
const heroSeason = document.getElementById("hero-season");
const heroMeta   = document.getElementById("hero-meta");
const heroDesc   = document.getElementById("hero-desc");

const watchTrailerBtn = document.getElementById("watchTrailer");
const knowMoreBtn     = document.getElementById("knowMore");

let activeIndex       = 0;
let sliderInterval    = null;
let isTransitioning   = false;
let lastBg            = "";

function toggleButton(btn, url) {
  if (!btn) return;

  if (!url) {
    btn.classList.add("disabled");
    btn.removeAttribute("href");
  } else {
    btn.classList.remove("disabled");
    btn.href = url;
  }
}

function updateHeroContent(card) {
  if (!card || isTransitioning) return;

  const bg = card.dataset.bg;
  if (bg === lastBg) return;

  isTransitioning = true;
  lastBg = bg;

  body.classList.add("bg-fade");

  const img = new Image();
  img.src = bg;

  img.onload = () => {
    body.style.backgroundImage = `url("${bg}")`;

    heroTitle.innerHTML  = card.dataset.title  || "";
    heroSeason.innerHTML = card.dataset.season || "";
    heroMeta.innerHTML   = card.dataset.meta   || "";
    heroDesc.innerHTML   = card.dataset.desc   || "";

    toggleButton(watchTrailerBtn, card.dataset.trailer);
    toggleButton(knowMoreBtn, card.dataset.more);

    body.classList.remove("bg-fade");
    isTransitioning = false;
  };

  img.onerror = () => {
    body.classList.remove("bg-fade");
    isTransitioning = false;
  };
}

function updateSlider() {
  cards.forEach(card => {
    card.classList.remove("active", "prev", "next");
  });

  const activeCard = cards[activeIndex];
  const nextCard   = cards[(activeIndex + 1) % totalCards];
  const prevCard   = cards[(activeIndex - 1 + totalCards) % totalCards];

  activeCard.classList.add("active");
  nextCard.classList.add("next");
  prevCard.classList.add("prev");

  updateHeroContent(activeCard);
}

function startAutoSlide() {
  stopAutoSlide();

  sliderInterval = setInterval(() => {
    if (isTransitioning) return;

    activeIndex = (activeIndex + 1) % totalCards;
    updateSlider();
  }, 4500);
}

function stopAutoSlide() {
  if (!sliderInterval) return;

  clearInterval(sliderInterval);
  sliderInterval = null;
}

cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (isTransitioning || index === activeIndex) return;

    stopAutoSlide();

    if (index === (activeIndex + 1) % totalCards) {
      activeIndex++;
    } else if (index === (activeIndex - 1 + totalCards) % totalCards) {
      activeIndex--;
    } else {
      activeIndex = index;
    }

    activeIndex = (activeIndex + totalCards) % totalCards;

    updateSlider();
    startAutoSlide();
  });
});

updateSlider();
startAutoSlide();

/* ================= TOUCH SUPPORT ================= */

let touchStartX = 0;
let touchEndX   = 0;
let isSwiping   = false;

const cardStage = document.querySelector(".hero-cards");

if (cardStage) {
  cardStage.addEventListener(
    "touchstart",
    e => {
      if (isTransitioning) return;

      touchStartX = e.touches[0].clientX;
      isSwiping = true;
      stopAutoSlide();
    },
    { passive: true }
  );

  cardStage.addEventListener(
    "touchmove",
    e => {
      if (!isSwiping) return;

      touchEndX = e.touches[0].clientX;
    },
    { passive: true }
  );

  cardStage.addEventListener(
    "touchend",
    () => {
      if (!isSwiping || isTransitioning) return;

      const deltaX = touchEndX - touchStartX;

      if (Math.abs(deltaX) > 40) {
        activeIndex =
          deltaX < 0
            ? (activeIndex + 1) % totalCards
            : (activeIndex - 1 + totalCards) % totalCards;

        updateSlider();
      }

      isSwiping = false;
      startAutoSlide();
    },
    { passive: true }
  );
}

/* ================= MOBILE MENU ================= */

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
  });
}
