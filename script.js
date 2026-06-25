/* ==========================================================================
   PORTAL "CRÓNICA" — script.js
   ==========================================================================
   A) Carruseles (horizontales + el vertical de "Hace instantes")
   B) Botón de menú ☰ (abre/cierra el desplegable y se cierra al clic afuera)
   ========================================================================== */


/* ==========================================================================
   A) CARRUSELES (Vanilla JS, sin librerías)
   --------------------------------------------------------------------------
   Estructura de cada carrusel:
     .carrusel
        .carrusel-flecha.anterior
        .carrusel-pista   <- la fila/columna con scroll que se mueve
        .carrusel-flecha.siguiente
   Si lleva la clase "carrusel--vertical", el desplazamiento es vertical.
   ========================================================================== */

// 1) Tomamos TODOS los carruseles de la página.
const carruseles = document.querySelectorAll(".carrusel");

// 2) Configuramos cada uno por separado.
carruseles.forEach(function (carrusel) {
  // Buscamos las piezas DENTRO de este carrusel (no en todo el documento).
  const pista     = carrusel.querySelector(".carrusel-pista");
  const flechaAnt = carrusel.querySelector(".carrusel-flecha.anterior");
  const flechaSig = carrusel.querySelector(".carrusel-flecha.siguiente");

  // Si por alguna razón faltara la pista, salimos para no romper nada.
  if (!pista) return;

  // ¿Es vertical? Lo detectamos por la clase modificadora del contenedor.
  const esVertical = carrusel.classList.contains("carrusel--vertical");

  // 3) Cuánto se mueve por clic: 80% del tamaño visible de la pista.
  function paso() {
    return esVertical ? pista.clientHeight * 0.8 : pista.clientWidth * 0.8;
  }

  // 4) Función única para mover. 'dir' es -1 (atrás) o +1 (adelante).
  function mover(dir) {
    const cantidad = paso() * dir;
    if (esVertical) {
      pista.scrollBy({ top: cantidad, behavior: "smooth" });
    } else {
      pista.scrollBy({ left: cantidad, behavior: "smooth" });
    }
  }

  // 5) Event listeners de las flechas.
  if (flechaAnt) flechaAnt.addEventListener("click", function () { mover(-1); });
  if (flechaSig) flechaSig.addEventListener("click", function () { mover(1); });

  // 6) Ocultamos la flecha del extremo cuando no hay a dónde seguir.
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


/* ==========================================================================
   B) BOTÓN DE MENÚ ☰
   ========================================================================== */
const btnMenu = document.getElementById("btnMenu");
const menu = document.getElementById("menuDesplegable");

if (btnMenu && menu) {
  // Abrir/cerrar al hacer clic en el botón.
  btnMenu.addEventListener("click", function (evento) {
    evento.stopPropagation();   // evita que el clic cierre el menú al instante
    menu.classList.toggle("menu-desplegable--oculto");
  });

  // Cerrar si se hace clic FUERA del menú o del botón.
  document.addEventListener("click", function (evento) {
    const clicDentro = menu.contains(evento.target) || btnMenu.contains(evento.target);
    if (!clicDentro) menu.classList.add("menu-desplegable--oculto");
  });
}


/* ==========================================================================
   C) FILTROS DE HASHTAGS ("TEMAS DE HOY" filtra "HACE INSTANTES")
   --------------------------------------------------------------------------
   - Cada .tema-item tiene data-filtro (ej: "GASPI"). El de "Todas" es "".
   - Cada noticia .item-noticia de la pista tiene data-tags (ej: "GASPI RECLAMO").
   - Al clickear un filtro: se marca como activo y se muestran solo las
     noticias cuyos data-tags incluyan ese filtro. Si ninguna coincide,
     mostramos el mensaje .instantes-vacio.
   ========================================================================== */
const filtros = document.querySelectorAll(".tema-item");
const pistaInstantes = document.querySelector(".instantes-pista");

if (filtros.length && pistaInstantes) {
  const noticias = pistaInstantes.querySelectorAll(".item-noticia");
  const mensajeVacio = pistaInstantes.querySelector(".instantes-vacio");

  // Muestra todas las noticias y oculta el mensaje de vacío.
  function mostrarTodas() {
    noticias.forEach(function (n) { n.hidden = false; });
    if (mensajeVacio) mensajeVacio.hidden = true;
    pistaInstantes.scrollTop = 0;
  }

  filtros.forEach(function (filtro) {
    filtro.addEventListener("click", function (evento) {
      evento.preventDefault();

      // Si este filtro YA estaba activo, lo desmarcamos y volvemos a todo.
      if (filtro.classList.contains("activo")) {
        filtro.classList.remove("activo");
        mostrarTodas();
        return;
      }

      // Si no, lo activamos (y desmarcamos los demás).
      filtros.forEach(function (f) { f.classList.remove("activo"); });
      filtro.classList.add("activo");

      // Filtramos las noticias por el hashtag elegido.
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
