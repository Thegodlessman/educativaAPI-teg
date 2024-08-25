import { pool } from "../db.js";
import { check, validationResult } from "express-validator";

export const selectRole = async (req, res) => {
    const { id } = req.params;
    const { id_role } = req.body;

    await check('id_role').isInt().withMessage('Role ID must be a valid integer').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const query = 'UPDATE "user" SET id_role = $1 WHERE id_user = $2 RETURNING *';
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
