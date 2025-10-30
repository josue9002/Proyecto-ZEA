    // --- Utilidad para gestionar pestañas accesibles y secciones visibles ---
    const tabs = () => Array.from(document.querySelectorAll('[role="tab"]'));
    const panels = () => Array.from(document.querySelectorAll('[role="tabpanel"]'));

    function showSection(targetId, {updateHash=true}={}){
      // Ocultar todos los paneles
      panels().forEach(p => p.hidden = true);
      tabs().forEach(t => t.setAttribute('aria-selected','false'));

      // Mostrar el panel objetivo
      const panel = document.getElementById(targetId);
      if(panel){
        panel.hidden = false;
        panel.classList.remove('fade-in');
        void panel.offsetWidth; // reiniciar animación
        panel.classList.add('fade-in');

        // Marcar su tab como activo
        const tab = tabs().find(t => t.getAttribute('aria-controls') === targetId);
        if(tab){ tab.setAttribute('aria-selected','true'); }

        if(updateHash){
          try{ location.hash = targetId.replace('sec-',''); }catch(e){}
        }
        const h2 = panel.querySelector('h2');
        if(h2){ h2.setAttribute('tabindex','-1'); try{ h2.focus({preventScroll:true}); }catch(e){} }
      }
    }

    // Delegación de eventos (más robusto en entornos embebidos)
    document.addEventListener('click', (ev) => {
      const tab = ev.target.closest('[role="tab"]');
      if(tab){
        ev.preventDefault();
        showSection(tab.getAttribute('aria-controls'));
        return;
      }
      const btn = ev.target.closest('button[data-action]');
      if(!btn) return;
      const action = btn.getAttribute('data-action');
      const panel = btn.closest('[role="tabpanel"]');
      if(action === 'imprimir'){
        const win = window.open('', '_blank');
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>Imprimir sección</title></head><body>${panel.innerHTML}</body></html>`;
        win.document.write(html); win.document.close(); win.focus(); win.print();
      }
      if(action === 'copiar-enlace'){
        const id = panel.id.replace('sec-','');
        const url = `${location.origin}${location.pathname}#${id}`;
        navigator.clipboard.writeText(url).then(()=>{
          btn.textContent = '¡Enlace copiado!';
          setTimeout(()=> btn.textContent='Copiar enlace a esta sección', 1500);
        }).catch(()=>{
          btn.textContent = 'Copia manual: ' + url;
          setTimeout(()=> btn.textContent='Copiar enlace a esta sección', 3500);
        });
      }
    });

    // Navegación con teclado (delegada)
    document.addEventListener('keydown', (ev) => {
      const current = document.activeElement && document.activeElement.closest('[role="tab"]');
      if(!current) return;
      const list = tabs();
      const i = list.indexOf(current);
      if(ev.key === 'ArrowRight'){ (list[i+1] || list[0]).focus(); ev.preventDefault(); }
      if(ev.key === 'ArrowLeft'){ (list[i-1] || list[list.length-1]).focus(); ev.preventDefault(); }
      if(ev.key === 'Home'){ list[0].focus(); ev.preventDefault(); }
      if(ev.key === 'End'){ list[list.length-1].focus(); ev.preventDefault(); }
      if(ev.key === 'Enter' || ev.key === ' '){ showSection(current.getAttribute('aria-controls')); ev.preventDefault(); }
    });

    // Inicialización inmediata (sin depender de DOMContentLoaded) y también al cargar
    (function init(){
      const hash = (location.hash || '').replace('#','');
      const targetId = hash ? `sec-${hash}` : 'sec-inicio';
      showSection(targetId, {updateHash:false});
    })();
    window.addEventListener('DOMContentLoaded', () => {
      const hash = (location.hash || '').replace('#','');
      const targetId = hash ? `sec-${hash}` : 'sec-inicio';
      showSection(targetId, {updateHash:false});
    });