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
     * @type {Alquiler[]}
     */
    this.arrayAlquileres = [];

    this.precargaDeDatos();
  }

  /**
   * `true` si las credenciales son válidas, `false` si no.
   * @param {string} pNomUsuario
   * @param {string} pContrasena
   * @returns {boolean}
   */
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

  /**
   * @param {string} pNomUsuario
   * @returns {boolean}
   */
  usuarioEstaActivo(pNomUsuario) {
    let usuario = this.buscarUsuarioObjeto(pNomUsuario);
    if (usuario !== null) {
      if (usuario.estado === "activo") {
        return true;
      }
    }
    return false;
  }

  /**
   * `true` si el usuario es administrador, `false` si no.
   * @param {string} pNomUsuario
   * @returns
   */
  esAdmin(pNomUsuario) {
    let esAdmin = false;

    for (let i = 0; i < this.arrayUsuariosAdmin.length; i++) {
      if (this.arrayUsuariosAdmin[i].nombreUsuario === pNomUsuario) {
        return true;
      }
    }

    return esAdmin;
  }

  /**
   *
   * @param {string} pNombre
   * @param {string} pApellido
   * @param {string} pNomUsu
   * @param {string} pContrasena
   * @param {number} pNroTjt
   * @param {number} pCvcTjt
   * @returns
   */
  registrarUsuario(pNombre, pApellido, pNomUsu, pContrasena, pNroTjt, pCvcTjt) {
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
      !this.validarTarjeta(pNroTjt) ||
      !this.validarNombreUsuario(pNomUsu)
    ) {
      return false;
    }
    return true;
  }

  /**
   * Formato string alfanumérico, case insensitive.
   *
   * Acepta "." y "_" como caracteres especiales.
   *
   * A modo de ejemplo: martin.luz01.
   *
   * @param {string} pNomUsu
   * @returns {boolean}
   */
  validarNombreUsuario(pNomUsu) {
    pNomUsu = pNomUsu.toLowerCase();

    for (let i = 0; i < pNomUsu.length; i++) {
      let char = pNomUsu.charAt(i);

      let esCharEspecial = char === "." || char === "_";
      let esNumerico = !isNaN(char) && char !== " "; // Number(" ") retorna 0.
      let esLetra = char >= "a" && char <= "z";

      let esValido = esCharEspecial || esNumerico || esLetra;

      if (!esValido) {
        return false;
      }
    }

    return true;
  }

  validarContrasena(pContrasena) {
    let cumpleLargo = pContrasena.length >= 5;
    let tieneMayus = false;
    let tieneMinus = false;
    let tieneNumero = false;

    for (let i = 0; i < pContrasena.length; i++) {
      let caracterActual = pContrasena.charAt(i);

      if (!isNaN(caracterActual)) {
        tieneNumero = true;
      } else if (caracterActual === caracterActual.toUpperCase()) {
        tieneMayus = true;
      } else if (caracterActual === caracterActual.toLowerCase()) {
        tieneMinus = true;
      }
    }
    return cumpleLargo && tieneMayus && tieneMinus && tieneNumero;
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

  /**
   * Marca como "activo" al usuario dado.
   * @param {string} pNombreUsuario
   * @returns {boolean}
   */
  activarUsuario(pNombreUsuario) {
    let usuario = this.buscarUsuarioObjeto(pNombreUsuario);
    if (usuario !== null) {
      usuario.estado = "activo";
      return true;
    }

    return false;
  }

  /**
   * Marca como "bloqueado" al usuario dado.
   * @param {string} pNombreUsuario
   */
  bloquearUsuario(pNombreUsuario) {
    let usuario = this.buscarUsuarioObjeto(pNombreUsuario);
    if (usuario !== null) {
      usuario.estado = "bloqueado";
      this.liberarInstanciasAlquiladas(pNombreUsuario);
      return true;
    }

    return false;
  }

  /**
   * Remueve los alquileres efectuados del usuario dado.
   *
   * Esta función es llamada al bloquear un usuario. NO debe usarse en otro contexto.
   * @param {string} pNombreUsuario
   */
  liberarInstanciasAlquiladas(pNombreUsuario) {
    for (let i = 0; i < this.arrayAlquileres.length; i++) {
      let alquilada = this.arrayAlquileres[i];

      if (alquilada.nomUsuario === pNombreUsuario) {
        this.arrayAlquileres.splice(i, 1);
      }
    }
  }

  /**
   * Agrega una instancia del tipo dado.
   * @param {INSTANCIA_TIPO} pTipo
   */
  agregarInstancia(pTipo) {
    let instancia = new MaquinaVirtual(pTipo);
    this.arrayInstancias.push(instancia);
  }

  /**
   * Intenta agregar la cantidad de instancias indicadas para el tipo dado.
   * En caso de que la cantidad no sea un número entero válido, no se agregará ninguna instancia.
   *
   * Ejemplo: `agregarInstancias("c7small", 5)` agregará 5 instancias del tipo "c7small".
   *
   * Ejemplo: `agregarInstancias("c7small", 5.5)` NO agregará ninguna instancia.
   *
   * @param {INSTANCIA_TIPO} pTipo
   * @param {number} cantidadAgregar
   * @returns {boolean}
   */
  agregarInstancias(pTipo, cantidadAgregar) {
    if (!esNumeroEnteroValido(cantidadAgregar)) {
      return false;
    }

    for (let i = 0; i < cantidadAgregar; i++) {
      this.agregarInstancia(pTipo);
    }

    return true;
  }

  /**
   * Dada una categoría, devuelve todas las instancias que pertenecen a dicha categoría.
   * @param {INSTANCIA_CATEGORIA} categoria
   * @returns {MaquinaVirtual[]}
   */
  buscarInstanciasPorCategoria(categoria) {
    let instancias = [];

    for (let i = 0; i < this.arrayInstancias.length; i++) {
      let instancia = this.arrayInstancias[i];

      if (instancia.categoria === categoria) {
        instancias.push(instancia);
      }
    }

    return instancias;
  }

  /**
   * Consigue las máquinas disponibles en el sistema.
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
   * Intenta reducir el stock de instancias disponibles. En caso de que la cantidad no sea un número entero válido, no se reducirá el stock.
   *
   * Ejemplo: `reducirStockDisponible("c7small", 5)` removerá 5 instancias del tipo "c7small".
   *
   * Ejemplo: `reducirStockDisponible("c7small", 5.5)` NO removerá ninguna instancia.
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
   * Le asigna una instancia del tipo provisto al usuario dado en alquiler, si este está habilitado Y si hay instancias disponibles.
   * @param {INSTANCIA_TIPO} tipoInstancia
   * @param {string} nomUsuario
   * @returns {boolean}
   */
  alquilarInstancia(tipoInstancia, nomUsuario) {
    if (!this.usuarioEstaActivo(nomUsuario)) {
      return false;
    }

    let instancias = this.buscarInstanciasLibresPorTipo(tipoInstancia);

    if (instancias.length === 0) {
      return false;
    }

    let alquilada = new Alquiler(instancias[0].ID, nomUsuario);
    this.arrayAlquileres.push(alquilada);

    return true;
  }

  /**
   * Consigue todas las instancias alquiladas por el usuario dado.
   * @param {string} nomUsuario
   * @returns {MaquinaVirtual[]}
   */
  buscarInstanciasDeUsuario(nomUsuario) {
    /**
     * @type {MaquinaVirtual[]}
     */
    let arr = [];

    for (let i = 0; i < this.arrayAlquileres.length; i++) {
      let alquilada = this.arrayAlquileres[i];

      if (alquilada.nomUsuario === nomUsuario) {
        let instancia = this.buscarInstanciaPorID(alquilada.idInstancia);

        if (instancia !== null) {
          arr.push(instancia);
        }
      }
    }

    return arr;
  }

  /**
   * Busca una maquina virtual por su ID.
   * @param {number} id
   * @returns {?MaquinaVirtual}
   */
  buscarInstanciaPorID(id) {
    for (let i = 0; i < this.arrayInstancias.length; i++) {
      let instancia = this.arrayInstancias[i];

      if (instancia.ID === id) {
        return instancia;
      }
    }

    return null;
  }

  /**
   * Intenta prender una maquina virtual por su ID.
   * @param {number} id
   * @returns {boolean}
   */
  encenderInstancia(id) {
    if (!esNumeroEnteroValido(id)) {
      return false;
    }

    let instancia = this.buscarInstanciaPorID(id);

    if (instancia === null) {
      return false;
    }

    return instancia.encender();
  }

  /**
   * Intenta apagar una maquina virtual por su ID.
   * @param {number} id
   * @returns {boolean}
   */
  apagarInstancia(id) {
    if (!esNumeroEnteroValido(id)) {
      return false;
    }

    let instancia = this.buscarInstanciaPorID(id);

    if (instancia === null) {
      return false;
    }

    return instancia.apagar();
  }

  precargaDeDatos() {
    // precarga de usuarios administradores
    let admin1 = new UsuarioAdministrador("gaston", "1234La");
    let admin2 = new UsuarioAdministrador("mateo", "1234La");
    let admin3 = new UsuarioAdministrador("matt1", "1234La");
    let admin4 = new UsuarioAdministrador("lean1", "1234La");
    let admin5 = new UsuarioAdministrador("admin", "1234La");

    this.arrayUsuariosAdmin.push(admin1, admin2, admin3, admin4, admin5);

    // precarga de usuarios comunes
    this.registrarUsuario(
      "mateo",
      "carriqui",
      "matteo",
      "1234La",
      "4539-6253-0847-8250",
      "323"
    );
    this.registrarUsuario(
      "leandro",
      "guzman",
      "lean.g",
      "1234La",
      "4539-6253-0847-8250",
      "323"
    );
    this.registrarUsuario(
      "Gaston",
      "Sanguinetti",
      "g.sangui",
      "1234La",
      "4539-6253-0847-8250",
      "323"
    );
    this.registrarUsuario(
      "Mateo",
      "Sanguinetti",
      "m.sangui",
      "1234La",
      "4539-6253-0847-8250",
      "323"
    );
    this.registrarUsuario(
      "Soy",
      "Yo",
      "soy.yo",
      "1234La",
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

    for (let i = 0; i < this.arrayUsuariosComunes.length; i++) {
      this.activarUsuario(this.arrayUsuariosComunes[i].nombreUsuario);
    }

    /**
     * ALQUILARLE MAQUINAS A USUARIOS
     */
    this.alquilarInstancia(
      "c7small",
      this.arrayUsuariosComunes[0].nombreUsuario
    );

    this.alquilarInstancia(
      "r7small",
      this.arrayUsuariosComunes[0].nombreUsuario
    );

    this.alquilarInstancia(
      "c7small",
      this.arrayUsuariosComunes[1].nombreUsuario
    );
  }
}
