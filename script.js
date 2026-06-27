/* ==========================================================================
   PORTAL "CRÓNICA" — script.js
   A) Carruseles (flechas)            C) Filtros de hashtags
   B) Botón de menú ☰                 D) Arrastrar para mover (drag-scroll)
   ========================================================================== */


/* A) CARRUSELES (flechas) ================================================== */
const carruseles = document.querySelectorAll(".carrusel");

carruseles.forEach(function (carrusel) {
  const pista     = carrusel.querySelector(".carrusel-pista");
  const flechaAnt = carrusel.querySelector(".carrusel-flecha.anterior");
  const flechaSig = carrusel.querySelector(".carrusel-flecha.siguiente");
  if (!pista) return;

  const esVertical = carrusel.classList.contains("carrusel--vertical");

  function paso() {
    return esVertical ? pista.clientHeight * 0.8 : pista.clientWidth * 0.8;
  }
  function mover(dir) {
    const cantidad = paso() * dir;
    if (esVertical) pista.scrollBy({ top: cantidad, behavior: "smooth" });
    else            pista.scrollBy({ left: cantidad, behavior: "smooth" });
  }

  if (flechaAnt) flechaAnt.addEventListener("click", function () { mover(-1); });
  if (flechaSig) flechaSig.addEventListener("click", function () { mover(1); });

  function actualizarFlechas() {
    let enInicio, enFinal;
    if (esVertical) {
      enInicio = pista.scrollTop <= 0;
      enFinal  = pista.scrollTop + pista.clientHeight >= pista.scrollHeight - 1;
    } else {
      enInicio = pista.scrollLeft <= 0;
      enFinal  = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 1;
    }
    if (flechaAnt) flechaAnt.style.visibility = enInicio ? "hidden" : "visible";
    //if (flechaSig) flechaSig.style.visibility = enFinal  ? "hidden" : "visible";
  }

  actualizarFlechas();
  pista.addEventListener("scroll", actualizarFlechas);
  window.addEventListener("resize", actualizarFlechas);
});


/* B) BOTÓN DE MENÚ ☰ ======================================================= */
const btnMenu = document.getElementById("btnMenu");
const menu = document.getElementById("menuDesplegable");

if (btnMenu && menu) {
  btnMenu.addEventListener("click", function (evento) {
    evento.stopPropagation();
    menu.classList.toggle("menu-desplegable--oculto");
  });
  document.addEventListener("click", function (evento) {
    const clicDentro = menu.contains(evento.target) || btnMenu.contains(evento.target);
    if (!clicDentro) menu.classList.add("menu-desplegable--oculto");
  });
}


/* C) FILTROS DE HASHTAGS ==================================================== */
const filtros = document.querySelectorAll(".tema-item");
const pistaInstantes = document.querySelector(".instantes-pista");

if (filtros.length && pistaInstantes) {
  const noticias = pistaInstantes.querySelectorAll(".item-noticia");
  const mensajeVacio = pistaInstantes.querySelector(".instantes-vacio");

  function mostrarTodas() {
    noticias.forEach(function (n) { n.hidden = false; });
    if (mensajeVacio) mensajeVacio.hidden = true;
    pistaInstantes.scrollTop = 0;
  }

  filtros.forEach(function (filtro) {
    filtro.addEventListener("click", function (evento) {
      evento.preventDefault();

      if (filtro.classList.contains("activo")) {
        filtro.classList.remove("activo");
        mostrarTodas();
        return;
      }

      filtros.forEach(function (f) { f.classList.remove("activo"); });
      filtro.classList.add("activo");

      const valor = filtro.dataset.filtro || "";
      let visibles = 0;
      noticias.forEach(function (noticia) {
        const tags = (noticia.dataset.tags || "").split(" ");
        const coincide = tags.indexOf(valor) !== -1;
        noticia.hidden = !coincide;
        if (coincide) visibles++;
      });

      if (mensajeVacio) mensajeVacio.hidden = visibles !== 0;
      pistaInstantes.scrollTop = 0;
    });
  });
}


/* D) ARRASTRAR PARA MOVER (drag-scroll en los carruseles horizontales) ======
   En la compu: hacés clic y arrastrás como si scrollearas en el celular.
   En el celular: el scroll táctil ya funciona solo (no tocamos eso).

   IMPORTANTE: NO usamos pista.setPointerCapture(). Capturar el puntero hace
   que el navegador dispare el evento "click" sobre la PISTA y no sobre el
   <a>/hashtag real; por eso en desktop se "perdían" los clics (no filtraba ni
   navegaba), mientras que en mobile —que sale antes— funcionaba. Ahora seguimos
   el arrastre con listeners en document y solo cancelamos el clic si hubo
   arrastre real. */
document.querySelectorAll(".carrusel:not(.carrusel--vertical) .carrusel-pista")
  .forEach(function (pista) {
    let abajo = false, movido = false, inicioX = 0, scrollInicio = 0;

    pista.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;   // en celular usa el scroll nativo
      abajo = true; movido = false;
      inicioX = e.clientX; scrollInicio = pista.scrollLeft;
      pista.classList.add("arrastrando");
    });

    // Movimiento y suelta a nivel document: el arrastre sigue aunque el cursor
    // se salga de la pista, y SIN capturar el puntero (así los clics quedan intactos).
    document.addEventListener("pointermove", function (e) {
      if (!abajo) return;
      const dx = e.clientX - inicioX;
      if (Math.abs(dx) > 5) movido = true;
      pista.scrollLeft = scrollInicio - dx;
    });

    document.addEventListener("pointerup", function () {
      if (!abajo) return;
      abajo = false;
      pista.classList.remove("arrastrando");
    });

    // Si hubo arrastre real, recién ahí cancelamos el clic (para no navegar por error).
    pista.addEventListener("click", function (e) {
      if (movido) { e.preventDefault(); e.stopPropagation(); movido = false; }
    }, true);
  });
