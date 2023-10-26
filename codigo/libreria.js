//recibe un array como parametro e imprime en cada linea el contenido del array
function imprimirArray(pArrayParaImprimir) {
  let mensaje = "";
  for (let i = 0; i < pArrayParaImprimir.length; i++) {
    mensaje += `${pArrayParaImprimir[i]} <br>`;
  }
  return mensaje;
}

//recibe un array como parametro e imprime en cada linea en una fila de la tabla
function imprimirArrayEnUnaTabla(pArrayParaImprimir) {
  let tabla = `<tr>
                    <th>Palabra</th>
                </tr>`;

  for (let i = 0; i < pArrayParaImprimir.length; i++) {
    //<tr><td>EL DATO</td></tr>
    tabla += `<tr>
                    <td>
                        ${pArrayParaImprimir[i]}
                    </td>
                </tr>`;
  }
  return tabla;
}

//recibe un string y retorna true si tiene caracteres, false en caso contrario
function hayCaracteres(pUnTexto) {
  let tengoCaracteres = false;
  let textoSinEspacios = pUnTexto.trim();
  if (textoSinEspacios.length > 0) {
    tengoCaracteres = true;
  }

  return tengoCaracteres;
  //return pUnTexto.length > 0
}

//retorna true si un array tiene elementos, false en caso contrario
function arrayTieneElementos(pArray) {
  let tieneElementos = false;

  if (pArray.length > 0) {
    tieneElementos = true;
  }

  return tieneElementos;
  //return pArray.length > 0
}

//limpiar un campo de texto
function limpiarUnCampoDeTexto(idDelCampoDeTexto) {
  //document.querySelector("#txtUsuario").value = "";
  //document.querySelector("#"+idDelCampoDeTexto).value = "";
  document.querySelector(`#${idDelCampoDeTexto}`).value = "";
}
//limpiar un parrado
function limpiarUnElemento(idDelElemento) {
  //document.querySelector("#txtUsuario").value = "";
  //document.querySelector("#"+idDelCampoDeTexto).value = "";
  document.querySelector(`#${idDelElemento}`).innerHTML = "";
}

function obtenerValorDeUnElementoHTML(idDelElemento) {
  // let elemento = document.querySelector(`#${idDelElemento}`).value;
  // return elemento;
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
