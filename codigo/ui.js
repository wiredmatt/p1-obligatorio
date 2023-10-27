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

  // La pantalla por defecto es el login - no landing page (bajo presupuesto).
  mostrarPantallaLogin();
}

function mostrarPantallaLogin() {
  document.querySelector("#divLogin").style.display = "block";
  document.querySelector("#divRegistroUsuario").style.display = "none";
  document.querySelector("#divContenidoAdministrador").style.display = "none";
  // document.querySelector("#divContenidoUsuario").style.display = "none";
  document.querySelector("#cabezal").style.display = "none";
}

function iniciarSesionUI() {
  let nomUsuario = obtenerValorDeUnElementoHTML("txtNomUsu");
  let contrasena = obtenerValorDeUnElementoHTML("txtPassword");

  if (sistema.validarLogin(nomUsuario, contrasena)) {
    let esAdmin = sistema.esAdmin(nomUsuario);

    if (esAdmin) {
      document.querySelector("#divContenidoAdministrador").style.display =
        "block";
      mostrarNavAdmin();
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
  document.querySelector("#divAdminCrearPelicula").style.display = "none";

  let tabla = `
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
