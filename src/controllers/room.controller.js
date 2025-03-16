import { pool } from "../db.js";
import { generateRoomCode } from "../helpers/generateCode.js";

export const createRoom = async (req, res) =>{
    try {
        const { secc_room, max_room, id_institution, admin_room } = req.body;
        const code_room = await generateRoomCode(); // Generar código único
    
        const createDate = new Date().toISOString().split("T")[0]; // Fecha actual
    
        const query = `
        INSERT INTO room (code_room, secc_room, max_room, id_institution, admin_room, create_date)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
    
        const values = [code_room, secc_room, max_room, id_institution, admin_room, createDate];
    
        const result = await pool.query(query, values);
        res.status(201).json({ success: true, room: result.rows[0] });
    } catch (error) {
        console.error("Error creando aula:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
}