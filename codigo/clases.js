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

class TipoInstancia {
  /**
   * @param {string} pTipo nuevo tipo a crear @example "c7small"
   * @param {number} pCostoAlquiler costo que se cobra cada vez que un usuario presiona `Alquilar`
   * @param {number} pCostoEncendido costo que se cobra cada vez que un usuario presiona `Encender`, no se cobra la primera
   * @param {string} pCategoria una categoría previamente cargada a `sistema.categorias` @example "Optimizadas para computo"
   */
  constructor(pTipo, pCostoAlquiler, pCostoEncendido, pCategoria) {
    /**
     * el nombre del tipo @example c7small
     * @type {string}
     */
    this.tipo = pTipo;
    /**
     * @type {number}
     */
    this.costoAlquiler = pCostoAlquiler;
    /**
     * @type {number}
     */
    this.costoEncendido = pCostoEncendido;

    /**
     * @type {string}
     */
    this.categoria = pCategoria;
  }

  /**
   * costoAlquiler + (cantidadEncendidos -1) * costoEncendido
   * @param {number} cantidadEncendidos
   * @returns {number}
   */
  calcularCostos(cantidadEncendidos) {
    return this.costoAlquiler + (cantidadEncendidos - 1) * this.costoEncendido;
  }
}

class MaquinaVirtual {
  static contadorID = 1;

  /**
   * @param {TipoInstancia} pTipo
   */
  constructor(pTipo) {
    /**
     * objeto TipoInstancia - Preset de Informacion sobre un tipo X
     * @type {TipoInstancia}
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

    /**
     * Para efectuar soft deletes en lugar de borrados permanentes
     * @type {boolean}
     */
    this.habilitada = true;

    MaquinaVirtual.contadorID++;

    this.tipo.categoria

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

  /**
   * baja lógica para evitar borrados permanentes.
   */
  deshabilitar() {
    this.habilitada = false;
  }
}

/**
 * Un `Alquiler` se da entre un `UsuarioComun` y una `MaquinaVirtual`.
 * @see {@link UsuarioComun}
 * @see {@link MaquinaVirtual}
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
     * Cuantas veces el usuario encendió esta instancia durante su alquiler.
     * @type {number}
     */
    this.contadorEncendido = 0; // al alquilar una instancia esta se enciende automáticamente, no se el cobra primer encendido.

    /**
     * Determina si este alquiler está activo o no.
     *
     * Cuando se bloquea a un usuario, sus instancias alquiladas vuelven a estar disponibles para alquilar por otros usuarios. Pero no queremos borrar el alquiler del arreglo de alquileres, porque queremos mantener un registro de todos los alquileres que se hicieron. Y así poder determinar apropiadamente los ingresos finales del sistema. Usamos una baja lógica para lograr el efecto deseado.
     * @type {boolean}
     */
    this.activo = true;
  }

  desactivar() {
    this.activo = false;
  }
}
