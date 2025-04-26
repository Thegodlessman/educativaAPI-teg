import { pool } from "../db.js";
import { validationResult } from "express-validator";
import { tokenSign } from "../helpers/generateToken.js";

export const selectRole = async (req, res) => {
  const { id } = req.params;
  const { id_rol } = req.body;

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
                usuario.user_url,
                CONCAT(usuario.user_name,' ',usuario.user_lastname) AS full_name, 
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

export const getInstiByParish = async (req, res) => {
  const {id_parish} = req.params 
  try {
    const { rows } = await pool.query(`
        SELECT id_insti, insti_name FROM "institutions" WHERE id_location = $1 ORDER BY insti_name`,[id_parish]
    )
    return res.status(200).json({
      institutions: rows
    })
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ message: "Error", error: error.message });
  }
}

export const getCountries = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM countries ORDER BY country_name');
    return res.status(200).json({ countries: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener países' });
  }
}

export const getStatesByCountry = async (req, res) => {
  const { id_country } = req.params;
  try {
    const {rows} = await pool.query(
      'SELECT * FROM states WHERE id_country = $1 ORDER BY state_name',
      [id_country]
    );
    return res.json({ states: rows });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Error al obtener estados' });
  }
};

export const getMunicipalitiesByState = async (req, res) => {
  const { id_state } = req.params;
  try {
    const {rows} = await pool.query(
      'SELECT id_municipality, municipality_name FROM municipalities WHERE id_state = $1 ORDER BY municipality_name',
      [id_state]
    );
    return res.json({ mun: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener municipios' });
  }
};

export const getParishesByMunicipality = async (req, res) => {
  const { id_mun } = req.params;
  try {
    const {rows} = await pool.query(
      'SELECT id_parish, parish_name FROM parishes WHERE id_municipality = $1 ORDER BY parish_name',
      [id_mun]
    );
    return res.json({ parishes: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener parroquias' });
  }
};

export const setupUserProfile = async (req, res) => {
  const { id } = req.params;
  const { institution, photoUrl } = req.body;

  try {
    // Validar que el usuario existe
    const { rows: userRows } = await pool.query(
      'SELECT id_user FROM "users" WHERE id_user = $1',
      [id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validar que la institución existe
    const { rows: instiRows } = await pool.query(
      'SELECT id_insti FROM "institutions" WHERE id_insti = $1',
      [institution]
    );

    if (instiRows.length === 0) {
      return res.status(404).json({ message: "Institución no encontrada" });
    }

    // Verificar si ya existe la relación usuario-institución
    const { rows: relationRows } = await pool.query(
      'SELECT * FROM "users_institutions" WHERE id_user = $1 AND id_institution = $2',
      [id, institution]
    );

    if (relationRows.length > 0) {
      return res.status(400).json({ message: "Este usuario ya está registrado en esta institución" });
    }

    // Insertar en tabla intermedia
    await pool.query(
      'INSERT INTO "users_institutions" (id_user, id_institution) VALUES ($1, $2)',
      [id, institution]
    );

    // Actualizar la foto de perfil si viene
    if (photoUrl) {
      await pool.query(
        `UPDATE "users"
         SET user_url = $1
         WHERE id_user = $2`,
        [photoUrl, id]
      );
    }

    return res.status(200).json({ message: "Perfil configurado exitosamente" });

  } catch (error) {
    console.error("Error al configurar perfil:", error);
    return res.status(500).json({ message: "Error al configurar el perfil", error: error.message });
  }
};
