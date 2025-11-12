const track = document.getElementById('sliderTrack');
const slides = Array.from(track.children);
const leftBtn = document.querySelector('.nav-button.left');
const rightBtn = document.querySelector('.nav-button.right');
const dotsContainer = document.getElementById('dots');
const container = track.closest('.slider-container') || track.parentElement; // para pausar al hover

let index = 1;
let slideWidth = slides[0].getBoundingClientRect().width;

// Clonar primero y último slide para efecto infinito
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);
track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

const allSlides = Array.from(track.children);
track.style.transform = `translateX(-${slideWidth * index}px)`;

// Crear dots dinámicos
for (let i = 0; i < slides.length; i++) {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => {
    goToSlide(i + 1);
    restartAutoplay(); // 🔁 reinicia autoplay al usar dot
  });
  dotsContainer.appendChild(dot);
}

const updateDots = () => {
  const dots = dotsContainer.querySelectorAll('.dot');
  dots.forEach(dot => dot.classList.remove('active'));
  dots[(index - 1 + slides.length) % slides.length].classList.add('active');
};

const goToSlide = (newIndex) => {
  index = newIndex;
  track.style.transition = 'transform 0.5s ease';
  track.style.transform = `translateX(-${slideWidth * index}px)`;
  updateDots();
};

const nextSlide = () => {
  if (index >= allSlides.length - 1) return;
  index++;
  track.style.transition = 'transform 0.5s ease';
  track.style.transform = `translateX(-${slideWidth * index}px)`;
  updateDots();
};

const prevSlide = () => {
  if (index <= 0) return;
  index--;
  track.style.transition = 'transform 0.5s ease';
  track.style.transform = `translateX(-${slideWidth * index}px)`;
  updateDots();
};

track.addEventListener('transitionend', () => {
  if (allSlides[index].isEqualNode(firstClone)) {
    index = 1;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }
  if (allSlides[index].isEqualNode(lastClone)) {
    index = allSlides.length - 2;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }
});

// Botones
rightBtn.addEventListener('click', () => { nextSlide(); restartAutoplay(); });
leftBtn.addEventListener('click', () => { prevSlide(); restartAutoplay(); });

// Resize
window.addEventListener('resize', () => {
  slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transition = 'none';
  track.style.transform = `translateX(-${slideWidth * index}px)`;
});

// =========================
//     AUTOPLAY (5s)
// =========================
const intervalMs = 5000; // ⏱️ cambia aquí si quieres otro tiempo
let timerId = null;

function startAutoplay() {
  stopAutoplay(); // evitar timers duplicados
  timerId = setInterval(() => {
    // por si el ancho cambió (responsivo)
    slideWidth = slides[0].getBoundingClientRect().width;
    nextSlide();
  }, intervalMs);
}

function stopAutoplay() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function restartAutoplay() {
  stopAutoplay();
  startAutoplay();
}

// Pausar al pasar el mouse (desktop)
if (container) {
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);
}

// Pausar si la pestaña no está visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopAutoplay();
  else startAutoplay();
});

// Arrancar autoplay al cargar
startAutoplay();
