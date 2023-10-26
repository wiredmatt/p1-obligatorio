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
