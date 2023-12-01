function hayCaracteres(pUnTexto) {
  let tengoCaracteres = false;
  let textoSinEspacios = pUnTexto.trim();
  if (textoSinEspacios.length > 0) {
    tengoCaracteres = true;
  }

  return tengoCaracteres;
}

function arrayTieneElementos(pArray) {
  let tieneElementos = false;

  if (pArray.length > 0) {
    tieneElementos = true;
  }

  return tieneElementos;
}

function limpiarUnCampoDeTexto(idDelCampoDeTexto) {
  document.querySelector(`#${idDelCampoDeTexto}`).value = "";
}

function limpiarUnElemento(idDelElemento) {
  document.querySelector(`#${idDelElemento}`).innerHTML = "";
}

function obtenerValorDeUnElementoHTML(idDelElemento) {
  return document.querySelector(`#${idDelElemento}`).value;
}

function imprimirEnHtml(pIdElemento, pLoQueImprimo) {
  document.querySelector(`#${pIdElemento}`).innerHTML = pLoQueImprimo;
}

function mostrarNavAdmin() {
  let elementos = document.querySelectorAll(".nav-item-admin");

  for (let i = 0; i < elementos.length; i++) {
    elementos[i].style.display = "block";
  }
}

function ocultarNavAdmin() {
  let elementos = document.querySelectorAll(".nav-item-admin");

  for (let i = 0; i < elementos.length; i++) {
    elementos[i].style.display = "none";
  }
}

function mostrarNavUsuario() {
  let elementos = document.querySelectorAll(".nav-item-usuario");

  for (let i = 0; i < elementos.length; i++) {
    elementos[i].style.display = "block";
  }
}

function ocultarNavUsuario() {
  let elementos = document.querySelectorAll(".nav-item-usuario");

  for (let i = 0; i < elementos.length; i++) {
    elementos[i].style.display = "none";
  }
}

/**
 * Dada una id de un elemento, lo muestra.
 * @param {string} pIdElemento
 */
function mostrarElemento(pIdElemento) {
  document.querySelector(`#${pIdElemento}`).style.display = "block";
}

/**
 * Dada una id de un elemento, lo oculta.
 * @param {string} pIdElemento
 */
function ocultarElemento(pIdElemento) {
  document.querySelector(`#${pIdElemento}`).style.display = "none";
}

/**
 * Recibe un tipo de instancia y lo devuelve formateado para mostrar en la interfaz de usuario.
 * Ejemplo: "c7small" -> "c7.small"
 * @param {string} tipo
 */
function formatearTipoUI(tipo) {
  let pre = tipo.substring(0, 2);
  let post = tipo.substring(2, tipo.length);

  return pre + "." + post;
}

/**
 * Verifica si un `valor` es un numero entero positivo.
 *
 * Ejemplo: "123" -> `true`
 *
 * Ejemplo: "123.5" -> `false`
 *
 * Ejemplo: "-123" -> `false`
 * @param {number|string} valor
 * @returns {boolean}
 */
function esNumeroEnteroValido(valor) {
  return (
    !isNaN(valor) &&
    // valor !== " " &&
    // valor !== "." && 
    // valor !=="," &&
    // valor !=="-" &&
    // valor !=="+" &&
    // valor !=="" &&
    String(valor).indexOf(".") === -1 && // no acepta numeros decimales
    String(valor).length > 0 
  );
}

function esUnNumeroRazonable(valor){
  return valor <=1000000
}