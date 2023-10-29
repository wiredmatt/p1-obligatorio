/**
 * @typedef {("c7small" | "c7medium" | "c7large" | "r7small" | "r7medium" | "r7large" | "i7medium" | "i7large")} INSTANCIA_TIPO
 * @typedef {("small" | "medium" | "large")} INSTANCIA_TAMANIO
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
    this.categoria = tipoACategoria(pTipo);

    /**
     * @type {number}
     */
    this.costoAlquiler = tipoACostoAlquiler(pTipo);

    /**
     * @type {number}
     */
    this.costoEncendido = tipoACostoEncendido(pTipo);

    /**
     * @type {("APAGADA" | "ENCENDIDA")}
     */
    this.estado = "APAGADA";

    /**
     * @type {number}
     */
    this.contadorEncendido = 0;

    /**
     * @type {number}
     */
    this.costoAcumulado = 0;

    MaquinaVirtual.contadorID++;
  }

  /**
   * @returns {boolean} `false` si la maquina ya estaba prendida, `true` si estaba APAGADA.
   */
  encender() {
    if (this.estado !== "APAGADA") {
      return false;
    }

    this.estado = "ENCENDIDA";
    this.contadorEncendido = this.contadorEncendido + 1;
    this.recalcularCostoAcumulado();

    return true;
  }

  /**
   * Apaga la maquina virtual.
   */
  apagar() {
    this.estado = "APAGADA";
  }

  /**
   * @private - metodo interno, no hay necesidad de llamarlo desde otro lugar.
   */
  recalcularCostoAcumulado() {
    this.costoAcumulado =
      this.costoAlquiler + (this.contadorEncendido - 1) * this.costoEncendido;
  }
}

/**
 * Un `Alquiler` se da entre un `UsuarioComun` y una `MaquinaVirtual`.
 */
class Alquiler {
  /**
   * @param {number} instancia
   * @param {string} nomUsuario
   */
  constructor(idInstancia, nomUsuario) {
    /**
     * @type {number}
     */
    this.idInstancia = idInstancia;

    /**
     * @type {string}
     */
    this.nomUsuario = nomUsuario;
  }
}
