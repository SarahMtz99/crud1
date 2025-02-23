document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 DOM completamente cargado. Eventos asignándose...");

    // MODALES
    const editModal = document.getElementById("editModal");
    const confirmModal = document.getElementById("confirmModal");

    // BOTONES EN MODALES
    const btnGuardarEdicion = document.getElementById("btnGuardarEdicion");
    const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");

    const btnConfirmarEdicion = document.getElementById("btnConfirmarEdicion");
    const btnCancelarConfirmacion = document.getElementById("btnCancelarConfirmacion");

    // EVENTO PARA ABRIR MODAL DE EDICIÓN (EVENT DELEGATION)
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("btnEditar")) {
            console.log("✅ Botón Editar clicado");
            editModal.classList.remove("hidden"); // Mostrar modal de edición
        }
    });
    app.use(express.static("js"));

    // CERRAR MODAL DE EDICIÓN
    btnCancelarEdicion.addEventListener("click", function () {
        console.log("❌ Cancelando edición...");
        editModal.classList.add("hidden");
    });

    // ABRIR MODAL DE CONFIRMACIÓN
    btnGuardarEdicion.addEventListener("click", function () {
        console.log("⚠️ Mostrando confirmación...");
        confirmModal.classList.remove("hidden");
    });

    // CANCELAR CONFIRMACIÓN
    btnCancelarConfirmacion.addEventListener("click", function () {
        console.log("❌ Cancelando confirmación...");
        confirmModal.classList.add("hidden");
    });

    // CONFIRMAR EDICIÓN
    btnConfirmarEdicion.addEventListener("click", function () {
        console.log("✅ Actualización confirmada.");
        alert("¡Datos actualizados correctamente!");
        confirmModal.classList.add("hidden");
        editModal.classList.add("hidden");
    });

    console.log("✅ Eventos asignados correctamente.");
});
