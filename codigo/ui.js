window.addEventListener("load", inicio);

let sistema = new Sistema();

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

  document
    .querySelector("#aGestionarInstancias")
    .addEventListener("click", verListadoDeInstancias);

  // document
  //   .querySelector("#slcTipoCrear")
  //   .addEventListener("change", refrescarDatosInstanciaCrear);

  // La pantalla por defecto es el login - no landing page (bajo presupuesto).
  mostrarPantallaLogin();

  // forzar login mientras testeamos
  iniciarSesionUI("mateo", "1234");
}

function mostrarPantallaLogin() {
  mostrarElemento("divLogin");
  ocultarElemento("divRegistroUsuario");
  ocultarElemento("divRegistroUsuario");
  ocultarElemento("divContenidoAdministrador");
  ocultarElemento("cabezal");

  // document.querySelector("#divContenidoUsuario").style.display = "none";
}

/**
 * u,c = parametros opcionales para automatizar el login mientras testeamos.
 * @param {?string} u
 * @param {?string} c
 */
function iniciarSesionUI(u, c) {
  let nomUsuario = obtenerValorDeUnElementoHTML("txtNomUsu") || u;
  let contrasena = obtenerValorDeUnElementoHTML("txtPassword") || c;

  if (sistema.validarLogin(nomUsuario, contrasena)) {
    let esAdmin = sistema.esAdmin(nomUsuario);

    if (esAdmin) {
      document.querySelector("#divContenidoAdministrador").style.display =
        "block";
      mostrarNavAdmin();
      // verListadoDeUsuarios(); // por defecto mostrarle la lista de usuarios al admin.
      verListadoDeInstancias();
    } else {
      ocultarNavAdmin();
      // document.querySelector("#divContenidoUsuario").style.display = "block";
    }

    document.querySelector("#cabezal").style.display = "block";

    document.querySelector("#divLogin").style.display = "none";
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
  let nombreUsuario = obtenerValorDeUnElementoHTML("txtNomUsuRegistro");
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

  if (erroresValidacion.length === 0) {
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
        "Usuario creado exitosamente. Pendiente de aprobacion"
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
  if (!hayCaracteres(pContrasena) || !sistema.validarContrasena(pContrasena)) {
    arrayErrores.push("Debe ingresar contrasenia.");
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
  mostrarPantallaLogin();
}

function mostrarPantallaRegistro() {
  document.querySelector("#divRegistroUsuario").style.display = "block";
  document.querySelector("#divLogin").style.display = "none";
}

function verListadoDeUsuarios() {
  document.querySelector("#divAdminStockInstancias").style.display = "none";

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

function verListadoDeInstancias() {
  document.querySelector("#divAdminAdministrarUsuario").style.display = "none";

  let tablaComputo = generarTablaParaCategoriaInstancia(
    "Optimizadas para computo"
  );

  let tablaMemoria = generarTablaParaCategoriaInstancia(
    "Optimizadas para memoria"
  );

  let tablaAlmacenamiento = generarTablaParaCategoriaInstancia(
    "Optimizadas para almacenamiento"
  );

  let htmlFinal = `
  <h2>Gestión de Instancias</h2>
  ${tablaComputo}
  <hr/>
  ${tablaMemoria}
  <hr/>
  ${tablaAlmacenamiento}
  `;

  imprimirEnHtml("divAdminStockInstancias", htmlFinal);
  mostrarElemento("divAdminStockInstancias");

  for (let i = 0; i < arrTipoInstancias.length; i++) {
    let tipo = arrTipoInstancias[i];

    document
      .querySelector(`#btnStockGuardar${tipo}`)
      .addEventListener("click", guardarCambioStockTipo);
  }
}

/**
 *
 * @param {INSTANCIA_CATEGORIA} categoria
 */
function generarTablaParaCategoriaInstancia(categoria) {
  let arrInstancias = sistema.buscarInstanciasPorCategoria(categoria);

  let smalls = sistema.buscarInstanciasPorTamanio("small", arrInstancias);
  let mediums = sistema.buscarInstanciasPorTamanio("medium", arrInstancias);
  let larges = sistema.buscarInstanciasPorTamanio("large", arrInstancias);

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

  let prefijo = prefijoSegunCategoria(categoria);

  // i = almacenamiento no tiene smalls.
  if (prefijo !== "i") {
    tabla += generarFilaParaTipoInstancia(prefijo + "7small", smalls.length);
  }

  tabla += generarFilaParaTipoInstancia(prefijo + "7medium", mediums.length);
  tabla += generarFilaParaTipoInstancia(prefijo + "7large", larges.length);

  tabla += "</table>";

  return tabla;
}

function generarFilaParaTipoInstancia(tipo, stock) {
  let libres = sistema.buscarInstanciasLibresPorTipo(tipo);

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

function guardarCambioStockTipo() {
  let tipo = this.getAttribute("tipo-instancia");

  let valorActual = sistema.buscarInstanciasLibresPorTipo(tipo).length;
  let valorNuevo = document.querySelector(`#numStockModificar${tipo}`).value;

  if (esNumeroEnteroValido(valorNuevo)) {
    valorNuevoNumerico = Number(valorNuevo);

    if (valorNuevoNumerico > valorActual) {
      let cantidadAgregar = valorNuevoNumerico - valorActual;
      sistema.agregarInstancias(tipo, cantidadAgregar);
    } else if (valorNuevoNumerico < valorActual) {
      let cantidadAReducir = valorActual - valorNuevoNumerico;
      sistema.reducirStockDisponible(tipo, cantidadAReducir);
    }
  } else {
    // TODO: mostrar mensaje de error - Preguntarle al profe donde se muestran / como
  }

  verListadoDeInstancias();
}
