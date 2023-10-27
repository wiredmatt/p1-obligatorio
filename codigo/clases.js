class UsuarioAdministrador {
  constructor(pNombreUsuario, pContrasena) {
    this.nombreUsuario = pNombreUsuario;
    this.contrasena = pContrasena;
  }
}

class UsuarioComun {
  static contadorID = 1;

  constructor(pNombre, pApellido, pNomUsu, pContrasena, pNroTjt, pCvcTjt) {
    this.ID = UsuarioComun.contadorID;
    this.nombre = pNombre;
    this.apellido = pApellido;
    this.nombreUsuario = pNomUsu;
    this.contrasena = pContrasena;
    this.nroTarjeta = pNroTjt;
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
   * @param {("c7.small" | "c7.medium" | "c7.large" | "r7.small" | "r7.medium" | "r7.large" | "i7.medium" | "i7.large")} pTipo
   */
  constructor(pTipo) {
    this.id = MaquinaVirtual.contadorID;
    this.tipo = pTipo;

    switch (pCategoria[0]) {
      case "c":
        this.categoria = "Optimizadas para computo";
        break;
      case "r":
        this.categoria = "Optimizadas para memoria";
        break;
      case "i":
        this.categoria = "Optimizadas para almacenamiento";
        break;
    }

    switch (pTipo) {
      case "c7.small":
        this.costoAlquiler = 20;
        this.costoEncendido = 2.5;
        break;
      case "c7.medium":
        this.costoAlquiler = 30;
        this.costoEncendido = 3.5;
        break;
      case "c7.large":
        this.costoAlquiler = 50;
        this.costoEncendido = 6.0;
        break;
      case "r7.small":
        this.costoAlquiler = 35;
        this.costoEncendido = 4.0;
        break;
      case "r7.medium":
        this.costoAlquiler = 50;
        this.costoEncendido = 6.5;
        break;
      case "r7.large":
        this.costoAlquiler = 60;
        this.costoEncendido = 7.0;
        break;
      case "i7.medium":
        this.costoAlquiler = 30;
        this.costoEncendido = 3.5;
        break;
      case "i7.large":
        this.costoAlquiler = 50;
        this.costoEncendido = 6.5;
        break;
    }

    /**
     * @type {("apagada" | "encendida")}
     */
    this.estado = "apagada";
    this.contadorEncendido = 0;
    this.costoAcumulado = 0;

    MaquinaVirtual.contadorID++;
  }

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
