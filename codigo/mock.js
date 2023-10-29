/**
 * @fileoverview Archivo que contiene funciones para realizar pruebas de la interfaz de usuario.
 * marcar como false la variable `release` para que se ejecute el codigo de este archivo.
 * descomentar / comentar lo que se quiera probar.
 */
const release = true;

function tryMock() {
  if (!release) {
    /**
     * ADMIN LOGIN
     */
    // iniciarSesionUI("mateo", "1234La"); // mateo es admin.
    // verListadoDeInstanciasAdmin();

    /**
     * USER LOGIN
     */
    iniciarSesionUI("matteo", "1234La"); // matteo es usuario.
    verOpcionesAlquilerUsuario();
  }
}
