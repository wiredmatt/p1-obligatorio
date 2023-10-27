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
      verListadoDeUsuarios(); // por defecto mostrarle la lista de usuarios al admin.
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
                        Stock Actual
                      </th>
                      <th>
                        Stock a modificar
                      </th>
                      <th>
                        Confirmar
                      </th>
                  </tr>
                `;

  let prefijo = prefijoSegunCategoria(categoria);

  // i = almacenamiento no tiene smalls.
  if (prefijo !== "i") {
    tabla += generarFilaParaTipoInstancia(prefijo + "7.small", smalls.length);
  }

  tabla += generarFilaParaTipoInstancia(prefijo + "7.medium", mediums.length);
  tabla += generarFilaParaTipoInstancia(prefijo + "7.large", larges.length);

  tabla += "</table>";

  return tabla;
}

function generarFilaParaTipoInstancia(tipo, stock) {
  return `
  <tr>
    <td>${tipo}</ts>
    <td>${stock}</td>
    <td>
      <input
          type="number"
          min="0"
          id="numStockModificar${tipo}"
          value="0"
        />
    </td>
    <td>
      <input
        type="button"
        id="btnStock${tipo}"
        tipo-instancia="${tipo}"
        value="Guardar"
      />
    </td>
  </tr>
  `;
}

// function refrescarDatosInstanciaCrear() {
//   let tipoSeleccionado = obtenerValorDeUnElementoHTML("slcTipoCrear");

//   let costoAlq = MaquinaVirtual.tipoACostoAlquiler(tipoSeleccionado);
//   let costoEnc = MaquinaVirtual.tipoACostoEncendido(tipoSeleccionado);
//   let id = MaquinaVirtual.contadorID;

//   document.querySelector("#txtIDInstancia").value = id;
//   document.querySelector("#txtCostoAlquiler").value = costoAlq;
//   document.querySelector("#txtCostoEncendido").value = costoEnc;
// }
// <!-- <div id="divAdminCrearInstancia">
// <h1>Crear una nueva instancia</h1>
// <h2>Ingrese los datos</h2>
// <label for="slcTipoCrear">Seleccione Tipo</label>
// <select id="slcTipoCrear" style="width: 68%">
//   <optgroup label="Optimizadas para Cómputo">
//     <option value="c7.small">c7.small</option>
//     <option value="c7.medium">c7.medium</option>
//     <option value="c7.large">c7.large</option>
//   </optgroup>
//   <optgroup label="Optimizadas para Memoria">
//     <option value="r7.small">r7.small</option>
//     <option value="r7.medium">r7.medium</option>
//     <option value="r7.large">r7.large</option>
//   </optgroup>
//   <optgroup label="Optimizadas para Almacenamiento">
//     <option value="i7.medium">i7.medium</option>
//     <option value="i7.large">i7.large</option>
//   </optgroup>
// </select>

// <label for="txtIDInstancia">ID</label>
// <input id="txtIDInstancia" type="text" disabled value="1" />

// <label for="txtCostoAlquiler">Costo De Alquiler</label>
// <input id="txtCostoAlquiler" type="text" disabled value="$20" />

// <label for="txtCostoEncendido">Costo de Encendido</label>
// <input id="txtCostoEncendido" type="text" disabled value="$2.5" />

// <input
//   id="btnCrearInstancia"
//   type="button"
//   value="Agregar instancia"
// />
// </div> -->
