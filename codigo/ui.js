window.addEventListener("load", inicio);

/**
 * @type {Sistema}
 * @global
 */
let sistema = new Sistema();

/**
 * @type {?UsuarioComun}
 * @global
 */
let usuarioLogeado = null;

/**
 * Filtro a aplicar para la vista de instancias alquiladas de los usuarios.
 * @type {("APAGADA" | "ENCENDIDA" | "todas")}
 * @global
 */
let filtroInstanciasUsuario = "todas";

/**
 * Filtro a aplicar para la vista de alquileres, para los usuarios.
 * @type {INSTANCIA_CATEGORIA}
 * @global
 */
let filtroInstanciasAlquilar = "Optimizadas para computo";

function inicio() {
  // USUARIO UI - Usuarios se registran
  document
    .querySelector("#btnRegistrarse")
    .addEventListener("click", mostrarPantallaRegistro);
  // USUARIO UI - Desde la pantalla de registro, se puede volver al login.
  document
    .querySelector("#btnVolverLogin")
    .addEventListener("click", mostrarPantallaLogin);
  // USUARIO UI - Desde la pantalla de login, se puede ir al registro.
  document
    .querySelector("#btnCrearUsuario")
    .addEventListener("click", registroUsuarioUI);

  // USUARIO Y ADMIN - Ambos se pueden logear desde la misma pantalla
  document
    .querySelector("#btnIniciarSesion")
    .addEventListener("click", iniciarSesionUI);
  // USUARIO Y ADMIN - Ambos pueden cerrar sesion
  document
    .querySelector("#aCerrarSesion")
    .addEventListener("click", cerrarSesionUI);

  // ADMIN UI - Administrador puede ver y operar sobre los usuarios
  document
    .querySelector("#aListadoUsuarios")
    .addEventListener("click", verListadoDeUsuarios);

  // ADMIN UI - Administrador puede modificar el stock de instancias
  document
    .querySelector("#aGestionarInstancias")
    .addEventListener("click", verListadoDeInstanciasAdmin);

  // ADMIN UI - Administrador puede ver un reporte de los ingresos del sistema
  document
    .querySelector("#aReportes")
    .addEventListener("click", verReportesAdmin);

  // USUARIO UI - Usuario puede ver y operar sobre sus instancias
  document
    .querySelector("#aMisInstancias")
    .addEventListener("click", verMisInstanciasUsuario);

  // USUARIO UI - Usuario puede ver sus costos
  document.querySelector("#aMisCostos").addEventListener("click", verMisCostos);

  // USUARIO UI - Usuario puede ver maquinas para alquilar
  document
    .querySelector("#aAlquilar")
    .addEventListener("click", verOpcionesAlquilerUsuario);

  // USUARIO UI - Usuario puede filtrar maquinas para alquilar
  document
    .querySelector("#slcOpcionesAlquiler")
    .addEventListener("change", cambiarFiltroAlquilerUsuario);

  // La pantalla por defecto es el login - no landing page (bajo presupuesto).
  mostrarPantallaLogin();
}

function mostrarPantallaLogin() {
  mostrarElemento("divLogin");
  ocultarElemento("divRegistroUsuario");
  ocultarElemento("divContenidoAdministrador");
  ocultarElemento("divContenidoUsuario");
  ocultarElemento("cabezal");
}

function iniciarSesionUI() {
  ocultarNavAdmin();
  ocultarNavUsuario();
  ocultarElemento("divContenidoAdministrador");
  ocultarElemento("divContenidoUsuario");

  let nomUsuario = obtenerValorDeUnElementoHTML("txtNomUsu");
  let contrasena = obtenerValorDeUnElementoHTML("txtPassword");

  if (sistema.validarLogin(nomUsuario, contrasena)) {
    let esAdmin = sistema.esAdmin(nomUsuario);

    if (esAdmin) {
      document.querySelector("#divContenidoAdministrador").style.display =
        "block";
      mostrarNavAdmin();
      mostrarElemento("divContenidoAdministrador");
      verListadoDeUsuarios(); // por defecto mostrarle la lista de usuarios al admin.
    } else {
      let usuario = sistema.buscarUsuarioObjeto(nomUsuario);

      if (usuario.estado === "bloqueado") {
        imprimirEnHtml("pMensajesLogin", "Su usuario fue bloqueado.");
        return;
      } else if (usuario.estado === "pendiente") {
        imprimirEnHtml(
          "pMensajesLogin",
          "Su registro se encuentra pendiente de aprobación."
        );
        return;
      }

      usuarioLogeado = usuario;
      filtroInstanciasUsuario = "todas"; // resetear el filtro.
      filtroInstanciasAlquilar = "Optimizadas para computo"; // resetear el filtro.
      mostrarNavUsuario();
      mostrarElemento("divContenidoUsuario");
      verMisInstanciasUsuario(); // por defecto mostrarle sus instancias al usuario
    }

    mostrarElemento("cabezal");
    ocultarElemento("divLogin");
    limpiarUnCampoDeTexto("txtNomUsu");
    limpiarUnCampoDeTexto("txtPassword");
    limpiarUnElemento("pMensajesLogin");
  } else {
    imprimirEnHtml("pMensajesLogin", "Usuario y/o contraseña incorrecto");
  }
}

function registroUsuarioUI() {
  let nombre = obtenerValorDeUnElementoHTML("txtNombreUsuarioRegistro");
  let apellido = obtenerValorDeUnElementoHTML("txtApellidoRegistro");
  let nombreUsuario =
    obtenerValorDeUnElementoHTML("txtNomUsuRegistro").toLowerCase(); // case insensitive
  let contrasena = obtenerValorDeUnElementoHTML("txtContrasenaRegistro");
  let tarjeta = obtenerValorDeUnElementoHTML("txtTarjeta");
  let cvcTarjeta = obtenerValorDeUnElementoHTML("txtCvcTarjeta");

  let erroresValidacion = validarDatosRegistroUsuario(
    nombre,
    apellido,
    nombreUsuario,
    contrasena,
    tarjeta,
    cvcTarjeta
  );

  if (!arrayTieneElementos(erroresValidacion)) {
    if (sistema.buscarUsuarioObjeto(nombreUsuario) !== null) {
      imprimirEnHtml(
        "pInfoRegistroUsuario",
        "El nombre de usuario ya existe en el sistema"
      );

      return;
    }

    let registroOk = sistema.registrarUsuario(
      nombre,
      apellido,
      nombreUsuario,
      contrasena,
      tarjeta,
      cvcTarjeta
    );

    if (registroOk) {
      limpiarUnCampoDeTexto("txtNombreUsuarioRegistro");
      limpiarUnCampoDeTexto("txtApellidoRegistro");
      limpiarUnCampoDeTexto("txtNomUsuRegistro");
      limpiarUnCampoDeTexto("txtContrasenaRegistro");
      limpiarUnCampoDeTexto("txtTarjeta");
      limpiarUnCampoDeTexto("txtCvcTarjeta");
      imprimirEnHtml(
        "pInfoRegistroUsuario",
        "Usuario creado exitosamente. Pendiente de aprobación"
      );
    } else {
      imprimirEnHtml("pInfoRegistroUsuario", "Error al guardar el usuario");
    }
  } else {
    let erroresMostrar = "";
    for (let i = 0; i < erroresValidacion.length; i++) {
      erroresMostrar += erroresValidacion[i] + "<br>";
    }
    imprimirEnHtml("pInfoRegistroUsuario", erroresMostrar);
  }
}

function validarDatosRegistroUsuario(
  pNombre,
  pApellido,
  pNomUsu,
  pContrasena,
  pNroTjt,
  pCvcTjt
) {
  let arrayErrores = [];
  if (!hayCaracteres(pNombre)) {
    arrayErrores.push("Debe ingresar nombre.");
  }
  if (!hayCaracteres(pApellido)) {
    arrayErrores.push("Debe ingresar apellido.");
  }
  if (!hayCaracteres(pNomUsu)) {
    arrayErrores.push("Debe ingresar nombre de usuario.");
  }

  if (!sistema.validarNombreUsuario(pNomUsu)) {
    arrayErrores.push(
      "El nombre de usuario debe tener un mínimo de 5 caracteres, contando con al menos una mayúscula, una minúscula y un número. Se permiten puntos y guines bajos."
    );
  }
  if (!hayCaracteres(pContrasena) || !sistema.validarContrasena(pContrasena)) {
    arrayErrores.push(
      "Debe ingresar una contraseña válida. Mínimo de 5 caracteres, contando con al menos una mayúscula, una minúscula y un número."
    );
  }
  if (!hayCaracteres(pNroTjt) || !sistema.validarTarjeta(pNroTjt)) {
    arrayErrores.push("Tarjeta invalida.");
  }
  if (!hayCaracteres(pCvcTjt) || pCvcTjt.length !== 3 || isNaN(pCvcTjt)) {
    arrayErrores.push("CVC invalido.");
  }
  return arrayErrores;
}

function cerrarSesionUI() {
  usuarioLogeado = null;
  filtroInstanciasAlquilar = "Optimizadas para computo";
  document.querySelector("#slcOpcionesAlquiler").value =
    filtroInstanciasAlquilar;

  filtroInstanciasUsuario = "todas";

  mostrarPantallaLogin();
}

function mostrarPantallaRegistro() {
  ocultarElemento("divLogin");
  mostrarElemento("divRegistroUsuario");
}

function verListadoDeUsuarios() {
  ocultarElemento("divAdminStockInstancias");
  ocultarElemento("divAdminReportes");

  let tabla = `
                <h2>Gestión de Usuarios del Sistema</h2>
                <table>
                  <tr>
                      <th>
                          Nombre
                      </th>
                      
                      <th>
                          Apellido
                      </th>
                      
                      <th>
                          Nombre usuario
                      </th>
                      <th>
                          Estado
                      </th>
                      <th>
                          Operar
                      </th>
                  </tr>    
                `;

  for (let i = 0; i < sistema.arrayUsuariosComunes.length; i++) {
    let usuario = sistema.arrayUsuariosComunes[i];

    let textoAccion = "Activar"; // a mostrar si el usuario esta pendiente
    let clase = "activacionUsuarios"; // clase a dar si esta pendiente

    if (usuario.estado === "activo") {
      textoAccion = "Bloquear"; // a mostrar si el usuario ya fue activado
      clase = "bloqueoUsuarios"; // a mostrar si el usuario ya fue activado
    }

    let botonAccion = `
    <td>
      <input 
        usuario-nombre="${usuario.nombreUsuario}" 
        class="${clase}" id="btnActivarUsuario${usuario.ID}" 
        type="button" value="${textoAccion}"
      >
    </td>`;

    if (usuario.estado === "bloqueado") {
      // una vez bloqueado el usuario, no hay ninguna accion
      // para ofrecerle al administrador sobre este usuario.
      botonAccion = "";
    }

    tabla += `
                <tr>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.nombreUsuario}</td>
                    <td>${usuario.estado}</td>
                    ${botonAccion}
                </tr>    
            `;
  }
  tabla += `</table>`;

  document.querySelector("#divAdminAdministrarUsuario").innerHTML = tabla;

  let botonesDeActivacion = document.querySelectorAll(".activacionUsuarios");
  for (let i = 0; i < botonesDeActivacion.length; i++) {
    let idDelBoton = botonesDeActivacion[i].id;
    document
      .querySelector(`#${idDelBoton}`)
      .addEventListener("click", activarUsuarioUI);
  }

  let botonesDeBloqueo = document.querySelectorAll(".bloqueoUsuarios");
  for (let i = 0; i < botonesDeBloqueo.length; i++) {
    let idDelBoton = botonesDeBloqueo[i].id;
    document
      .querySelector(`#${idDelBoton}`)
      .addEventListener("click", bloquearUsuarioUI);
  }

  document.querySelector("#divAdminAdministrarUsuario").style.display = "block";
}

function activarUsuarioUI() {
  let nombreUsuario = this.getAttribute("usuario-nombre");

  sistema.activarUsuario(nombreUsuario);
  verListadoDeUsuarios();
}

function bloquearUsuarioUI() {
  let nombreUsuario = this.getAttribute("usuario-nombre");

  sistema.bloquearUsuario(nombreUsuario);
  verListadoDeUsuarios();
}

function verListadoDeInstanciasAdmin() {
  ocultarElemento("divAdminAdministrarUsuario");
  ocultarElemento("divAdminReportes");

  let html = `
  <h2>Gestión de Instancias</h2>

  <p id="pErroresGIAdmin" style="color: red; font-weight: 500"></p>
  `;

  for (let i = 0; i < sistema.categorias.length; i++) {
    let tabla = generarTablaParaCategoriaInstanciaAdmin(sistema.categorias[i]);
    html += tabla;
  }

  imprimirEnHtml("divAdminStockInstancias", html);

  for (let i = 0; i < sistema.arrayTiposInstancia.length; i++) {
    let tipo = sistema.arrayTiposInstancia[i].tipo;

    document
      .querySelector(`#btnStockGuardar${tipo}`)
      .addEventListener("click", guardarCambioStockTipoAdmin);
  }

  mostrarElemento("divAdminStockInstancias");
}

/**
 * Genera el html para una `table` que contiene la información
 * de los distintos tipos de instancias de una categoria dada.
 * @param {INSTANCIA_CATEGORIA} categoria
 */
function generarTablaParaCategoriaInstanciaAdmin(categoria) {
  // buscar todas las instancias para la categoria dada
  // usaremos este arreglo pre-computado como argumento
  // en la llamada a `sistema.buscarInstanciasPorTipo`.
  // logrando optimizar el tiempo de ejecucion de la misma.
  let arrInstancias = sistema.buscarInstanciasPorCategoria(categoria);

  // buscar todos los tipos posibles para esta categoria
  // (ej: "c7.small", "c7.medium", etc.)
  let tipos = sistema.buscarTiposDeCategoria(categoria);

  let tabla = `
                <h3>${categoria}</h3>
                <table>
                  <tr>
                      <th>
                        Tipo
                      </th>
                      <th>
                        Unidades Totales
                      </th>
                      <th>
                        Unidades Alquiladas
                      </th>
                      <th>
                        Unidades Disponibles
                      </th>
                      <th>
                        Modificar Disponibles
                      </th>
                      <th>
                        Confirmar
                      </th>
                  </tr>
                `;

  // generar una fila para cada tipo en esta categoria.
  for (let i = 0; i < tipos.length; i++) {
    let tipo = tipos[i];
    let instancias = sistema.buscarInstanciasPorTipo(tipo, arrInstancias);

    tabla += generarFilaParaTipoInstanciaAdmin(tipo, instancias.length);
  }

  tabla += "</table>";

  return tabla;
}

/**
 * Genera el html para una fila de una tabla que contiene la información de un tipo de instancia dado.
 * @param {INSTANCIA_TIPO} tipo
 * @param {number} stock
 * @returns
 */
function generarFilaParaTipoInstanciaAdmin(tipo, stock) {
  let libres = sistema.buscarInstanciasLibresPorTipo(tipo);

  /**
   * `stock - libres.length` = cantidad que están alquiladas actualmente
   */
  return `
  <tr>
    <td>${formatearTipoUI(tipo)}</ts>
    <td>${stock}</td>
    <td>${stock - libres.length}</td>
    <td>${libres.length}</td>
    <td>
      <input
          type="number"
          min="0"
          id="numStockModificar${tipo}"
          value="${libres.length}"
        />
    </td>
    <td>
      <input
        type="button"
        id="btnStockGuardar${tipo}"
        tipo-instancia="${tipo}"
        value="Guardar"
      />
    </td>
  </tr>
  `;
}

/**
 * bindeada al evento "click" en los botonoes de "Guardar" de la pantalla `Gestión de Instancias`.
 */
function guardarCambioStockTipoAdmin() {
  let tipo = this.getAttribute("tipo-instancia");

  let valorActual = sistema.buscarInstanciasLibresPorTipo(tipo).length;
  let valorNuevo = document.querySelector(`#numStockModificar${tipo}`).value;
  let ok = false;

  if (esNumeroEnteroValido(valorNuevo)) {
    valorNuevoNumerico = Number(valorNuevo);

    if (valorNuevoNumerico > valorActual) {
      let cantidadAgregar = valorNuevoNumerico - valorActual;
      ok = sistema.agregarInstancias(tipo, cantidadAgregar);
    } else if (valorNuevoNumerico < valorActual) {
      let cantidadAReducir = valorActual - valorNuevoNumerico;
      ok = sistema.reducirStockDisponible(tipo, cantidadAReducir);
    } else {
      ok = true; // mejora la UX, si el admin puso mal un valor, el mismo se resettea al valor actual, y si vuelve a hacer click en guardar con dicho valor correcto, de esta forma se remueve el mensaje de error previo.
    }
  }

  verListadoDeInstanciasAdmin(); // mostramos primero el HTML

  if (!ok) {
    // Y luego mostramos el mensaje de error, si corresponde.
    // No se puede hacer al reves. De otra forma, el mensaje de error se pierde al refrescar la tabla.
    document.querySelector("#pErroresGIAdmin").innerHTML = "Valor inválido.";
  }
}

/**
 * Callback para el evento "change" del select de la pantalla `Alquilar`.
 * Regenera la tabla de opciones de alquiler según la categoría seleccionada.
 * @see Sistema.buscarTiposDeCategoria
 */
function cambiarFiltroAlquilerUsuario() {
  let filtro = this.value;
  filtroInstanciasAlquilar = filtro;
  verOpcionesAlquilerUsuario();
}

/**
 * Muestra todas las instancias que se pueden alquilar
 * para una categoria previamente seleccionada.
 * @default "Optimizadas para computo"
 */
function verOpcionesAlquilerUsuario() {
  ocultarElemento("divUsuarioMisInstancias");
  ocultarElemento("divUsuarioMisCostos");

  let tiposAMostrar = sistema.buscarTiposDeCategoria(filtroInstanciasAlquilar);

  let tabla = `
                <p id="pMensajeAlquiler"></p>
                <table>
                  <tr>
                      <th>
                        Instancia
                      </th>
                      <th>
                        Costo Alquiler
                      </th>
                      <th>
                        Costo por Encendido
                      </th>
                      <th>
                        Disponible
                      </th>
                      <th>
                        Operar
                      </th>
                  </tr>
                `;

  for (let i = 0; i < tiposAMostrar.length; i++) {
    let tipo = tiposAMostrar[i];

    let instancias = sistema.buscarInstanciasLibresPorTipo(tipo);

    let textoDisponible = "No";
    let clase = "alquilarInstancia";

    if (instancias.length > 0) {
      textoDisponible = "Si";
    }

    let botonAccion = `
    <td>
      <input 
        instancia-tipo="${tipo}" 
        class="${clase}" id="btnAlquilarInstancia${tipo}" 
        type="button" value="Alquilar"
      >
    </td>`;

    let tipoI = sistema.buscarTipo(tipo);

    tabla += `
                <tr>
                    <td>${formatearTipoUI(tipo)}</td>
                    <td>US$ ${tipoI.costoAlquiler}</td>
                    <td>US$ ${tipoI.costoEncendido}</td>
                    <td>${textoDisponible}</td>
                    ${botonAccion}
                </tr>    
            `;
  }

  tabla += `</table>`;

  imprimirEnHtml("divUsuarioAlquilarContenedorTabla", tabla);

  let botonesDeAlquiler = document.querySelectorAll(".alquilarInstancia");

  for (let i = 0; i < botonesDeAlquiler.length; i++) {
    let idDelBoton = botonesDeAlquiler[i].id;
    document
      .querySelector(`#${idDelBoton}`)
      .addEventListener("click", alquilarInstanciaUI);
  }

  mostrarElemento("divUsuarioAlquilar"); // refrescar la tabla
}

/**
 * Callback para el evento "click" de los botones de "Alquilar" de la pantalla `Alquilar Instancias`.
 * Refresca la tabla de opciones de alquiler luego de ejecutar la operación.
 */
function alquilarInstanciaUI() {
  let tipo = this.getAttribute("instancia-tipo");

  let alquilerOk = sistema.alquilarInstancia(
    tipo,
    usuarioLogeado.nombreUsuario
  );

  if (alquilerOk) {
    verOpcionesAlquilerUsuario();

    // NOTE: El mensaje de exito debería mostrarse luego de que se refresque la tabla.
    // de otra forma, se pierde el mensaje al refrescar la tabla posteriormente.
    document.querySelector(
      "#pMensajeAlquiler"
    ).innerHTML = `La máquina ${formatearTipoUI(
      tipo
    )} fue alquilada correctamente.`;
  } else {
    let el = document.querySelector("#pMensajeAlquiler");

    el.innerHTML = `La máquina ${formatearTipoUI(
      tipo
    )} no tiene stock disponible por el momento. Intente de nuevo más tarde.`;
    el.style.color = "red";
    el.style["font-weight"] = 500;
  }
}

/**
 * Muestra las instancias que el usuario tiene alquiladas.
 * Genera una tabla con las instancias, y permite filtrarlas por estado.
 *
 * Habilita botones para encender y apagar las instancias, acorde a su estado actual.
 * @default "todas"
 */
function verMisInstanciasUsuario() {
  ocultarElemento("divUsuarioMisCostos");
  ocultarElemento("divUsuarioAlquilar");
  mostrarElemento("divUsuarioMisInstancias");

  let misInstancias = sistema.buscarInstanciasDeUsuario(
    usuarioLogeado.nombreUsuario
  );

  let tabla = `
                <h2>Mis Instancias</h2>
                
                <select id="slcFiltroMisInstancias" style="width: 100%;">
                </select>

                <table>
                  <tr>
                      <th>
                        ID
                      </th>
                      <th>
                        Tipo
                      </th>
                      <th>
                        Estado
                      </th>
                      <th>
                        Veces iniciada
                      </th>
                      <th>
                        Operar
                      </th>
                  </tr>
                `;

  for (let i = 0; i < misInstancias.length; i++) {
    let instancia = misInstancias[i];

    // si el filtro no es "todas", y el estado de esta instancia no coincide con el filtro, no la mostramos.
    if (
      filtroInstanciasUsuario !== "todas" &&
      instancia.estado !== filtroInstanciasUsuario
    ) {
      continue;
    }

    let alquiler = sistema.buscarAlquiler(
      true,
      instancia.ID,
      usuarioLogeado.nombreUsuario
    );

    let textoAccion = "Encender";
    let clase = "encenderInstancia";

    if (instancia.estado === "ENCENDIDA") {
      textoAccion = "Apagar";
      clase = "apagarInstancia";
    }

    let botonAccion = `
    <td>
      <input 
        instancia-id="${instancia.ID}" 
        class="${clase}" id="btnOperarInstancia${instancia.ID}" 
        type="button" value="${textoAccion}"
      >
    </td>`;

    let textoVeces = "veces";

    if (alquiler.contadorEncendido === 1) {
      textoVeces = "vez";
    }

    tabla += `
                <tr>
                    <td>INSTANCE_ID_${instancia.ID}</td>
                    <td>${formatearTipoUI(instancia.tipo)}</td>
                    <td>${instancia.estado}</td>
                    <td>${alquiler.contadorEncendido} ${textoVeces}</td>
                    ${botonAccion}
                </tr>    
            `;
  }

  tabla += `</table>`;

  // agregar la tabla
  imprimirEnHtml("divUsuarioMisInstancias", tabla);

  // poblar de opciones el select de filtros
  document.querySelector("#slcFiltroMisInstancias").innerHTML = `
    <option id="todas" value="todas">Todas las instancias</option>
    <option id="ENCENDIDA" value="ENCENDIDA">Encendidas</option>
    <option id="APAGADA" value="APAGADA">Apagadas</option>
  `;

  // buscar la opcion que corresponde al filtro actual y marcarla como seleccionada
  document
    .querySelector(`#${filtroInstanciasUsuario}`)
    .setAttribute("selected", true);

  // bindear el evento change del select a la funcion de filtrado
  document
    .querySelector("#slcFiltroMisInstancias")
    .addEventListener("change", changeFiltroInstancias);

  // bindear los eventos click de los botones de encendido
  let botonesDeEncendido = document.querySelectorAll(".encenderInstancia");
  for (let i = 0; i < botonesDeEncendido.length; i++) {
    let idDelBoton = botonesDeEncendido[i].id;
    document
      .querySelector(`#${idDelBoton}`)
      .addEventListener("click", encenderInstanciaUI);
  }

  // bindear los eventos click de los botones de apagado
  let botonesDeApagado = document.querySelectorAll(".apagarInstancia");
  for (let i = 0; i < botonesDeApagado.length; i++) {
    let idDelBoton = botonesDeApagado[i].id;
    document
      .querySelector(`#${idDelBoton}`)
      .addEventListener("click", apagarInstanciaUI);
  }
}

function encenderInstanciaUI() {
  let idInstancia = this.getAttribute("instancia-id");

  sistema.encenderInstancia(Number(idInstancia));
  verMisInstanciasUsuario();
}

function apagarInstanciaUI() {
  let idInstancia = this.getAttribute("instancia-id");

  sistema.apagarInstancia(Number(idInstancia));
  verMisInstanciasUsuario();
}

function changeFiltroInstancias() {
  let filtro = this.value;
  filtrarMisInstanciasUsuario(filtro);
}

/**
 * Muestra las instancias que el usuario tiene alquiladas.
 *
 * Opcionalmente, se puede filtrar por un estado dado.
 *
 * @param {("APAGADA" | "ENCENDIDA" | "todas")} filtro
 * @default "todas"
 */
function filtrarMisInstanciasUsuario(filtro = "todas") {
  filtroInstanciasUsuario = filtro;
  verMisInstanciasUsuario();
}

/**
 * Muestra los costos de cada tipo de instancia que el usuario tiene en alquiler.
 */
function verMisCostos() {
  ocultarElemento("divUsuarioMisInstancias");
  ocultarElemento("divUsuarioAlquilar");
  mostrarElemento("divUsuarioMisCostos");

  let tabla = `
                <h2>Mis Costos</h2>
                <table>
                  <tr>
                      <th>
                        Tipo de Instancia
                      </th>
                      <th>
                        Costo por Encendido
                      </th>
                      <th>
                        Total de veces encendida
                      </th>
                      <th>
                        Costo total
                      </th>
                  </tr>
                `;

  let todasMisInstancias = sistema.buscarInstanciasDeUsuario(
    usuarioLogeado.nombreUsuario
  );

  for (let i = 0; i < sistema.arrayTiposInstancia.length; i++) {
    let tipo = sistema.arrayTiposInstancia[i].tipo;

    let instancias = sistema.buscarInstanciasPorTipo(tipo, todasMisInstancias);

    tabla += crearFilaCostosUsuario(instancias);
  }

  tabla += "</table>";

  imprimirEnHtml("divUsuarioMisCostos", tabla);
  mostrarElemento("divUsuarioMisCostos");
}

/**
 * Crea una fila que irá en la tabla
 * @param {MaquinaVirtual[]} arrInstancias
 */
function crearFilaCostosUsuario(arrInstancias) {
  if (!arrayTieneElementos(arrInstancias)) {
    return "";
  }

  let tipo = arrInstancias[0].tipo;
  let tipoI = sistema.buscarTipo(tipo);
  let costoEncendido = tipoI.costoEncendido;
  let costoTotal = 0;
  let totalEncendidos = 0;

  for (let i = 0; i < arrInstancias.length; i++) {
    let alquiler = sistema.buscarAlquiler(
      true,
      arrInstancias[i].ID,
      usuarioLogeado.nombreUsuario
    );

    costoTotal += tipoI.calcularCostos(alquiler.contadorEncendido);
    totalEncendidos += alquiler.contadorEncendido;
  }

  return `
  <tr>
    <td>${formatearTipoUI(tipo)}</td>
    <td>US$ ${costoEncendido}</td>
    <td>${totalEncendidos}</td>
    <td>US$ ${costoTotal}</td>
  </tr>
  `;
}

function verReportesAdmin() {
  ocultarElemento("divAdminAdministrarUsuario");
  ocultarElemento("divAdminStockInstancias");

  let tabla = `
                <h2>Reportes</h2>
                <table>
                  <tr>
                      <th>
                        Tipo de Instancia
                      </th>
                      <th>
                        Alquileres efectuados
                      </th>
                      <th>
                        Ingresos
                      </th>
                  </tr>
                `;

  let totalCantidadAlquileres = 0;
  let totalIngresos = 0;

  for (let i = 0; i < sistema.arrayTiposInstancia.length; i++) {
    let tipo = sistema.arrayTiposInstancia[i].tipo;

    let cantidadPorTipo = sistema.cantidadAlquileresPorTipo(tipo);
    let ingresosPorTipo = sistema.ingresosPorTipoDeInstancia(tipo);

    tabla += `
              <tr>
                  <td>${formatearTipoUI(tipo)}</td>
                  <td>${cantidadPorTipo}</td>
                  <td>US$ ${ingresosPorTipo}</td>
              </tr>
    `;

    totalCantidadAlquileres += cantidadPorTipo;
    totalIngresos += ingresosPorTipo;
  }

  tabla += `
              <tr style="outline: thin solid; font-weight: bold">
                  <td>TOTAL</td>
                  <td>${totalCantidadAlquileres}</td>
                  <td>US$ ${totalIngresos}</td>
              </tr>
  `;

  tabla += "</table>";

  imprimirEnHtml("divAdminReportes", tabla);

  mostrarElemento("divAdminReportes");
}
