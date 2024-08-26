import { pool } from "../db.js";
import { check, validationResult } from "express-validator";

export const selectRole = async (req, res) => {
    const { id } = req.params;
    const { id_role } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log(id + ('        ') +  id_role)
        const query = `UPDATE "user" SET id_rol = $1 WHERE id_user = $2 RETURNING *`;
        const values = [id_role, id];
        const { rowCount, rows } = await pool.query(query, values);

        if (rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User role updated successfully", user: rows[0] });
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

