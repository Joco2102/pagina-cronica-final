

/* E) GRILLAS DESPLEGABLES ("Ver mas" / "Ver menos") =========================
   El botón .btn-desplegar apunta (data-grilla="#id") a una grilla que tiene
   algunas tarjetas con la clase .oculta. Al tocar, agrega/saca .desplegada en
   la grilla y el CSS muestra u oculta esas tarjetas. */
document.querySelectorAll(".btn-desplegar").forEach(function (btn) {
  var grilla = document.querySelector(btn.getAttribute("data-grilla"));
  if (!grilla) return;
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    var abierta = grilla.classList.toggle("desplegada");
    btn.textContent = abierta ? "Ver menos" : "Ver mas";
  });
});
