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

export const getInsti = async (req, res) => {
  try {
    const { id_user } = req.body;

    if (!id_user) {
      return res.status(400).json({ success: false, message: "ID de usuario requerido" });
    }

    const { rows } = await pool.query(
      `SELECT insti.Id_insti, insti.insti_name 
        FROM "institutions" AS insti 
        INNER JOIN "users_institutions" AS ui ON insti.Id_insti = ui.Id_institution 
        INNER JOIN "users" AS usuario ON ui.id_user = usuario.id_user 
        WHERE usuario.id_user = $1`,
      [id_user]
    );

    return res.status(200).json({ success: true, insti: rows });
  } catch (error) {
    console.error("Error en getInsti:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

export const getMyClasses = async (req, res) => {
  try {
    const { id_user } = req.body;

    const { rows } = await pool.query(
      `SELECT room.id_room, room.code_room, room.secc_room, room.max_room, room.create_date, insti.insti_name 
      FROM "room" AS room 
      INNER JOIN "institutions" AS insti ON room.id_institution = insti.id_insti 
      WHERE admin_room = $1`,
      [id_user]
    );

    return res.status(200).json({ success: true, classes: rows });
  } catch (error) {
    console.error("Error fetching classes", error);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
};
