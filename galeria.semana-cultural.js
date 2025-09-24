(function(){
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    const mediaWrap = document.getElementById('mediaWrap');
    const counter = document.getElementById('counter');
    const btnPrev = lightbox.querySelector('[data-prev]');
    const btnNext = lightbox.querySelector('[data-next]');
    const btnCloseEls = lightbox.querySelectorAll('[data-close]');
    const items = Array.from(gallery.querySelectorAll('.item'));

    let index = 0;
    let startX = 0; // para swipe

    function openAt(i){
      index = (i+items.length)%items.length;
      render();
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden','false');
      // Evitar scroll del body al abrir
      document.documentElement.style.overflow = 'hidden';
    }

    function closeBox(){
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden','true');
      // Parar video si está reproduciéndose
      const v = mediaWrap.querySelector('video');
      if(v){ v.pause(); v.src=''; v.load(); }
      mediaWrap.innerHTML = '';
      document.documentElement.style.overflow = '';
    }

    function next(){ openAt(index+1); }
    function prev(){ openAt(index-1); }

    function render(){
      const el = items[index];
      const type = el.dataset.type;
      const src = el.dataset.src;
      mediaWrap.innerHTML = '';
      if(type === 'video'){
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.playsInline = true;
        video.setAttribute('preload','metadata');
        mediaWrap.appendChild(video);
        // Autoplay opcional: video.play().catch(()=>{});
      }else{
        const img = document.createElement('img');
        img.src = src;
        img.alt = el.querySelector('img.thumb')?.alt || 'Imagen';
        mediaWrap.appendChild(img);
      }
      counter.textContent = (index+1) + ' / ' + items.length;
    }

    // Eventos de miniaturas (click y Enter)
    items.forEach((it,i)=>{
      it.addEventListener('click', ()=>openAt(i));
      it.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault(); openAt(i);
        }
      });
    });

    // Controles
    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);
    btnCloseEls.forEach(b=> b.addEventListener('click', closeBox));

    // Navegación por teclado
    window.addEventListener('keydown', (e)=>{
      if(!lightbox.classList.contains('open')) return;
      if(e.key === 'Escape') closeBox();
      else if(e.key === 'ArrowRight') next();
      else if(e.key === 'ArrowLeft') prev();
    });

    // Cerrar clickeando fuera del marco (backdrop)
    lightbox.querySelector('.backdrop').addEventListener('click', closeBox);

    // Gestos táctiles (swipe)
    mediaWrap.addEventListener('touchstart', (e)=>{
      startX = e.touches[0].clientX;
    }, {passive:true});

    mediaWrap.addEventListener('touchend', (e)=>{
      const dx = e.changedTouches[0].clientX - startX;
      if(Math.abs(dx) > 40){ dx < 0 ? next() : prev(); }
    });

    // Pre-carga simple de la siguiente imagen para transiciones suaves
    function preloadAround(i){
      const nextIdx = (i+1)%items.length;
      const prevIdx = (i-1+items.length)%items.length;
      [nextIdx, prevIdx].forEach(ix=>{
        const it = items[ix];
        if(it.dataset.type === 'img'){
          const im = new Image(); im.src = it.dataset.src;
        }
      });
    }
    // Hookear render para precargar alrededor
    const _openAt = openAt;
    openAt = function(i){ _openAt(i); preloadAround(index); };

    // Accesibilidad: atrapar foco dentro del lightbox (simple)
    document.addEventListener('focusin', (e)=>{
      if(!lightbox.classList.contains('open')) return;
      if(!lightbox.contains(e.target)){
        lightbox.querySelector('.close').focus();
      }
    });

  })();