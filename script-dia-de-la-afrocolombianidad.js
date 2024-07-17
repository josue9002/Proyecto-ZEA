// Selecciona todas las imágenes de la galería
const galleryItems = document.querySelectorAll('.gallery-item');
// Selecciona el lightbox y su contenido
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentIndex = 0;

// Añade un evento click a cada imagen de la galería
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = item.src;
        currentIndex = index;
    });
});

// Cierra el lightbox cuando se hace click en el botón de cerrar
closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

// Cierra el lightbox cuando se hace click fuera de la imagen
lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg && e.target !== prevBtn && e.target !== nextBtn) {
        lightbox.style.display = 'none';
    }
});

// Muestra la imagen anterior
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
    lightboxImg.src = galleryItems[currentIndex].src;
});

// Muestra la siguiente imagen
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
    lightboxImg.src = galleryItems[currentIndex].src;
});
