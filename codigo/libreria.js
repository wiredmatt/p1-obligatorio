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
 * Retorna el prefijo según la categoria.
 *
 * Ejemplo: "Optimizadas para computo" -> "c7", tal que todas las instancias de dicha categoria empiezan con "c7".
 *
 * @param {INSTANCIA_CATEGORIA} categoria
 * @returns {("c7" | "r7" | "i7")}
 */
function prefijoSegunCategoria(categoria) {
  switch (categoria) {
    case "Optimizadas para computo":
      return "c7";
    case "Optimizadas para memoria":
      return "r7";
    case "Optimizadas para almacenamiento":
      return "i7";
  }
}

/**
 * @param {INSTANCIA_TIPO} tipo
 * @returns {INSTANCIA_CATEGORIA}
 */
function tipoACategoria(tipo) {
  switch (tipo.charAt(0)) {
    case "c":
      return "Optimizadas para computo";
    case "r":
      return "Optimizadas para memoria";
    case "i":
      return "Optimizadas para almacenamiento";
  }
}

/**
 * @param {INSTANCIA_TIPO} tipo
 * @returns {number}
 */
function tipoACostoAlquiler(tipo) {
  switch (tipo) {
    case "c7small":
      return 20;
    case "c7medium":
      return 30;
    case "c7large":
      return 50;
    case "r7small":
      return 35;
    case "r7medium":
      return 50;
    case "r7large":
      return 60;
    case "i7medium":
      return 30;
    case "i7large":
      return 50;
  }
}

/**
 * @param {INSTANCIA_TIPO} tipo
 * @returns {number}
 */
function tipoACostoEncendido(tipo) {
  switch (tipo) {
    case "c7small":
      return 2.5;
    case "c7medium":
      return 3.5;
    case "c7large":
      return 6.0;
    case "r7small":
      return 4.0;
    case "r7medium":
      return 6.5;
    case "r7large":
      return 7.0;
    case "i7medium":
      return 3.5;
    case "i7large":
      return 6.5;
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
 * Recibe un tipo de instancia y lo devuelve formateado para mostrar en la interfaz de usuario.
 * Ejemplo: "c7small" -> "c7.small"
 * @param {INSTANCIA_TIPO} tipo
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
    String(valor).indexOf(".") === -1 &&
    Number(valor) >= 0 &&
    valor !== " "
  );
}

/**
 * Retorna un arreglo con todos los tipos de instancia para una categoria dada.
 * @param {INSTANCIA_CATEGORIA} categoria
 */
function tiposDeCategoria(categoria) {
  switch (categoria) {
    case "Optimizadas para computo":
      return ["c7small", "c7medium", "c7large"];
    case "Optimizadas para memoria":
      return ["r7small", "r7medium", "r7large"];
    case "Optimizadas para almacenamiento":
      return ["i7medium", "i7large"];
  }
}
