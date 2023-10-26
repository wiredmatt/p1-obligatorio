class Sistema {
  constructor() {
    this.arrayPeliculas = [];
    this.arrayUsuariosAdmin = [];
    this.arrayUsuariosComunes = [];
    this.contadorIdPeliculas = 1;
    this.precargaDeDatos();
  }

  //validar login
  validarLogin(pNomUsuario, pContrasena) {
    //let encontrado = false;
    //let loginOk = false;

    let i = 0;
    //while(i < this.arrayUsuariosAdmin.length && !encontrado) {
    while (i < this.arrayUsuariosAdmin.length) {
      //el usuario que estoy recorreindo
      let unUsuario = this.arrayUsuariosAdmin[i];
      if (unUsuario.nombreUsuario === pNomUsuario) {
        if (unUsuario.contrasena === pContrasena) {
          return true;
          //encontrado = true;
          //loginOk = true;
        } else {
          //encontrado = true;
          return false;
        }
      }
      i++;
    }
    //return loginOk;
    return false;
  }

  //guardar las peliculas en el sistema
  guardarPelicula(pNombre, pAnioNum, pGenero, pNroVotantesNum, pTotalPuntos) {
    let guardadaOk = false;
    if (
      this.validarPelicula(
        pNombre,
        pAnioNum,
        pGenero,
        pNroVotantesNum,
        pTotalPuntos
      )
    ) {
      let pelicula = new Pelicula(
        this.contadorIdPeliculas,
        pNombre,
        pAnioNum,
        pGenero,
        pNroVotantesNum,
        pTotalPuntos
      );
      this.arrayPeliculas.push(pelicula);
      guardadaOk = true;
      this.contadorIdPeliculas++;
      console.log("Pelicula guardada con exito");
    } else {
      console.log("Hubo un error al guardar una pelicula");
    }
    return guardadaOk;
  }

  //validamos los datos de la pelicula que vamos a guardar antes de guardarla en el sistema
  //ya validamos en le html, pero nos defendemos ante posibles errores no contemplados
  validarPelicula(pNombre, pAnioNum, pGenero, pNroVotantesNum, pTotalPuntos) {
    let esValida = false;
    if (
      pNombre !== "" &&
      !isNaN(pAnioNum) &&
      Number(pAnioNum) > 0 &&
      pGenero !== "" &&
      !isNaN(pNroVotantesNum) &&
      Number(pNroVotantesNum) &&
      !isNaN(pTotalPuntos) &&
      Number(pTotalPuntos) &&
      this.buscarPeliculaObjeto(pNombre) === null
    ) {
      esValida = true;
    }
    return esValida;
  }

  //las funciones o metodos de las clases, no llevan la palabra function
  //function buscarPeliculaObjeto(pNombrePeli) {
  buscarPeliculaObjeto(pNombrePeli) {
    //let encontrada = false;
    let peliculaEncontrada = null; //objetoPeli
    let i = 0;

    //largo: 10
    // rec 4
    while (i < this.arrayPeliculas.length && peliculaEncontrada === null) {
      //obejeto pelicula
      let peliRecorrida = this.arrayPeliculas[i];
      //arrayPeliculas[i];
      if (pNombrePeli.toLowerCase() === peliRecorrida.nombre.toLowerCase()) {
        //encontrada = true;
        peliculaEncontrada = peliRecorrida;
      }
      i++;
    }

    return peliculaEncontrada;
  }

  registrarUsuario(pNombre, pApellido, pNomUsu, pContrasena, pNroTjt, pCvcTjt) {
    //el estado por defecto siempre va a ser pendiente, por lo tanto  lo seteo yo a mano

    if (
      !this.validarDatosUsuario(
        pNombre,
        pApellido,
        pNomUsu,
        pContrasena,
        pNroTjt,
        pCvcTjt
      )
    ) {
      console.log("Error registro usuario");
      return false;
    }

    let usuario = this.buscarUsuarioObjeto(pNomUsu);

    if (usuario === null) {
      // let usuarioNuevo
      usuario = new UsuarioComun(
        pNombre,
        pApellido,
        pNomUsu,
        pContrasena,
        pNroTjt,
        pCvcTjt,
        "pendiente"
      );
      this.arrayUsuariosComunes.push(usuario);
      console.log("Usuario registrado ok");
      return true;
    }
    console.log("Error registro usuario");
    return false;
  }

  validarDatosUsuario(
    pNombre,
    pApellido,
    pNomUsu,
    pContrasena,
    pNroTjt,
    pCvcTjt
  ) {
    //let esValido = true;
    if (
      !hayCaracteres(pNombre) ||
      !hayCaracteres(pApellido) ||
      !hayCaracteres(pNomUsu) ||
      !hayCaracteres(pContrasena) ||
      !hayCaracteres(pNroTjt) ||
      !hayCaracteres(pCvcTjt) ||
      pCvcTjt.length !== 3 ||
      isNaN(pCvcTjt) ||
      !this.validarContrasena(pContrasena) ||
      !this.validarTarjeta(pNroTjt)
    ) {
      //esValido = false;
      return false;
    }
    //return esValido;
    return true;
  }

  validarContrasena(pContrasena) {
    //validar que tenga la menos 3 caracteres
    /*
            if(pContrasena.length >= 3) {
                return true;
            }
            return false;
        
        */
    return pContrasena.length >= 3;
  }

  buscarUsuarioObjeto(pNombreUsuario) {
    let i = 0;

    //let usuarioEncontrado = null;
    // while(i < this.arrayUsuariosComunes && usuarioEncontrado === null)
    while (i < this.arrayUsuariosComunes.length) {
      let unUsuario = this.arrayUsuariosComunes[i];
      if (unUsuario.nombreUsuario === pNombreUsuario) {
        return unUsuario;
        //usuarioEncontrado = unUsuario;
      }
      i++;
    }

    //return usuarioEncontrado;
    return null;
  }

  validarTarjeta(pNumeroTarjeta) {
    // let esValida = true; //falso

    if (pNumeroTarjeta.length !== 19) {
      //esValida = false;
      return false;
    }

    if (
      pNumeroTarjeta.charAt(4) !== "-" ||
      pNumeroTarjeta.charAt(9) !== "-" ||
      pNumeroTarjeta.charAt(14) !== "-"
    ) {
      // esValida = false;
      return false;
    }

    //aca vamos a tener eventualmente solo los numeros de la tarjeta
    //sin los guiones
    let tarjetaFormateada = this.sacarGuiones(pNumeroTarjeta);

    if (tarjetaFormateada.length !== 16) {
      // esValida = false;
      return false;
    }

    if (isNaN(tarjetaFormateada)) {
      //esValida = false;
      return false;
    }

    if (!this.validarLuhn(tarjetaFormateada)) {
      //esValida = false;
      return false;
    }

    return true;
  }

  //va a recibir el numero de tarjeta ya formateado
  validarLuhn(pNumeroTjtFormateado) {
    let suma = 0;
    let duplicar = true;
    for (let i = pNumeroTjtFormateado.length - 2; i >= 0; i--) {
      let numeroActual = Number(pNumeroTjtFormateado.charAt(i));
      if (duplicar) {
        let duplicado = numeroActual * 2;
        if (duplicado > 9) {
          duplicado = duplicado - 9;
          // duplicado = (duplicado % 10) + 1
        }
        suma += duplicado;
        //duplicar = false;
      } else {
        suma += numeroActual;
        //duplicar = true;
      }
      duplicar = !duplicar;
    }

    let por9 = suma * 9;
    let mod10Final = por9 % 10;

    let ultimoDigitoDeTarjeta = Number(
      pNumeroTjtFormateado.charAt(pNumeroTjtFormateado.length - 1)
    );

    let luhnValido = false;
    if (ultimoDigitoDeTarjeta === mod10Final) {
      luhnValido = true;
    }

    return luhnValido;
  }

  sacarGuiones(pNumeroTarjeta) {
    let tarjetaSinGuiones = ""; //4563685

    for (let i = 0; i < pNumeroTarjeta.length; i++) {
      if (pNumeroTarjeta.charAt(i) !== "-") {
        tarjetaSinGuiones += pNumeroTarjeta.charAt(i);
      }
    }

    return tarjetaSinGuiones;
  }

  activarUsuario(pNombreUsuario) {
    let usuario = this.buscarUsuarioObjeto(pNombreUsuario);
    if (usuario !== null) {
      usuario.estado = "activo";
    }
  }

  bloquearUsuario(pNombreUsuario) {
    let usuario = this.buscarUsuarioObjeto(pNombreUsuario);
    if (usuario !== null) {
      usuario.estado = "bloqueado";
    }
  }

  precargaDeDatos() {
    //this.arrayPeliculas.push(new Pelicula(1, "Madagascar 1", "2004", "Animada", 10, "10"));
    //this.arrayPeliculas.push(new Pelicula(2, "Madagascar 2", "2008", "Animada", 10, 10));
    //this.arrayPeliculas.push(new Pelicula(3, "Madagascar 3", "2011", "Animada", 10, 10));
    this.guardarPelicula("Madagascar 1", 2004, "Animada", 10, 10);
    this.guardarPelicula("Madagascar 2", 2008, "Animada", 10, 10);
    this.guardarPelicula("Shrek", 0, "Animada", "10", 10);
    this.guardarPelicula("Madagascar 3", 2011, "Animada", 10, 10);

    // precarga de usuarios administradores
    let admin1 = new UsuarioAdministrador("gaston", "1234");
    let admin2 = new UsuarioAdministrador("mateo", "1234");
    this.arrayUsuariosAdmin.push(admin1, admin2);

    // precarga de usuarios comunes
    this.registrarUsuario(
      "Gaston",
      "Sanguinetti",
      "g.sangui",
      "1234",
      "4539-6253-0847-8250",
      "323"
    );
    this.registrarUsuario(
      "Mateo",
      "Sanguinetti",
      "m.sangui",
      "1234",
      "4539-6253-0847-8250",
      "323"
    );
    this.registrarUsuario(
      "Juan",
      "Perez",
      "j.perez",
      "1234",
      "4539-623-0847-8250",
      "323"
    );
    this.registrarUsuario(
      "Fulano",
      "Sultan",
      "f.sultan",
      "1234",
      "4539-6253-0847-8250",
      "323"
    );
  }
}
