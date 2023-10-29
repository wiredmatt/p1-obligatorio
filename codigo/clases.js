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
     * @type {("APAGADA" | "ENCENDIDA")}
     */
    this.estado = "APAGADA";

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
    return true;
  }

  /**
   * Apaga la maquina virtual.
   */
  apagar() {
    this.estado = "APAGADA";
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

    /**
     * Cuantas veces el usuario encendio esta instancia durante su alquiler.
     * @type {number}
     */
    this.contadorEncendido = 0; // al alquilar una instancia esta se enciende automaticamente, no se cobra primer encendido.

    /**
     * @type {boolean}
     * Determina si este alquiler está activo o no.
     *
     * Cuando se bloquea a un usuario, sus instancias alquiladas vuelven a estar disponibles para alquilar por otros usuarios. Pero no queremos borrar el alquiler del arreglo de alquileres, porque queremos mantener un registro de todos los alquileres que se hicieron. Y así poder determinar apropiadamente los ingresos finales del sistema. Usamos una baja lógica para lograr el efecto deseado.
     */
    this.activo = true;
  }

  desactivar() {
    this.activo = false;
  }
}
