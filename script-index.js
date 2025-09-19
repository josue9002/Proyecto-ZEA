const sliderContainer = document.getElementById('slider-container');
const slider = document.getElementById('slider');
const buttonLeft = document.getElementById('button-left');
const buttonRight = document.getElementById('button-right');

const sliderElements = document.querySelectorAll('.slider__element');
const rootStyles = document.documentElement.style;

let slideCounter = 0;
let isInTransition = false;
const DIRECTION = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT'
};

const getTransformValue = () =>
  Number(rootStyles.getPropertyValue('--slide-transform').replace('px', ''));

const reorderSlide = () => {
  const transformValue = getTransformValue();
  rootStyles.setProperty('--transition', 'none');
  if (slideCounter === sliderElements.length - 1) {
    slider.appendChild(slider.firstElementChild);
    rootStyles.setProperty(
      '--slide-transform',
      `${transformValue + sliderElements[slideCounter].scrollWidth}px`
    );
    slideCounter--;
  } else if (slideCounter === 0) {
    slider.prepend(slider.lastElementChild);
    rootStyles.setProperty(
      '--slide-transform',
      `${transformValue - sliderElements[slideCounter].scrollWidth}px`
    );
    slideCounter++;
  }

  isInTransition = false;
};

const moveSlide = direction => {
  if (isInTransition) return;
  const transformValue = getTransformValue();
  rootStyles.setProperty('--transition', 'transform 1s');
  isInTransition = true;
  if (direction === DIRECTION.LEFT) {
    rootStyles.setProperty(
      '--slide-transform',
      `${transformValue + sliderElements[slideCounter].scrollWidth}px`
    );
    slideCounter--;
  } else if (direction === DIRECTION.RIGHT) {
    rootStyles.setProperty(
      '--slide-transform',
      `${transformValue - sliderElements[slideCounter].scrollWidth}px`
    );
    slideCounter++;
  }
};

buttonRight.addEventListener('click', () => moveSlide(DIRECTION.RIGHT));
buttonLeft.addEventListener('click', () => moveSlide(DIRECTION.LEFT));

slider.addEventListener('transitionend', reorderSlide);

reorderSlide();

// Cambio automático cada 10 segundos
setInterval(() => {
  moveSlide(DIRECTION.RIGHT);
}, 7000); // 10000 milisegundos = 10 segundos

  // Bloquear copiar/cortar/pegar en texto
  document.addEventListener('copy', e => e.preventDefault());
  document.addEventListener('cut', e => e.preventDefault());
  document.addEventListener('paste', e => e.preventDefault());

  // Bloquear clic derecho en todo el documento
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Bloquear arrastre de imágenes
  document.addEventListener('dragstart', e => e.preventDefault());

  // Opcional: bloquear combinaciones de teclado comunes (Ctrl/Cmd + S, U, C, A, X, P)
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && ['s','u','c','a','x','p'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  });
