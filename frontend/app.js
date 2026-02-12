const API_BASE = "PON_AQUI_TU_URL_DE_RENDER"; // luego lo cambiamos

const departamentos = [
  "Amazonas","Antioquia","Arauca","Atlántico","Bogotá D.C.","Bolívar","Boyacá","Caldas",
  "Caquetá","Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca","Guainía",
  "Guaviare","Huila","La Guajira","Magdalena","Meta","Nariño","Norte de Santander",
  "Putumayo","Quindío","Risaralda","San Andrés y Providencia","Santander","Sucre",
  "Tolima","Valle del Cauca","Vaupés","Vichada"
];

let state = {
  region: "Antioquia",
  tab: "Inicio",
  search: ""
};

function ui() {
  const app = document.querySelector("#app");
  app.innerHTML = `
  <div class="wrap">
    <header class="topbar">
      <button class="icon" id="btnMenu">☰</button>
      <div class="title">ÚLTIMAS NOTICIAS</div>
      <button class="icon" id="btnSearch">🔍</button>
    </header>

    <div class="content">
      <div class="regionRow">
        <div class="regionLabel">Región:</div>
        <div class="regionName">${state.region}</div>
        <button class="dots" id="btnDots">⋮</button>
      </div>

      <div class="searchBox" id="searchBox" style="display:none;">
        <input id="q" placeholder="Buscar en ${state.region}..." value="${state.search}" />
        <button id="doSearch">Buscar</button>
      </div>

      <section class="hero">
        <div class="badge">URGENTE</div>
        <div class="heroTitle">Titular de noticia destacada</div>
        <div class="heroSub">Subtítulo de la noticia en esta sección.</div>
      </section>

      <section class="block">
        <h2>${state.region} — Noticias</h2>
        <div class="list" id="newsList"><div class="skeleton">Cargando…</div></div>
      </section>

      <section class="block">
        <h2>${state.region} — Tendencias</h2>
        <div class="list" id="trendList"><div class="skeleton">Cargando…</div></div>
      </section>

      <section class="block">
        <h2>${state.region} — Hashtags</h2>
        <div class="chips" id="hashList"><div class="skeleton">Cargando…</div></div>
      </section>

      <section class="block">
        <h2>${state.region} — Noticias más relevantes</h2>
        <div class="list" id="topList"><div class="skeleton">Cargando…</div></div>
      </section>
    </div>

    <nav class="bottom">
      ${tabBtn("Inicio","🏠")}
      ${tabBtn("Tendencias","📈")}
      ${tabBtn("Videos","▶️")}
    </nav>

    <div class="drawer" id="drawer" style="display:none;">
      <div class="drawerBox">
        <div class="drawerTitle">Regiones (32)</div>
        <input id="regionSearch" placeholder="Buscar departamento..." />
        <div class="drawerList" id="drawerList"></div>
        <button class="close" id="closeDrawer">Cerrar</button>
      </div>
    </div>

    <div class="menu" id="menu" style="display:none;">
      <button id="mRegions">Regiones (32)</button>
      <button id="mContact">Contacto</button>
      <button id="mPerms">Permisos</button>
      <button id="mClose">Cerrar</button>
    </div>

    <div class="modal" id="modal" style="display:none;">
      <div class="modalBox">
        <div class="modalTitle" id="modalTitle"></div>
        <div class="modalText" id="modalText"></div>
        <button class="close" id="closeModal">Cerrar</button>
      </div>
    </div>

  </div>
  `;
  bind();
  loadRegionData();
}

function tabBtn(name, icon){
  const active = state.tab === name ? "active" : "";
  return `<button class="tab ${active}" data-tab="${name}">${icon}<div>${name}</div></button>`;
}

function bind(){
  document.querySelector("#btnMenu").onclick = () => alert("Menú principal (luego lo conectamos)");
  document.querySelector("#btnSearch").onclick = () => {
    const box = document.querySelector("#searchBox");
    box.style.display = box.style.display === "none" ? "flex" : "none";
  };

  document.querySelector("#btnDots").onclick = () => {
    document.querySelector("#menu").style.display = "flex";
  };

  document.querySelector("#mClose").onclick = () => document.querySelector("#menu").style.display = "none";
  document.querySelector("#mRegions").onclick = () => { document.querySelector("#menu").style.display="none"; openDrawer(); };
  document.querySelector("#mContact").onclick = () => { document.querySelector("#menu").style.display="none"; openModal("Contacto", "Pulso360 soporte: (pon tu WhatsApp y correo aquí)."); };
  document.querySelector("#mPerms").onclick = () => { document.querySelector("#menu").style.display="none"; openModal("Permisos", "Solicitamos permisos solo cuando uses la función: micrófono (voz), cámara (adjuntos), archivos/galería (subir), notificaciones (alertas)."); };

  document.querySelector("#doSearch").onclick = () => {
    state.search = document.querySelector("#q").value || "";
    loadRegionData();
  };

  document.querySelectorAll(".tab").forEach(b => {
    b.onclick = () => {
      state.tab = b.dataset.tab;
      ui();
    };
  });
}

function openDrawer(){
  document.querySelector("#drawer").style.display = "flex";
  const list = document.querySelector("#drawerList");
  list.innerHTML = departamentos.map(d => `<button class="row" data-r="${d}">${d}</button>`).join("");
  list.querySelectorAll("button").forEach(btn=>{
    btn.onclick = () => { state.region = btn.dataset.r; closeDrawer(); ui(); };
  });

  document.querySelector("#regionSearch").oninput = (e) => {
    const q = (e.target.value||"").toLowerCase();
    const filtered = departamentos.filter(x => x.toLowerCase().includes(q));
    list.innerHTML = filtered.map(d => `<button class="row" data-r="${d}">${d}</button>`).join("");
    list.querySelectorAll("button").forEach(btn=>{
      btn.onclick = () => { state.region = btn.dataset.r; closeDrawer(); ui(); };
    });
  };

  document.querySelector("#closeDrawer").onclick = closeDrawer;
}

function closeDrawer(){
  document.querySelector("#drawer").style.display = "none";
}

function openModal(title, text){
  document.querySelector("#modalTitle").textContent = title;
  document.querySelector("#modalText").textContent = text;
  document.querySelector("#modal").style.display = "flex";
  document.querySelector("#closeModal").onclick = () => {
    document.querySelector("#modal").style.display = "none";
  };
}

async function loadRegionData(){
  // Por ahora demo (luego conectamos al backend real)
  const news = Array.from({length:6}).map((_,i)=>({title:`${state.region}: Noticia ${i+1}`, desc:"Resumen corto..." }));
  const trend = Array.from({length:5}).map((_,i)=>({title:`Tema en tendencia ${i+1}`, desc:"Subiendo ahora" }));
  const hashtags = Array.from({length:10}).map((_,i)=>`#${state.region.replaceAll(" ","").toLowerCase()}${i+1}`);
  const top = Array.from({length:5}).map((_,i)=>({title:`Más relevante ${i+1}`, desc:"Por impacto / múltiples fuentes" }));

  document.querySelector("#newsList").innerHTML = news.map(card).join("");
  document.querySelector("#trendList").innerHTML = trend.map(card).join("");
  document.querySelector("#hashList").innerHTML = hashtags.map(h=>`<button class="chip" onclick="window.__setSearch('${h}')">${h}</button>`).join("");
  document.querySelector("#topList").innerHTML = top.map(card).join("");
}

window.__setSearch = (h) => {
  state.search = h;
  ui();
};

function card(x){
  return `<div class="card">
    <div class="cardTitle">${x.title}</div>
    <div class="cardDesc">${x.desc}</div>
  </div>`;
}

ui();
