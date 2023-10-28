/**
 * @typedef {("c7small" | "c7medium" | "c7large" | "r7small" | "r7medium" | "r7large" | "i7medium" | "i7large")} INSTANCIA_TIPO
 * @typedef {("small" | "medium" | "large" } INSTANCIA_TAMANIO
 *
 * @typedef {("Optimizadas para computo" | "Optimizadas para memoria" | "Optimizadas para almacenamiento")} INSTANCIA_CATEGORIA
 */

class UsuarioAdministrador {
  /**
   * @param {string} pNombreUsuario
   * @param {string} pContrasena
   */
  constructor(pNombreUsuario, pContrasena) {
    /**
     * @type {string}
     */
    this.nombreUsuario = pNombreUsuario;
    /**
     * @type {string}
     */
    this.contrasena = pContrasena;
  }
}

class UsuarioComun {
  static contadorID = 1;

  /**
   * @param {string} pNombre
   * @param {string} pApellido
   * @param {string} pNomUsu
   * @param {string} pContrasena
   * @param {string} pNroTjt
   * @param {number} pCvcTjt
   */
  constructor(pNombre, pApellido, pNomUsu, pContrasena, pNroTjt, pCvcTjt) {
    /**
     * @type {number}
     */
    this.ID = UsuarioComun.contadorID;
    /**
     * @type {string}
     */
    this.nombre = pNombre;
    /**
     * @type {string}
     */
    this.apellido = pApellido;
    /**
     * @type {string}
     */
    this.nombreUsuario = pNomUsu;
    /**
     * @type {string}
     */
    this.contrasena = pContrasena;
    /**
     * @type {string}
     */
    this.nroTarjeta = pNroTjt;
    /**
     * @type {string}
     */
    this.cvcTarjeta = pCvcTjt;

    /**
     * @type {("pendiente" | "activo" | "bloqueado")}
     */
    this.estado = "pendiente";

    UsuarioComun.contadorID++;
  }
}

class MaquinaVirtual {
  static contadorID = 1;

  /**
   * @param {INSTANCIA_TIPO} tipo
   * @returns {INSTANCIA_CATEGORIA}
   */
  static tipoACategoria(tipo) {
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
  static tipoACostoAlquiler(tipo) {
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
  static tipoACostoEncendido(tipo) {
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

  /**
   * @param {INSTANCIA_TIPO} pTipo
   */
  constructor(pTipo) {
    /**
     * @type {INSTANCIA_TIPO}
     */
    this.tipo = pTipo;

    /**
     * @type {number}
     */
    this.ID = MaquinaVirtual.contadorID;

    /**
     * @type {INSTANCIA_CATEGORIA}
     */
    this.categoria = MaquinaVirtual.tipoACategoria(pTipo);

    /**
     * @type {number}
     */
    this.costoAlquiler = MaquinaVirtual.tipoACostoAlquiler(pTipo);

    /**
     * @type {number}
     */
    this.costoEncendido = MaquinaVirtual.tipoACostoEncendido(pTipo);

    /**
     * @type {("apagada" | "encendida")}
     */
    this.estado = "apagada";
    this.contadorEncendido = 0;
    this.costoAcumulado = 0;

    MaquinaVirtual.contadorID++;
  }

  /**
   * @returns {boolean} false si la maquina ya estaba prendida, true si estaba apagada.
   */
  encender() {
    if (this.estado !== "apagada") {
      return false;
    }

    this.estado = "encendida";
    this.contadorEncendido = this.contadorEncendido + 1;
    this.recalcularCostoAcumulado();

    return true;
  }

  apagar() {
    this.estado = "apagada";
  }

  /**
   * @private - metodo interno, no hay necesidad de llamarlo desde otro lugar.
   */
  recalcularCostoAcumulado() {
    this.costoAcumulado =
      this.costoAlquiler + (this.costoEncendido - 1) * this.costoEncendido;
  }
}

class InstanciaAlquilada {
  /**
   * @param {number} instancia
   * @param {number} usuario
   */
  constructor(idInstancia, idUsuario) {
    /**
     * @type {number}
     */
    this.idInstancia = idInstancia;

    /**
     * @type {number}
     */
    this.idUsuario = idUsuario;
  }
}
