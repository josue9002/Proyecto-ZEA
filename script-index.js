(function(){
  const slider = document.getElementById('slider');
  const dotsContainer = document.getElementById('dots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Estado base: solo slides reales (sin clones aún)
  let slides = Array.from(slider.children);
  const realCount = slides.length;

  // Crear clones (último al inicio, primero al final)
  const firstClone = slides[0].cloneNode(true);
  const lastClone  = slides[realCount - 1].cloneNode(true);
  firstClone.classList.add('clone');
  lastClone.classList.add('clone');

  slider.appendChild(firstClone);
  slider.insertBefore(lastClone, slides[0]);

  // Recalcular lista con clones
  slides = Array.from(slider.children);

  // Índice arranca en 1 (primer REAL, ya que en 0 está el clone del último)
  let index = 1;

  // Puntos (solo por reales)
  const dots = [];
  for(let i=0; i<realCount; i++){
    const d = document.createElement('span');
    d.className = 'dot' + (i===0 ? ' active' : '');
    d.addEventListener('click', () => goToReal(i));
    dotsContainer.appendChild(d);
    dots.push(d);
  }

  // Posicionar al inicio sin animación
  function jumpWithoutAnimation(){
    slider.style.transition = 'none';
    slider.style.transform  = `translateX(-${index * 100}%)`;
    // Forzar reflow para que el cambio de transition surta efecto después
    void slider.offsetWidth;
    slider.style.transition = 'transform .6s ease-in-out';
  }
  jumpWithoutAnimation();

  // Helpers de índice/dots
  function realIndexFromAny(i){
    // Convierte índice con clones (0..len-1) a índice real (0..realCount-1)
    if(i === 0) return realCount - 1;                     // clone del último
    if(i === slides.length - 1) return 0;                 // clone del primero
    return i - 1;                                         // reales
  }
  function updateDots(){
    const r = realIndexFromAny(index);
    dots.forEach((d, i) => d.classList.toggle('active', i===r));
  }

  // Navegación
  function next(){
    index++;
    slider.style.transform = `translateX(-${index * 100}%)`;
  }
  function prev(){
    index--;
    slider.style.transform = `translateX(-${index * 100}%)`;
  }
  function goToReal(realIdx){
    index = realIdx + 1; // +1 porque en 0 está el clone del último
    slider.style.transform = `translateX(-${index * 100}%)`;
    resetAutoplay();
    updateDots();
  }

  // Reset invisible al cruzar clones (para que sea loop perfecto)
  slider.addEventListener('transitionend', ()=> {
    if(slides[index].classList.contains('clone')){
      if(index === 0) index = realCount;              // saltar al último real
      if(index === slides.length - 1) index = 1;      // saltar al primero real
      jumpWithoutAnimation();
    }
    updateDots();
  });

  // Botones
  nextBtn.addEventListener('click', ()=>{ next(); resetAutoplay(); });
  prevBtn.addEventListener('click', ()=>{ prev(); resetAutoplay(); });

  // Autoplay cada 10s
  let timer = setInterval(next, 5000);
  function resetAutoplay(){
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  // (Opcional) pausar al pasar el mouse
  slider.parentElement.addEventListener('mouseenter', ()=> clearInterval(timer));
  slider.parentElement.addEventListener('mouseleave', resetAutoplay);

  // (Opcional) swipe táctil
  let startX = 0, dx = 0, dragging = false;
  const wrap = slider.parentElement;
  wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; dragging = true; clearInterval(timer); }, {passive:true});
  wrap.addEventListener('touchmove',  e => { if(!dragging) return; dx = e.touches[0].clientX - startX; }, {passive:true});
  wrap.addEventListener('touchend',   () => {
    dragging = false;
    if(Math.abs(dx) > 40){ dx < 0 ? next() : prev(); }
    dx = 0; resetAutoplay();
  });
})();

