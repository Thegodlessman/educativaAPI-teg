import { pool } from "../db.js";
import { validationResult } from "express-validator";
import { tokenSign } from "../helpers/generateToken.js";

export const selectRole = async (req, res) => {
    const { id } = req.params;
    const { id_role } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const query = `UPDATE "user" SET id_rol = $1 WHERE id_user = $2 RETURNING *`;
        const values = [id_role, id];
        const { rowCount } = await pool.query(query, values); 
            
        // Cambia aquí para pasar el valor como un arreglo
        const { rows } = await pool.query(
            `SELECT 
                usuario.id_user, 
                CONCAT(usuario.name,' ', usuario.lastname) AS full_name, 
                usuario.password, 
                usuario.ced_user, 
                usuario.email, 
                rol.id_role,
                rol.rol_name
            FROM "user" AS usuario 
            INNER JOIN "role" AS rol 
            ON usuario.id_rol = rol.id_role 
            WHERE usuario.id_user = $1`, [id]); // Asegúrate de pasar el valor como un arreglo

        if (rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];

        const tokenSession = await tokenSign(user);

        return res.status(200).json({ message: "User role updated successfully", user: user , tokenSession});
    } catch (error) {
        console.error('Error updating user role:', error);
        return res.status(500).json({ message: "Error updating user role", error: error.message });
    }
};

export const getRoleId = async (req, res) => {
    const { rol_name } = req.params;

    console.log(rol_name)
    try {
        // Esperar el resultado de la consulta
        const { rows } = await pool.query('SELECT * FROM "role" WHERE rol_name = $1', [rol_name]);

        // Verificar si se encontraron filas
        if (rows.length === 0) {
            return res.status(404).json({ message: "Role not found" });
        }

        // Asumir que el id_role está en la primera fila del resultado
        const idRole = rows[0].id_role;

        res.json({ id_role: idRole });
    } catch (error) {
        console.error('Error getting role ID:', error);
        res.status(500).json({ message: "Error getting role ID", error: error.message });
    }
};

