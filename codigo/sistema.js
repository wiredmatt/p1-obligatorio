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
       * @type {TipoInstancia[]}
       */
      this.arrayTiposInstancia = [];
      /**
       * @type {MaquinaVirtual[]}
       */
      this.arrayInstancias = [];
      /**
       * @type {Alquiler[]}
       */
      this.arrayAlquileres = [];
  
      /**
       * @type {string[]} Categorias de instancias.
       */
      this.categorias = [
        "Optimizadas para computo",
        "Optimizadas para memoria",
        "Optimizadas para almacenamiento",
      ];
  
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
     * @returns {boolean}
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
     * Crea un usuario común con los datos provistos. Pendiente de aprobación.
     *
     * En caso de que ya exista un usuario o admin con el mismo nombre de usuario, false.
     *
     * En caso de que no validen los datos proporcionados, false
     *
     * En caso de que esté todo bien, true
     *
     * @param {string} pNombre
     * @param {string} pApellido
     * @param {string} pNomUsu
     * @param {string} pContrasena
     * @param {number} pNroTjt
     * @param {number} pCvcTjt
     * @returns {boolean}
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
        return false;
      }
  
      pNomUsu = pNomUsu.toLowerCase(); // para que sea case insensitive
  
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
        return true;
      }
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
  
    /**
     * Debe tener al menos 5 caracteres, al menos una mayúscula, al menos una minúscula y al menos un número.
     * @param {string} pContrasena
     * @returns {boolean}
     */
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
  
    /**
     * Dado un nombre de usuario buscará al usuario entre los usuarios comunes.
     * @param {string} pNombreUsuario
     * @returns {?UsuarioComun}
     */
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
  
    /**
     * Dado un nombre de usuario buscará al usuario entre los administradores.
     * @param {string} pNombreUsuario
     * @returns {?UsuarioAdministrador}
     */
    buscarAdminObjeto(pNombreUsuario) {
      let i = 0;
  
      while (i < this.arrayUsuariosAdmin.length) {
        let unAdmin = this.arrayUsuariosAdmin[i];
        if (unAdmin.nombreUsuario === pNombreUsuario) {
          return unAdmin;
        }
        i++;
      }
  
      return null;
    }
  
    /**
     * Valida una tarjeta de crédito usando el algorítmo de luhn.
     *
     * La tarjeta debe cumplir el formato xxxx-xxxx-xxxx-xxxx.
     *
     * De forma tal que cada x es un número, y estos sean 16 en total.
     *
     * Esta función prepara el string a usar en la función `validarLuhn` removiendo los guiones.
     *
     * @param {string} pNumeroTarjeta
     * @returns {boolean}
     */
    validarTarjeta(pNumeroTarjeta) {
      if (pNumeroTarjeta.length !== 19) {
        return false;
      }
  
      if (
        pNumeroTarjeta.charAt(4) !== "-" ||
        pNumeroTarjeta.charAt(9) !== "-" ||
        pNumeroTarjeta.charAt(14) !== "-"
      ) {
        return false;
      }
  
      //aca vamos a tener eventualmente solo los numeros de la tarjeta sin los guiones
      let tarjetaFormateada = this.sacarGuiones(pNumeroTarjeta);
  
      if (tarjetaFormateada.length !== 16) {
        return false;
      }
  
      if (isNaN(tarjetaFormateada)) {
        return false;
      }
  
      if (!this.validarLuhn(tarjetaFormateada)) {
        return false;
      }
  
      return true;
    }
  
    /**
     * Recibe una tarjeta ya formateada y validada para comprobar si es válida usando el algorítmo de luhn.
     * @param {string} pNumeroTjtFormateado
     * @returns {boolean}
     */
    validarLuhn(pNumeroTjtFormateado) {
      let suma = 0;
      let duplicar = true;
      for (let i = pNumeroTjtFormateado.length - 2; i >= 0; i--) {
        let numeroActual = Number(pNumeroTjtFormateado.charAt(i));
        if (duplicar) {
          let duplicado = numeroActual * 2;
          if (duplicado > 9) {
            duplicado = duplicado - 9;
          }
          suma += duplicado;
        } else {
          suma += numeroActual;
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
     * @private
     */
    liberarInstanciasAlquiladas(pNombreUsuario) {
      for (let i = 0; i < this.arrayAlquileres.length; i++) {
        let alquiler = this.arrayAlquileres[i];
  
        if (alquiler.nomUsuario === pNombreUsuario) {
          alquiler.desactivar();
  
          let instancia = this.buscarInstanciaPorID(alquiler.idInstancia);
          instancia.apagar();
        }
      }
    }
  
    /**
     * Agrega una instancia del tipo dado.
     * @param {TipoInstancia} pTipo
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
     * @param {string} pTipo
     * @param {number} cantidadAgregar
     * @returns {boolean}
     */
    agregarInstancias(pTipo, cantidadAgregar) {
      if (
        !esNumeroEnteroValido(cantidadAgregar) &&
        !esUnNumeroRazonable(cantidadAgregar)
      ) {
        return false;
      }
  
      let tipoI = this.buscarTipo(pTipo);
  
      if (!tipoI) {
        return false;
      }
  
      for (let i = 0; i < cantidadAgregar; i++) {
        this.agregarInstancia(tipoI);
      }
  
      return true;
    }
  
    /**
     * Dada una categoría, devuelve todas las instancias que pertenecen a dicha categoría.
     * @param {string} categoria
     * @returns {MaquinaVirtual[]}
     */
    buscarInstanciasPorCategoria(categoria) {
      let instancias = [];
  
      for (let i = 0; i < this.arrayInstancias.length; i++) {
        let instancia = this.arrayInstancias[i];
        if (!instancia.habilitada) continue;
  
        if (instancia.tipo.categoria === categoria) {
          instancias.push(instancia);
        }
      }
  
      return instancias;
    }
  
    /**
     * Consigue las máquinas disponibles en el sistema dado un tipo.
     * @param {string} tipo
     * @returns {MaquinaVirtual[]}
     */
    buscarInstanciasLibresPorTipo(tipo) {
      let libres = [];
  
      for (let i = 0; i < this.arrayInstancias.length; i++) {
        let instancia = this.arrayInstancias[i];
  
        if (
          instancia.tipo.tipo === tipo &&
          instancia.habilitada &&
          this.maquinaEstaLibre(instancia.ID)
        ) {
          libres.push(instancia);
        }
      }
  
      return libres;
    }
  
    /**
     * Buscará por el criterio proporcionado, en `this.arrayInstancias`, o en `arrInstancias` de ser provisto.
     *
     * @param {string} tipo - nombre del tipo @example "c7small"
     * @param {?MaquinaVirtual[]} arrInstancias Si no es provisto, usará this.arrayInstancias.
     *
     * @returns {MaquinaVirtual[]}
     */
    buscarInstanciasPorTipo(tipo, arrInstancias = null) {
      arrInstancias = arrInstancias || this.arrayInstancias;
      let instancias = [];
  
      for (let i = 0; i < arrInstancias.length; i++) {
        let instancia = arrInstancias[i];
  
        if (instancia.tipo.tipo === tipo && instancia.habilitada) {
          instancias.push(instancia);
        }
      }
  
      return instancias;
    }
  
    /**
     * Intenta reducir el stock de instancias disponibles con una baja lógica ( @see {MaquinaVirtual.deshabilitar()}).
     * En caso de que la cantidad no sea un número entero válido, no se reducirá el stock.
     *
     * Ejemplo: `reducirStockDisponible("c7small", 5)` removerá 5 instancias del tipo "c7small".
     *
     * Ejemplo: `reducirStockDisponible("c7small", 5.5)` NO removerá ninguna instancia.
     * @param {string} tipo
     * @param {number} cantidadAReducir Cantidad de instancias a sacar de las `libres`.
     * @returns {boolean} `false` si no se pudo, `true` si se pudo.
     */
    reducirStockDisponible(tipo, cantidadAReducir) {
      if (!esNumeroEnteroValido(cantidadAReducir)) {
        return false;
      }
  
      let libres = this.buscarInstanciasLibresPorTipo(tipo);
  
      if (libres.length < cantidadAReducir) {
        return false;
      }
  
      const instanciasAEliminar = libres.splice(0, cantidadAReducir);
  
      // buscar el indice de esta instancia en el arreglo original
      for (let i = 0; i < instanciasAEliminar.length; i++) {
        const instanciaLibre = instanciasAEliminar[i];
  
        for (let j = 0; j < this.arrayInstancias.length; j++) {
          const instancia = this.arrayInstancias[j];
  
          if (instanciaLibre.ID === instancia.ID) {
            instancia.apagar(); // asegurarnos de que quede apagada.
            // this.arrayInstancias.splice(j, 1); // borrado permanente
            instancia.deshabilitar(); // soft delete
          }
        }
      }
  
      return true;
    }
  
    /**
     * Recorre this.arrayAlquileres, si encuentra una maquina con la ID proporcionada, significará que está alquilada actualmente.
     * @param {number} id
     * @returns {boolean}
     */
    maquinaEstaLibre(id) {
      for (let i = 0; i < this.arrayAlquileres.length; i++) {
        let alquiler = this.arrayAlquileres[i];
  
        if (alquiler.idInstancia === id && alquiler.activo) {
          return false;
        }
      }
  
      return true;
    }
  
    /**
     * Le asigna una instancia del tipo provisto al usuario dado en alquiler, si este está habilitado Y si hay instancias disponibles.
     * @param {string} tipoInstancia
     * @param {string} nomUsuario
     * @returns {boolean}
     */
    alquilarInstancia(tipoInstancia, nomUsuario) {
      if (!this.usuarioEstaActivo(nomUsuario)) {
        return false;
      }
  
      let instancias = this.buscarInstanciasLibresPorTipo(tipoInstancia);
  
      if (!arrayTieneElementos(instancias)) {
        return false;
      }
  
      let alquiler = new Alquiler(instancias[0].ID, nomUsuario);
      this.arrayAlquileres.push(alquiler);
      this.encenderInstancia(instancias[0].ID); // al alquilar una instancia esta se enciende automaticamente, no se cobra primer encendido.
  
      return true;
    }
  
    /**
     * Busca un alquiler por estado, id de instancia y nombre de usuario.
     *
     * Ejemplo: sistema.buscarAlquiler(true, 1, "mateo") buscará un alquiler activo de la instancia 1, alquilada por el usuario "mateo".
     * @param {boolean} activo
     * @param {number} idInstancia
     * @param {string} nomUsuario
     * @returns
     */
    buscarAlquiler(activo, idInstancia, nomUsuario) {
      for (let i = 0; i < this.arrayAlquileres.length; i++) {
        let alquiler = this.arrayAlquileres[i];
  
        if (alquiler.idInstancia === idInstancia && alquiler.activo === activo) {
          if (!nomUsuario || alquiler.nomUsuario === nomUsuario) {
            return alquiler;
          }
        }
      }
  
      return null;
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
        let alquiler = this.arrayAlquileres[i];
  
        if (alquiler.nomUsuario === nomUsuario) {
          let instancia = this.buscarInstanciaPorID(alquiler.idInstancia);
  
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
      let alquiler = this.buscarAlquiler(true, id); // debe haber un alquiler activo para encender la maquina.
  
      if (instancia === null || alquiler === null) {
        return false;
      }
  
      let encenderOk = instancia.encender();
      if (!encenderOk) {
        return false;
      }
  
      alquiler.contadorEncendido++;
      return true;
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
  
    /**
     * Recaba información de todos los alquileres realizados y devuelve los ingresos totales para instancias de un tipo dado.
     * @param {string} tipo
     * @returns {number}
     */
    ingresosPorTipoDeInstancia(tipo) {
      let ingresos = 0;
  
      for (let i = 0; i < this.arrayAlquileres.length; i++) {
        let alquiler = this.arrayAlquileres[i];
  
        let instancia = this.buscarInstanciaPorID(alquiler.idInstancia);
  
        if (instancia.tipo.tipo === tipo) {
          ingresos +=
            instancia.tipo.costoAlquiler +
            (alquiler.contadorEncendido - 1) * instancia.tipo.costoEncendido;
        }
      }
  
      return ingresos;
    }
  
    /**
     * @param {string} pTipo
     * @returns {?TipoInstancia}
     */
    buscarTipo(pTipo) {
      for (let i = 0; i < this.arrayTiposInstancia.length; i++) {
        let tipoI = this.arrayTiposInstancia[i];
  
        if (tipoI.tipo === pTipo) {
          return tipoI;
        }
      }
  
      return null;
    }
  
    /**
     * @param {string} categoria
     * @returns {string[]}
     */
    buscarTiposDeCategoria(categoria) {
      let tipos = [];
  
      for (let i = 0; i < this.arrayTiposInstancia.length; i++) {
        let tipoI = this.arrayTiposInstancia[i];
  
        if (tipoI.categoria === categoria) {
          tipos.push(tipoI.tipo);
        }
      }
  
      return tipos;
    }
  
    /**
     * @param {string} tipo
     * @returns {number}
     */
    cantidadAlquileresPorTipo(tipo) {
      let cantidad = 0;
  
      for (let i = 0; i < this.arrayAlquileres.length; i++) {
        let alquiler = this.arrayAlquileres[i];
  
        let instancia = this.buscarInstanciaPorID(alquiler.idInstancia);
  
        if (instancia.tipo.tipo === tipo) {
          cantidad++;
        }
      }
  
      return cantidad;
    }
  
    /**
     * @param {string} pCategoria
     * @returns {boolean}
     */
    esCategoriaValida(pCategoria) {
      for (let i = 0; i < this.categorias.length; i++) {
        if (this.categorias[i] === pCategoria) {
          return true;
        }
      }
  
      return false;
    }
  
    /**
     * Agrega un nuevo TipoInstancia a this.arrayTiposInstancia.
     * @param {string} pTipo el tipo a agregar
     * @param {number} pCostoAlquiler costo a cobrar al clickear en "Alquilar"
     * @param {number} pCostoEncendido costo al hacer click en "Encender"
     * @param {string} pCategoria categoria a la que corresponde este tipo.
     */
    agregarTipoInstancia(pTipo, pCostoAlquiler, pCostoEncendido, pCategoria) {
      if (
        !hayCaracteres(pTipo) ||
        isNaN(pCostoAlquiler) ||
        isNaN(pCostoEncendido) ||
        !this.esCategoriaValida(pCategoria)
      ) {
        console.log("datos para agregar tipo de instancia invalidos");
        return false;
      }
  
      let tipoI = new TipoInstancia(
        pTipo,
        pCostoAlquiler,
        pCostoEncendido,
        pCategoria
      );
  
      this.arrayTiposInstancia.push(tipoI);
    }
  
    precargaDeDatos() {
      // precarga de usuarios administradores - 5
      let admin1 = new UsuarioAdministrador("gaston", "1234La");
      let admin2 = new UsuarioAdministrador("mateo", "1234La");
      let admin3 = new UsuarioAdministrador("matt1", "1234La");
      let admin4 = new UsuarioAdministrador("lean1", "1234La");
      let admin5 = new UsuarioAdministrador("admin", "1234La");
      this.arrayUsuariosAdmin.push(admin1, admin2, admin3, admin4, admin5);
  
      // precarga de usuarios comunes - 5
      this.registrarUsuario(
        "m",
        "c",
        "matteo",
        "1234La",
        "4539-6253-0847-8250",
        "323"
      );
      this.registrarUsuario(
        "l",
        "g",
        "lean.g",
        "1234La",
        "4539-6253-0847-8250",
        "323"
      );
      this.registrarUsuario(
        "G",
        "S",
        "g.s",
        "1234La",
        "4539-6253-0847-8250",
        "323"
      );
      this.registrarUsuario(
        "M",
        "S",
        "m.s",
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
      for (let i = 0; i < this.arrayUsuariosComunes.length; i++) {
        this.activarUsuario(this.arrayUsuariosComunes[i].nombreUsuario);
      }
  
      // precarga de tipos de instancia
      this.agregarTipoInstancia("c7small", 20, 2.5, "Optimizadas para computo");
      this.agregarTipoInstancia("c7medium", 30, 3.5, "Optimizadas para computo");
      this.agregarTipoInstancia("c7large", 50, 6.0, "Optimizadas para computo");
      this.agregarTipoInstancia("r7small", 35, 4.0, "Optimizadas para memoria");
      this.agregarTipoInstancia("r7medium", 50, 6.5, "Optimizadas para memoria");
      this.agregarTipoInstancia("r7large", 60, 7.0, "Optimizadas para memoria");
      this.agregarTipoInstancia(
        "i7medium",
        30,
        3.5,
        "Optimizadas para almacenamiento"
      );
      this.agregarTipoInstancia(
        "i7large",
        50,
        6.5,
        "Optimizadas para almacenamiento"
      );
  
      // precarga de stock por tipo de instancia
      this.agregarInstancias("c7small", 3);
      this.agregarInstancias("c7medium", 5);
      this.agregarInstancias("c7large", 3);
      this.agregarInstancias("r7small", 7);
      this.agregarInstancias("r7medium", 5);
      this.agregarInstancias("r7large", 2);
      this.agregarInstancias("i7medium", 3);
      this.agregarInstancias("i7large", 3);
      /**
       * ALQUILARLE MAQUINAS A USUARIOS - 10 Alquileres.
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
      this.alquilarInstancia(
        "c7medium",
        this.arrayUsuariosComunes[1].nombreUsuario
      );
      this.alquilarInstancia(
        "c7large",
        this.arrayUsuariosComunes[2].nombreUsuario
      );
      this.alquilarInstancia(
        "r7small",
        this.arrayUsuariosComunes[2].nombreUsuario
      );
      this.alquilarInstancia(
        "r7medium",
        this.arrayUsuariosComunes[3].nombreUsuario
      );
      this.alquilarInstancia(
        "r7medium",
        this.arrayUsuariosComunes[3].nombreUsuario
      );
      this.alquilarInstancia(
        "i7medium",
        this.arrayUsuariosComunes[4].nombreUsuario
      );
      this.alquilarInstancia(
        "i7medium",
        this.arrayUsuariosComunes[4].nombreUsuario
      );
    }
  }
  