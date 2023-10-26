class Pelicula {
    constructor(pId, pNombre, pAnio, pGenero, pNumeroVotantes, pTotalPuntos) {
        this.id = pId;
        this.nombre = pNombre;
        this.anio = pAnio;
        this.genero = pGenero;
        this.numeroVotanes = pNumeroVotantes;
        this.totalPuntos = pTotalPuntos;
    }
}

class UsuarioAdministrador {
    constructor(pNombreUsuario, pContrasena) {
        this.nombreUsuario = pNombreUsuario;
        this.contrasena = pContrasena;
    }
}

class UsuarioComun {
    static contadorID = 1;

    constructor(pNombre, pApellido, pNomUsu, pContrasena, pNroTjt, pCvcTjt, pEstadoUsuario) {
        this.ID = UsuarioComun.contadorID;
        this.nombre = pNombre;
        this.apellido = pApellido;
        this.nombreUsuario = pNomUsu;
        this.contrasena = pContrasena;
        this.nroTarjeta = pNroTjt;
        this.cvcTarjeta = pCvcTjt;
        this.estado = pEstadoUsuario;
        UsuarioComun.contadorID++;
    }
}