window.addEventListener("load", inicio);

let sistema = new Sistema();

function inicio() {
  document
    .querySelector("#btnGuardar")
    .addEventListener("click", guardarPeliculaUI);
  document
    .querySelector("#btnListarTodas")
    .addEventListener("click", listarTodas);
  document
    .querySelector("#btnListarProm4OMas")
    .addEventListener("click", listarProm4OMas);
  document
    .querySelector("#btnBuscarPelicula")
    .addEventListener("click", buscarYMostrarPelicula);

  //cosas del login
  document
    .querySelector("#btnRegistrarse")
    .addEventListener("click", mostrarPantallaRegistro);
  document
    .querySelector("#btnCrearUsuarioVolverLogin")
    .addEventListener("click", mostrarPantallaLogin);
  document
    .querySelector("#btnIniciarSesion")
    .addEventListener("click", iniciarSesionUI);

  //registro usuario
  document
    .querySelector("#btnCrearUsuario")
    .addEventListener("click", registroUsuarioUI);

  //cerrar sesion
  document
    .querySelector("#aCerrarSesion")
    .addEventListener("click", cerrarSesionUI);

  //moverse entre secciones admin
  document
    .querySelector("#aListadoUsuarios")
    .addEventListener("click", verListadoDeUsuarios);

  cargarGenerosCombo();
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
    //aca llamamos al sistema
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

function guardarPeliculaUI() {
  let nombre = obtenerValorDeUnElementoHTML("txtNombre");
  let anio = obtenerValorDeUnElementoHTML("txtAnio");
  let genero = obtenerValorDeUnElementoHTML("slcGenero");
  let nroVotantes = obtenerValorDeUnElementoHTML("txtNroVotantes");
  let totalPuntos = obtenerValorDeUnElementoHTML("txtTotalPuntos");

  let mensaje = "";

  if (!isNaN(anio) && !isNaN(nroVotantes) && !isNaN(totalPuntos)) {
    if (sistema.buscarPeliculaObjeto(nombre) === null) {
      let anioNum = Number(anio);
      let nroVotantesNum = Number(nroVotantes);
      let totalPuntosNum = Number(totalPuntos);
      let guaradaOk = sistema.guardarPelicula(
        nombre,
        anioNum,
        genero,
        nroVotantesNum,
        totalPuntosNum
      );
      if (guaradaOk) {
        mensaje = "Agregada ok";
      } else {
        mensaje = "Hubo un error";
      }
    } else {
      mensaje = `La pelicula ${nombre} ya existe`;
    }
  } else {
    mensaje = "Año, nro votantes y total puntos deben ser valores numericos";
  }
  document.querySelector("#pResultado").innerHTML = mensaje;
}

function cargarGenerosCombo() {
  let generos = [
    "Animadas",
    "Comedia",
    "Drama",
    "Ciencia Ficcion",
    "Uno nuevo",
    "Otro mas",
  ];

  for (let i = 0; i < generos.length; i++) {
    document.querySelector(
      "#slcGenero"
    ).innerHTML += `<option value="${generos[i]}">${generos[i]}</option>`;
  }
}

function listarTodas() {
  if (sistema.arrayPeliculas.length > 0) {
    document.querySelector("#divTabla").innerHTML = "";
    let tabla = `<table border=1>
                        <tr>
                            <th>Nombre</th>
                            <th>Año</th>
                            <th>Genero</th>
                            <th>Nro Votantes</th>
                            <th>Total Puntos</th>
                        </tr>`;
    for (let i = 0; i < sistema.arrayPeliculas.length; i++) {
      let peliRecorrida = sistema.arrayPeliculas[i];
      tabla += `<tr>
                            <td>${peliRecorrida.nombre}</td> 
                            <td>${peliRecorrida.anio}</td> 
                            <td>${peliRecorrida.genero}</td> 
                            <td>${peliRecorrida.numeroVotanes}</td> 
                            <td>${peliRecorrida.totalPuntos}</td> 
                        </tr>`;
    }
    tabla += `</table>`;
    document.querySelector("#divTabla").innerHTML += tabla;
  } else {
    document.querySelector("#divTabla").innerHTML +=
      "No hay peliculas cargadas";
  }
}

function listarProm4OMas() {
  document.querySelector("#divTabla").innerHTML = "";
  let tabla = `<table border=1>
                    <tr>
                        <th>Nombre</th>
                        <th>Año</th>
                        <th>Genero</th>
                        <th>Nro Votantes</th>
                        <th>Total Puntos</th>
                    </tr>`;
  for (let i = 0; i < sistema.arrayPeliculas.length; i++) {
    let peliRecorrida = sistema.arrayPeliculas[i];
    let promedio = peliRecorrida.totalPuntos / peliRecorrida.numeroVotanes;
    if (promedio >= 4) {
      tabla += `<tr>
                        <td>${peliRecorrida.nombre}</td> 
                        <td>${peliRecorrida.anio}</td> 
                        <td>${peliRecorrida.genero}</td> 
                        <td>${peliRecorrida.numeroVotanes}</td> 
                        <td>${peliRecorrida.totalPuntos}</td> 
                    </tr>`;
    }
  }
  tabla += `</table>`;
  document.querySelector("#divTabla").innerHTML += tabla;
}

function buscarYMostrarPelicula() {
  let nombreParaBuscar = obtenerValorDeUnElementoHTML("txtNombreBusqueda");

  let mensaje = "";

  let pelicula = sistema.buscarPeliculaObjeto(nombreParaBuscar);

  if (pelicula !== null) {
    mensaje = `
            <strong>Nombre:</strong> ${pelicula.nombre} <br>
            <strong>Año:</strong> ${pelicula.anio} <br>
            <strong>Genero:</strong> ${pelicula.genero} <br>
            <strong>Total puntos:</strong> ${pelicula.totalPuntos} <br>
            <strong>Cantidad de votantes:</strong> ${pelicula.numeroVotanes}
            `;
  } else {
    mensaje = "La pelicula no existe";
  }

  document.querySelector("#pBusquedaPelicula").innerHTML = mensaje;
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
                          Activar
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
      // una vez bloqueado el usuario, no hay ninguna accion para ofrecerle al administrador sobre este usuario.
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
