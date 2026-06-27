/* ==========================================================================
   "CRÓNICA EN VIVO" — script-envivo.js
   ==========================================================================
   A) Carruseles (Noticias de Crónica TV, Clips de Crónica, Medios vinculados)
   B) Botón de menú ☰ (abre/cierra el panel desplegable)
   ========================================================================== */


/* ==========================================================================
   A) CARRUSELES (Vanilla JS, sin librerías)
   --------------------------------------------------------------------------
   Estructura HTML de cada carrusel:
     .carrusel
        .carrusel-flecha.anterior
        .carrusel-pista   <- la fila con scroll que se mueve
        .carrusel-flecha.siguiente
   ========================================================================== */

// 1) Tomamos TODOS los carruseles de la página en una lista.
const carruseles = document.querySelectorAll(".carrusel");

// 2) Configuramos cada uno por separado.
carruseles.forEach(function (carrusel) {
  // Buscamos las piezas DENTRO de este carrusel (no en todo el documento),
  // para no mezclar los botones de un carrusel con los de otro.
  const pista     = carrusel.querySelector(".carrusel-pista");
  const flechaAnt = carrusel.querySelector(".carrusel-flecha.anterior");
  const flechaSig = carrusel.querySelector(".carrusel-flecha.siguiente");

  // 3) Cuánto avanza por clic: el 80% del ancho visible de la pista.
  function paso() { return pista.clientWidth * 0.8; }

  // 4) scrollBy desplaza la pista en horizontal (left). Negativo = izquierda,
  //    positivo = derecha. "smooth" hace el movimiento suave/animado.
  flechaAnt.addEventListener("click", function () {
    pista.scrollBy({ left: -paso(), behavior: "smooth" });
  });
  flechaSig.addEventListener("click", function () {
    pista.scrollBy({ left: paso(), behavior: "smooth" });
  });

  // 5) Ocultamos la flecha de un extremo cuando ya no hay a dónde seguir.
  function actualizarFlechas() {
    const enInicio = pista.scrollLeft <= 0;
    // scrollWidth = ancho TOTAL del contenido (incluyendo lo que no se ve).
    const enFinal  = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 1;
    flechaAnt.style.visibility = enInicio ? "hidden" : "visible";
    flechaSig.style.visibility = enFinal  ? "hidden" : "visible";
  }

  actualizarFlechas();                              // estado inicial
  pista.addEventListener("scroll", actualizarFlechas);   // al desplazar
  window.addEventListener("resize", actualizarFlechas);  // al redimensionar
});


/* ==========================================================================
   B) BOTÓN DE MENÚ ☰
   --------------------------------------------------------------------------
   classList.toggle alterna la clase que tiene "display:none" en el CSS,
   por lo que muestra/oculta el panel. Además lo cerramos si se hace clic fuera.
   ========================================================================== */
const btnMenu = document.getElementById("btnMenu");
const menu = document.getElementById("menuDesplegable");

if (btnMenu && menu) {
  btnMenu.addEventListener("click", function (evento) {
    evento.stopPropagation();   // evita que el clic cierre el menú al instante
    menu.classList.toggle("menu-desplegable--oculto");
  });

  document.addEventListener("click", function (evento) {
    const clicDentro = menu.contains(evento.target) || btnMenu.contains(evento.target);
    if (!clicDentro) menu.classList.add("menu-desplegable--oculto");
  });
}