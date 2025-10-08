// Deshabilitar menú contextual y arrastre solo en contenedores .img-guard
document.querySelectorAll('.img-guard').forEach(el=>{
  el.addEventListener('contextmenu', e => e.preventDefault());
  el.addEventListener('dragstart',  e => e.preventDefault());
  // (Opcional) mitiga long-press en móvil:
  el.addEventListener('touchstart', e => e.preventDefault(), {passive:false});
});