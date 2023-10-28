/**
 * @fileoverview Archivo que contiene funciones para realizar pruebas de la interfaz de usuario.
 * marcar como false la variable `release` para que se ejecute el codigo de este archivo.
 * descomentar / comentar lo que se quiera probar.
 */
const release = true;

function mock() {
  if (!release) {
    /**
     * ADMIN LOGIN
     */
    iniciarSesionUI("mateo", "1234"); // mateo es admin.

    /**
     * USER LOGIN
     */
    // iniciarSesionUI("matt", "1234"); // matt es usuario.

    /**
     * ALQUILARLE MAQUINAS A USUARIOS
     */
    sistema.alquilarInstancia(
      "c7small",
      sistema.arrayUsuariosComunes[0].nombreUsuario
    );
    sistema.alquilarInstancia(
      "c7small",
      sistema.arrayUsuariosComunes[1].nombreUsuario
    );
  }
}
