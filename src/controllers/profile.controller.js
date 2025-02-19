import { pool } from "../db.js";
import { validationResult } from "express-validator";
import { tokenSign } from "../helpers/generateToken.js";

export const selectRole = async (req, res) => {
    const { id } = req.params;
    const { id_rol } = req.body; // Aceptamos un ID de rol para asignar al usuario

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Verificamos si el rol ya está asignado al usuario
        const { rows: existingRoleRows } = await pool.query(
            'SELECT * FROM "roles_users" WHERE id_user = $1 AND id_rol = $2',
            [id, id_rol]
        );

        if (existingRoleRows.length > 0) {
            return res.status(400).json({ message: "Este rol ya está asignado a este usuario" });
        }

        // Insertar el nuevo rol para el usuario en la tabla intermedia "roles_users"
        const { rowCount } = await pool.query(
            'INSERT INTO "roles_users" (id_user, id_rol) VALUES ($1, $2) RETURNING *',
            [id, id_rol]
        );

        if (rowCount === 0) {
            return res.status(400).json({ message: "Error al asignar el rol al usuario" });
        }

        // Obtener el usuario con el rol actualizado
        const { rows } = await pool.query(
            `SELECT 
                usuario.id_user, 
                CONCAT(usuario.user_name,' ', usuario.user_lastname) AS full_name, 
                usuario.user_ced, 
                usuario.user_email, 
                rol.id_rol,
                rol.rol_name
            FROM "users" AS usuario 
            INNER JOIN "roles_users" AS ru 
            ON usuario.id_user = ru.id_user 
            INNER JOIN "roles" AS rol 
            ON ru.id_rol = rol.id_rol
            WHERE usuario.id_user = $1`, 
            [id]
        );

        const user = rows[0];
        const tokenSession = await tokenSign(user);

        return res.status(200).json({ 
            message: "Role assigned successfully", 
            user: user, 
            tokenSession 
        });
    } catch (error) {
        console.error('Error assigning user role:', error);
        return res.status(500).json({ message: "Error assigning user role", error: error.message });
    }
};

export const getRoleId = async (req, res) => {
    const { rol_name } = req.params;

    try {
        const { rows } = await pool.query('SELECT * FROM "roles" WHERE rol_name = $1', [rol_name]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Role not found" });
        }

        const idRole = rows[0].id_rol;

        return res.json({ id_rol: idRole });
    } catch (error) {
        console.error('Error getting role ID:', error);
        return res.status(500).json({ message: "Error getting role ID", error: error.message });
    }
};

export const deleteRoleFromUser = async (req, res) => {
    const { id } = req.params;
    const { id_rol } = req.body;

    try {
        const { rowCount } = await pool.query(
            'DELETE FROM "roles_users" WHERE id_user = $1 AND id_rol = $2 RETURNING *',
            [id, id_rol]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Role not found for this user" });
        }

        return res.status(200).json({ message: "Role removed successfully" });
    } catch (error) {
        console.error("Error removing role:", error);
        return res.status(500).json({ message: "Error removing role", error: error.message });
    }
};
