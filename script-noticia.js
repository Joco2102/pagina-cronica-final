/* ==========================================================================
   PÁGINA DE ARTÍCULO — script-noticia.js
   ==========================================================================
   A) Carrusel de "Últimas noticias relacionadas"
   B) Botón de menú ☰
   ========================================================================== */


/* ==========================================================================
   A) CARRUSEL (Vanilla JS, sin librerías)
   --------------------------------------------------------------------------
   En esta página hay un solo carrusel, pero igual usamos querySelectorAll +
   forEach: así el código sirve aunque mañana agregues más carruseles.
   Estructura:  .carrusel > [.carrusel-flecha.anterior] .carrusel-pista [.carrusel-flecha.siguiente]
   ========================================================================== */
const carruseles = document.querySelectorAll(".carrusel");

carruseles.forEach(function (carrusel) {
  // Buscamos las piezas DENTRO de este carrusel (no en todo el documento).
  const pista     = carrusel.querySelector(".carrusel-pista");
  const flechaAnt = carrusel.querySelector(".carrusel-flecha.anterior");
  const flechaSig = carrusel.querySelector(".carrusel-flecha.siguiente");

  // Avanza el 80% del ancho visible de la pista en cada clic.
  function paso() { return pista.clientWidth * 0.8; }

  // scrollBy desplaza la pista en horizontal; "smooth" lo hace animado.
  flechaAnt.addEventListener("click", function () {
    pista.scrollBy({ left: -paso(), behavior: "smooth" });
  });
  flechaSig.addEventListener("click", function () {
    pista.scrollBy({ left: paso(), behavior: "smooth" });
  });

  // Ocultamos la flecha del extremo cuando ya no hay a dónde seguir.
  function actualizarFlechas() {
    const enInicio = pista.scrollLeft <= 0;
    const enFinal  = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 1;
    flechaAnt.style.visibility = enInicio ? "hidden" : "visible";
    flechaSig.style.visibility = enFinal  ? "hidden" : "visible";
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
  btnMenu.addEventListener("click", function (evento) {
    evento.stopPropagation();
    menu.classList.toggle("menu-desplegable--oculto");
  });
  document.addEventListener("click", function (evento) {
    const clicDentro = menu.contains(evento.target) || btnMenu.contains(evento.target);
    if (!clicDentro) menu.classList.add("menu-desplegable--oculto");
  });
}
