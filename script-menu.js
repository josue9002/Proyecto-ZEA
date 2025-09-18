function toggleMenu() {
  const navList = document.querySelector('.nav-list');
  navList.classList.toggle('active');

}

  // --- Modal: mostrar SIEMPRE al cargar ---
  const overlayAnuncio = document.getElementById('overlayAnuncio');
  const btnCerrarAnuncio = document.getElementById('cerrarAnuncio');
  const btnMasTarde = document.getElementById('masTarde');

  function abrirAnuncio(){
    overlayAnuncio.classList.add('show');
    overlayAnuncio.removeAttribute('aria-hidden');
    document.body.classList.add('modal-open');
    // Foco al botón cerrar (accesibilidad)
    btnCerrarAnuncio && btnCerrarAnuncio.focus();
  }

  function cerrarAnuncio(){
    overlayAnuncio.classList.remove('show');
    overlayAnuncio.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
  }

  btnCerrarAnuncio && btnCerrarAnuncio.addEventListener('click', cerrarAnuncio);
  btnMasTarde && btnMasTarde.addEventListener('click', cerrarAnuncio);

  // Cerrar al hacer clic fuera del cuadro
  overlayAnuncio.addEventListener('click', (e) => {
    if (e.target === overlayAnuncio) cerrarAnuncio();
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlayAnuncio.classList.contains('show')) cerrarAnuncio();
  });

  // Mostrar SIEMPRE al cargar
  document.addEventListener('DOMContentLoaded', abrirAnuncio);
