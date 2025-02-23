const { ObjectId } = require("mongodb");
const db = require("../config/db");


//editar usuario
async function editarUsuario(req, res) {
    try {
        const id = req.params.id;
        const datosActualizados = req.body;

        const result = await db.collection("usuarios").updateOne(
            { _id: new ObjectId(id) },
            { $set: datosActualizados }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ mensaje: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
}
async function actualizarUsuarioMongo() {
    const id = document.getElementById("modalUsuarioId").value;
    const nombre = document.getElementById("modalUsuarioNombre").value.trim();
    const fecha = document.getElementById("modalUsuarioFecha").value;
    const texto = document.getElementById("modalUsuarioTexto").value.trim();

    if (!id) {
        console.error("No se encontró el ID del usuario.");
        alert("Error: No se encontró el ID del usuario.");
        return;
    }

    if (!nombre || !fecha || !texto) {
        console.error("Campos vacíos detectados.");
        alert("Todos los campos son obligatorios.");
        return;
    }

    const datosActualizados = { nombre, fecha, texto };

    console.log("Enviando datos al servidor:", JSON.stringify(datosActualizados));

    try {
        const response = await fetch(`http://localhost:3000/api/mongo/usuarios/${id}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosActualizados)
        });

        const resultado = await response.json();
        console.log("Respuesta del servidor:", resultado);

        if (response.ok) {
            alert("Usuario actualizado correctamente.");
        } else {
            alert(`Error: ${resultado.error || "No se pudo actualizar el usuario."}`);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error en la actualización.");
    }
}



//elimiar usuario
async function eliminarUsuario(req, res) {
    try {
        const id = req.params.id;
        const result = await db.collection("usuarios").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
}

module.exports = { editarUsuario, eliminarUsuario };
