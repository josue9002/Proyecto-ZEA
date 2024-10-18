function toggleText(element) {
    const contentWrapper = element.nextElementSibling;
    const text = contentWrapper.querySelector('.text');
    const arrow = element.querySelector('.arrow');
    if (contentWrapper.style.height === '0px' || contentWrapper.style.height === '') {
        contentWrapper.style.height = text.scrollHeight + 'px';
        arrow.classList.add('up');
    } else {
        contentWrapper.style.height = '0';
        arrow.classList.remove('up');
    }
}

// Inicializar todas las secciones abiertas
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.content-wrapper');
    sections.forEach(section => {
        const text = section.querySelector('.text');
        section.style.height = text.scrollHeight + 'px';
    });
});

