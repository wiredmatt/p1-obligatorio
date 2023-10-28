function imprimirArray(pArrayParaImprimir) {
  let mensaje = "";
  for (let i = 0; i < pArrayParaImprimir.length; i++) {
    mensaje += `${pArrayParaImprimir[i]} <br>`;
  }
  return mensaje;
}

function imprimirArrayEnUnaTabla(pArrayParaImprimir) {
  let tabla = `<tr>
                    <th>Palabra</th>
                </tr>`;

  for (let i = 0; i < pArrayParaImprimir.length; i++) {
    tabla += `<tr>
                    <td>
                        ${pArrayParaImprimir[i]}
                    </td>
                </tr>`;
  }
  return tabla;
}

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

function mostrarElemento(pIdElemento) {
  document.querySelector(`#${pIdElemento}`).style.display = "block";
}

function ocultarElemento(pIdElemento) {
  document.querySelector(`#${pIdElemento}`).style.display = "none";
}

/**
 * @param {INSTANCIA_CATEGORIA} categoria
 * @returns {("c" | "r" | "i")}
 */
function prefijoSegunCategoria(categoria) {
  switch (categoria) {
    case "Optimizadas para computo":
      return "c";
    case "Optimizadas para memoria":
      return "r";
    case "Optimizadas para almacenamiento":
      return "i";
  }
}

let arrTipoInstancias = [
  "c7small",
  "c7medium",
  "c7large",
  "r7small",
  "r7medium",
  "r7large",
  "i7medium",
  "i7large",
];

/**
 *
 * @param {INSTANCIA_TIPO} tipo
 */
function formatearTipoUI(tipo) {
  let pre = tipo.substring(0, 2);
  let post = tipo.substring(2, tipo.length);

  return pre + "." + post;
}

/**
 * @param {number|string} valor
 * @returns {boolean}
 */
function esNumeroEnteroValido(valor) {
  return (
    !isNaN(valor) && String(valor).indexOf(".") === -1 && Number(valor) >= 0
  );
}
