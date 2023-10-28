class Sistema {
  constructor() {
    /**
     * @type {UsuarioAdministrador[]}
     */
    this.arrayUsuariosAdmin = [];
    /**
     * @type {UsuarioComun[]}
     */
    this.arrayUsuariosComunes = [];
    /**
     * @type {MaquinaVirtual[]}
     */
    this.arrayInstancias = [];

    /**
     * @type {InstanciaAlquilada[]}
     */
    this.arrayAlquileres = [];

    this.precargaDeDatos();
  }

  //validar login
  validarLogin(pNomUsuario, pContrasena) {
    let i = 0;
    while (i < this.arrayUsuariosAdmin.length) {
      let unUsuario = this.arrayUsuariosAdmin[i];
      if (unUsuario.nombreUsuario === pNomUsuario) {
        if (unUsuario.contrasena === pContrasena) {
          return true;
        } else {
          return false;
        }
      }
      i++;
    }

    let j = 0;

    while (j < this.arrayUsuariosComunes.length) {
      let unUsuario = this.arrayUsuariosComunes[j];
      if (unUsuario.nombreUsuario === pNomUsuario) {
        if (unUsuario.contrasena === pContrasena) {
          return true;
        } else {
          return false;
        }
      }
      j++;
    }

    return false;
  }

  esAdmin(pNomUsuario) {
    let esAdmin = false;

    for (let i = 0; i < this.arrayUsuariosAdmin.length; i++) {
      if (this.arrayUsuariosAdmin[i].nombreUsuario === pNomUsuario) {
        return true;
      }
    }

    return esAdmin;
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
    let admin = this.buscarAdminObjeto(pNomUsu);

    if (usuario === null && admin === null) {
      usuario = new UsuarioComun(
        pNombre,
        pApellido,
        pNomUsu,
        pContrasena,
        pNroTjt,
        pCvcTjt
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

    while (i < this.arrayUsuariosComunes.length) {
      let unUsuario = this.arrayUsuariosComunes[i];
      if (unUsuario.nombreUsuario === pNombreUsuario) {
        return unUsuario;
      }
      i++;
    }

    return null;
  }

  buscarAdminObjeto(pNombreUsuario) {
    let i = 0;

    while (i < this.arrayUsuariosAdmin.length) {
      let unUsuario = this.arrayUsuariosAdmin[i];
      if (unUsuario.nombreUsuario === pNombreUsuario) {
        return unUsuario;
      }
      i++;
    }

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

  /**
   * @param {INSTANCIA_TIPO} pTipo
   */
  agregarInstancia(pTipo) {
    let instancia = new MaquinaVirtual(pTipo);
    this.arrayInstancias.push(instancia);
  }

  /**
   * @param {INSTANCIA_TIPO} pTipo
   * @param {number} cantidadAgregar
   */
  agregarInstancias(pTipo, cantidadAgregar) {
    if (!esNumeroEnteroValido(cantidadAgregar)) {
      return;
    }

    for (let i = 0; i < cantidadAgregar; i++) {
      this.agregarInstancia(pTipo);
    }
  }

  /**
   * @param {INSTANCIA_CATEGORIA} categoria
   * @returns {MaquinaVirtual[]}
   */
  buscarInstanciasPorCategoria(categoria) {
    let arr = [];

    for (let i = 0; i < this.arrayInstancias.length; i++) {
      let instancia = this.arrayInstancias[i];

      if (instancia.categoria === categoria) {
        arr.push(instancia);
      }
    }

    return arr;
  }

  /**
   * Conseguir una máquina disponible para dársela en alquiler al usuario que la requiera.
   * @param {INSTANCIA_TIPO} tipo
   * @returns {MaquinaVirtual[]}
   */
  buscarInstanciasLibresPorTipo(tipo) {
    let libres = [];

    for (let i = 0; i < this.arrayInstancias.length; i++) {
      let instancia = this.arrayInstancias[i];

      if (instancia.tipo === tipo && this.maquinaEstaLibre(instancia.ID)) {
        libres.push(instancia);
      }
    }

    return libres;
  }

  /**
   * @param {INSTANCIA_TIPO} tipo
   * @returns {MaquinaVirtual[]}
   */
  buscarInstanciasPorTipo(tipo) {
    let instancias = [];

    for (let i = 0; i < this.arrayInstancias.length; i++) {
      let instancia = this.arrayInstancias[i];

      if (instancia.tipo === tipo) {
        instancias.push(instancia);
      }
    }

    return instancias;
  }

  /**
   * @param {INSTANCIA_TIPO} tipo
   * @param {number} cantidadAReducir Cantidad de instancias a sacar de las `libres`.
   */
  reducirStockDisponible(tipo, cantidadAReducir) {
    if (!esNumeroEnteroValido(cantidadAReducir)) {
      return false;
    }

    let libres = this.buscarInstanciasLibresPorTipo(tipo);

    const instanciasAEliminar = libres.splice(0, cantidadAReducir);

    // buscar el indice de esta instancia en el arreglo original
    for (let i = 0; i < instanciasAEliminar.length; i++) {
      const instanciaLibre = instanciasAEliminar[i];

      for (let j = 0; j < this.arrayInstancias.length; j++) {
        const instancia = this.arrayInstancias[j];

        if (instanciaLibre.ID === instancia.ID) {
          this.arrayInstancias.splice(j, 1);
        }
      }
    }

    console.log(
      `Se eliminaron ${instanciasAEliminar.length} instancias del tipo ${tipo}.`
    );

    return true;
  }

  /**
   * Recorre this.arrayAlquileres, si encuentra una maquina con la ID proporcionada, significará que está alquilada actualmente.
   * @param {number} id
   * @returns {boolean}
   */
  maquinaEstaLibre(id) {
    for (let i = 0; i < this.arrayAlquileres.length; i++) {
      let alquilada = this.arrayAlquileres[i];

      if (alquilada.idInstancia === id) {
        console.log(`la maquina ${id} NO esta libre`);
        return false;
      }
    }

    console.log(`la maquina ${id} SI esta libre`);
    return true;
  }

  /**
   * Buscará por el criterio proporcionado, en `this.arrayInstancias`, o en `arrInstancias` de ser provisto.
   *
   * @param {INSTANCIA_TAMANIO} tamanio
   * @param {?MaquinaVirtual[]} arrInstancias Si no es provisto, usará this.arrayInstancias.
   *
   * @returns {MaquinaVirtual[]}
   */
  buscarInstanciasPorTamanio(tamanio, arrInstancias = null) {
    arrInstancias = arrInstancias || this.arrayInstancias;

    let arr = [];

    for (let i = 0; i < arrInstancias.length; i++) {
      let instancia = arrInstancias[i];

      if (instancia.tipo.indexOf(tamanio) !== -1) {
        arr.push(instancia);
      }
    }

    return arr;
  }

  /**
   *
   * @param {INSTANCIA_TIPO} tipoInstancia
   * @param {string} nomUsuario
   * @returns {boolean}
   */
  alquilarInstancia(tipoInstancia, nomUsuario) {
    if (!this.buscarUsuarioObjeto(nomUsuario)) {
      return false;
    }

    let instancias = this.buscarInstanciasLibresPorTipo(tipoInstancia);

    if (instancias.length === 0) {
      return false;
    }

    let alquilada = new InstanciaAlquilada(instancias[0].ID, nomUsuario);
    this.arrayAlquileres.push(alquilada);

    return true;
  }

  precargaDeDatos() {
    // precarga de usuarios administradores
    let admin1 = new UsuarioAdministrador("gaston", "1234");
    let admin2 = new UsuarioAdministrador("mateo", "1234");
    let admin3 = new UsuarioAdministrador("matt1", "1234");
    this.arrayUsuariosAdmin.push(admin1, admin2, admin3);

    // precarga de usuarios comunes
    this.registrarUsuario(
      "mateo",
      "carriqui",
      "matt",
      "1234",
      "4539-6253-0847-8250",
      "323"
    );
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

    // precarga de instancias
    this.agregarInstancias("c7small", 8);
    this.agregarInstancias("c7medium", 5);
    this.agregarInstancias("c7large", 3);

    this.agregarInstancias("r7small", 7);
    this.agregarInstancias("r7medium", 5);
    this.agregarInstancias("r7large", 2);

    this.agregarInstancias("i7medium", 3);
    this.agregarInstancias("i7large", 2);
  }
}
