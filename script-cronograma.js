/* ======= Datos base (3er periodo fijo) ======= */
const DATA_P3 = [
  { title:"Semana institucional", dateLabel:"06 al 10 de octubre", month:10, dayStart:6, dayEnd:10, tags:["institucional", "semana"] },
  { title:"Realización de informes parciales", dateLabel:"06 de octubre", month:10, dayStart:6, tags:["informes","docentes"] },
  { title:"Entrega de informes parciales", dateLabel:"9 de octubre", month:10, dayStart:9, tags:["informes","parcial"], chip:"docs" },

  { title:"Izada de bandera", dateLabel:"5 de noviembre", month:11, dayStart:5, tags:["izada"] },
  { title:"Exámenes finales de tercero a décimo", dateLabel:"14 de noviembre", month:11, dayStart:14, tags:["evaluación"], chip:"eval" },
  { title:"Exámenes finales de primera infancia", dateLabel:"12 al 18 de noviembre", month:11, dayStart:12, dayEnd:18, tags:["evaluación","primera infancia"], chip:"eval" },
  { title:"Exámenes finales de primero y segundo", dateLabel:"17 y 18 de noviembre", month:11, dayStart:17, dayEnd:18, tags:["evaluación","primaria"], chip:"eval" },

  { title:"Calificación de exámenes de 3° a 10°", dateLabel:"16 de noviembre", month:11, dayStart:16, tags:["evaluación","docente"], chip:"eval" },
  { title:"Digitación de notas de tercero a once", dateLabel:"17 de noviembre", month:11, dayStart:17, tags:["notas","docente"] },
  { title:"Digitación de notas de primera infancia a segundo", dateLabel:"18 de noviembre", month:11, dayStart:18, tags:["notas","docente"] },

  { title:"Evaluación y promoción", dateLabel:"19 de noviembre", month:11, dayStart:19, tags:["consejo académico"], chip:"final" },
  { title:"Divulgación y despedida", dateLabel:"20 de noviembre", month:11, dayStart:20, tags:["despedida"] },
  { title:"Actividad institucional", dateLabel:"21 de noviembre", month:11, dayStart:21, tags:["institucional"] },

  { title:"Actividades definitivas para el mejoramiento académico", dateLabel:"24 de noviembre", month:11, dayStart:24, tags:["mejoramiento"], chip:"final" },
  { title:"Impresión de informes", dateLabel:"25 de noviembre", month:11, dayStart:25, tags:["informes","secretaría"], chip:"docs" },
  { title:"Clausura y entrega de informes", dateLabel:"26, 27 y 28 de noviembre", month:11, dayStart:26, dayEnd:28, tags:["clausura","informes"], chip:"final" },

  { title:"Graduación 1°, 5° y 11°", dateLabel:"Por confirmar", month:null, tags:["acto","por confirmar"], confirm:true },
  { title:"Matrículas estudiantes nuevos", dateLabel:"Por confirmar", month:null, tags:["admisiones","por confirmar"], confirm:true }
];

const LS_KEYS = {1:'cronograma_p1', 2:'cronograma_p2'};
const MONTH_NAMES = {10:"Octubre", 11:"Noviembre"};
let activePeriod = 3;

/* ========== Utilidades ========== */
const byDate=(a,b)=>((a.month??99)-(b.month??99))||((a.dayStart??99)-(b.dayStart??99));
const qs = s=>document.querySelector(s);
const el = (t,attrs={})=>Object.assign(document.createElement(t),attrs);
const chipClass = c=>({final:"chip chip--final", eval:"chip chip--eval", docs:"chip chip--docs"}[c]||"chip");

function parseTags(x){ return (x||"").split(",").map(s=>s.trim()).filter(Boolean); }
function toCSV(arr){
  const head = 'title,dateLabel,month,dayStart,dayEnd,tags,confirm,chip';
  const rows = arr.map(o=>[
    o.title??"", o.dateLabel??"", o.month??"", o.dayStart??"", o.dayEnd??"",
    (o.tags||[]).join(';'), o.confirm?1:"", o.chip??""
  ].map(v=>String(v).includes(',')?`"${String(v).replace(/"/g,'""')}"`:v).join(','));
  return [head,...rows].join('\n');
}
function csvToObjs(text){
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const [head, ...rows] = lines;
  const cols = head.split(',').map(s=>s.trim());
  return rows.map(r=>{
    // CSV simple (soporta comillas)
    const cells=[]; let cur='', quoted=false;
    for(let i=0;i<r.length;i++){
      const ch=r[i];
      if(ch==='"' ){ quoted=!quoted; continue; }
      if(ch===',' && !quoted){ cells.push(cur); cur=''; continue; }
      cur+=ch;
    } cells.push(cur);
    const obj={}; cols.forEach((c,i)=>obj[c]=cells[i]??'');
    return {
      title: obj.title||'',
      dateLabel: obj.dateLabel||'',
      month: obj.month? Number(obj.month): null,
      dayStart: obj.dayStart? Number(obj.dayStart): null,
      dayEnd: obj.dayEnd? Number(obj.dayEnd): null,
      tags: parseTags((obj.tags||'').replaceAll(';',',')),
      confirm: !!(obj.confirm && obj.confirm!=="0"),
      chip: obj.chip||""
    };
  });
}

/* ========== Persistencia ========== */
function loadPeriod(p){
  if(p===3) return DATA_P3.slice();
  try{
    const raw = localStorage.getItem(LS_KEYS[p]);
    return raw ? JSON.parse(raw) : [];
  }catch{ return []; }
}
function savePeriod(p, data){
  if(p===3) return; // 3er fijo (si luego quieres, quitamos este guard)
  localStorage.setItem(LS_KEYS[p], JSON.stringify(data));
}

/* ========== Render tarjetas ========== */
function makeCard(evt){
  const confirmChip = evt.confirm ? `<span class="chip chip--confirm">Por confirmar</span>`:"";
  const chip = evt.chip ? `<span class="${chipClass(evt.chip)}">${evt.chip==="eval"?"Evaluación":evt.chip==="final"?"Definitivo":"Documentos"}</span>`:"";
  const tags = (evt.tags||[]).slice(0,3).map(t=>`<span class="chip">${t}</span>`).join("");
  return `
  <article class="card" data-month="${evt.month??'pc'}" data-confirm="${!!evt.confirm}"
           data-text="${(evt.title+" "+evt.dateLabel+" "+(evt.tags||[]).join(" ")).toLowerCase()}">
    <div class="top"><span class="dot" aria-hidden="true"></span><h3 class="title-evt">${evt.title}</h3></div>
    <div class="date">${evt.dateLabel}</div>
    <div class="chips">${confirmChip}${chip}${tags}</div>
  </article>`;
}

function render(){
  const timeline = qs('#timeline');
  const periodData = loadPeriod(activePeriod);

  // etiquetas y trigger
  qs('#periodo-label').textContent = activePeriod===1?'Primer periodo':activePeriod===2?'Segundo periodo':'Tercer periodo';
  qs('#period-trigger').textContent = (activePeriod===1?'1er':activePeriod===2?'2do':'3er')+' periodo ▾';

  // mostrar/ocultar editor
  const editor = qs('#editor');
  editor.hidden = !(activePeriod===1 || activePeriod===2);
  if(!editor.hidden) {
    qs('#editor-periodo').textContent = activePeriod===1?'1':'2';
    paintTable(periodData);
  }

  if (!periodData.length){
    timeline.innerHTML = `
      <section class="group">
        <h2>⏳ Este periodo está en blanco</h2>
        <div class="empty">
          <p><strong>Aquí irá la programación del ${activePeriod===1?'primer':activePeriod===2?'segundo':'tercer'} periodo.</strong><br>
          Usa el editor inferior para agregar, importar o exportar.</p>
        </div>
      </section>`;
    return;
  }

  const q = qs('#search').value.trim().toLowerCase();
  const onlyPc = qs('#only-pc').checked;
  const m = qs('#view-month').value;

  const groups = {};
  periodData.slice().sort(byDate).forEach(e=>{
    const text = (e.title+" "+e.dateLabel+" "+(e.tags||[]).join(" ")).toLowerCase();
    const passSearch = !q || text.includes(q);
    const passPc = !onlyPc || !!e.confirm;
    const passMonth = (m==="all") || (String(e.month)===m) || (m==="all" && e.month===null);
    if(passSearch && passPc && passMonth){
      const key = e.month??"pc";
      (groups[key] ||= []).push(makeCard(e));
    }
  });

  let html = "";
  const order = Object.keys(groups).sort((a,b)=>(a==='pc')-(b==='pc') || a-b);
  order.forEach(k=>{
    const heading = k==='pc' ? "Sin fecha definida" : (MONTH_NAMES[k] || ("Mes " + k));
    const icon = k==='pc' ? "⏳" : (k==10 ? "🍂" : "📘");
    html += `
      <section class="group" aria-labelledby="m-${k}">
        <h2 id="m-${k}">${icon} ${heading}</h2>
        <div class="grid">${groups[k].join("")}</div>
      </section>`;
  });
  timeline.innerHTML = html || `<p class="date">No hay resultados con los filtros aplicados.</p>`;
}

/* ======= Tabla del editor ======= */
function paintTable(data){
  const tbl = qs('#table');
  if(!data.length){
    tbl.innerHTML = `<tr><th>Actividad</th><th>Fecha</th><th>Mes</th><th>Día(s)</th><th>Tags</th><th>Confirm.</th><th>Chip</th><th></th></tr>`;
    return;
  }
  const rows = data.map((e,i)=>`
    <tr>
      <td>${e.title||""}</td>
      <td>${e.dateLabel||""}</td>
      <td>${e.month??""}</td>
      <td>${[e.dayStart??"", e.dayEnd??""].filter(Boolean).join(' - ')}</td>
      <td>${(e.tags||[]).join(', ')}</td>
      <td>${e.confirm?'Sí':'No'}</td>
      <td>${e.chip||""}</td>
      <td><button class="btn btn-ghost" data-del="${i}">Eliminar</button></td>
    </tr>`).join('');
  tbl.innerHTML = `<tr><th>Actividad</th><th>Fecha</th><th>Mes</th><th>Día(s)</th><th>Tags</th><th>Confirm.</th><th>Chip</th><th></th></tr>${rows}`;
}

/* ======= Eventos ======= */
qs('#search').addEventListener('input', render);
qs('#only-pc').addEventListener('change', render);
qs('#view-month').addEventListener('change', render);
qs('#export').addEventListener('click', ()=> window.print());

const trigger = qs('#period-trigger');
const menu = qs('#period-menu');
trigger.addEventListener('click', ()=>{
  const open = menu.classList.toggle('open');
  trigger.setAttribute('aria-expanded', open ? 'true':'false');
});
menu.addEventListener('click', (e)=>{
  const item = e.target.closest('.period-item');
  if(!item) return;
  activePeriod = Number(item.dataset.period);
  menu.classList.remove('open');
  qs('#view-month').value = 'all'; qs('#search').value = ''; qs('#only-pc').checked = false;
  render();
});
document.addEventListener('click', (e)=>{
  if(!menu.contains(e.target) && !trigger.contains(e.target)) menu.classList.remove('open');
});

/* ---- Editor actions ---- */
qs('#add').addEventListener('click', ()=>{
  const obj = {
    title: qs('#f-title').value.trim(),
    dateLabel: qs('#f-date').value.trim(),
    month: qs('#f-month').value ? Number(qs('#f-month').value) : null,
    dayStart: qs('#f-dayStart').value ? Number(qs('#f-dayStart').value) : null,
    dayEnd: qs('#f-dayEnd').value ? Number(qs('#f-dayEnd').value) : null,
    tags: parseTags(qs('#f-tags').value),
    confirm: qs('#f-confirm').checked,
    chip: qs('#f-chip').value || ""
  };
  if(!obj.title || !obj.dateLabel){
    alert('Por favor completa al menos Actividad y Fecha visible.');
    return;
  }
  const data = loadPeriod(activePeriod);
  data.push(obj);
  savePeriod(activePeriod, data);
  // limpiar inputs mínimos
  ['#f-title','#f-date','#f-dayStart','#f-dayEnd','#f-tags','#f-month'].forEach(id=>qs(id).value='');
  qs('#f-confirm').checked=false; qs('#f-chip').value='';
  render();
});

qs('#table').addEventListener('click', (e)=>{
  const idx = e.target.getAttribute('data-del');
  if(idx===null) return;
  const data = loadPeriod(activePeriod);
  data.splice(Number(idx),1);
  savePeriod(activePeriod, data);
  render();
});

qs('#clear').addEventListener('click', ()=>{
  if(confirm('¿Borrar todas las actividades de este periodo?')){ savePeriod(activePeriod, []); render(); }
});

qs('#export-csv').addEventListener('click', ()=>{
  const data = loadPeriod(activePeriod);
  const blob = new Blob([toCSV(data)], {type:'text/csv;charset=utf-8;'});
  const a = el('a',{href:URL.createObjectURL(blob),download:`periodo_${activePeriod}.csv`});
  document.body.appendChild(a); a.click(); a.remove();
});

qs('#import-file').addEventListener('change', (e)=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    let arr=[];
    try{
      if(file.name.endsWith('.json')){
        arr = JSON.parse(reader.result);
      }else{
        arr = csvToObjs(reader.result);
      }
      if(!Array.isArray(arr)) throw new Error('Formato inválido');
      savePeriod(activePeriod, arr);
      render();
      alert('Actividades importadas correctamente.');
    }catch(err){
      alert('No se pudo importar: ' + err.message);
    }
    e.target.value = '';
  };
  reader.readAsText(file, 'utf-8');
});

/* Inicial */
render();