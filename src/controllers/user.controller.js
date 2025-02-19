import { pool } from "../db.js";
import { check, validationResult } from "express-validator";
import { encrypt, compare } from "../helpers/handleBcrypt.js";
import { tokenSign } from "../helpers/generateToken.js";

export const getUsers = async (req, res) => { //* Obtener todos los usuarios
    const { rows } = await pool.query('SELECT * FROM "users"');
    console.log(rows);
    res.json(rows);
};

export const getUsersById = async (req, res) => { //* Obtener usuario por ID
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM "users" WHERE id_user = $1', [id]);

    if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(rows);
};

export const loginUser = async (req, res) => { //* Iniciar Sesión
    const { user_email, user_password } = req.body;

    // Validaciones de entrada
    await check('user_email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('El email no es válido')
        .run(req);
    await check('user_password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Errores de validación",
            errors: errors.array()
        });
    }

    try {
        // Buscar al usuario por email
        const { rows } = await pool.query(
            `SELECT 
                usuario.id_user, 
                CONCAT(usuario.user_name, ' ', usuario.user_lastname) AS full_name, 
                usuario.user_password, 
                usuario.user_ced, 
                usuario.user_email, 
                rol.id_rol,
                rol.rol_name
            FROM "users" 
            AS usuario 
            INNER JOIN "roles" 
            AS rol 
            ON usuario.id_rol = rol.id_rol 
            WHERE usuario.user_email = $1`,
            [user_email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const user = rows[0];

        //* Comparar la contraseña (contraseña plana, contraseña almacenada en DB)
        const checkPassword = await compare(user_password, user.user_password);

        if (!checkPassword) {
            return res.status(401).json({ message: "Correo Electronico o contraseña incorrectos" });
        }

        const tokenSession = await tokenSign(user);

        //* Autenticación exitosa
        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            user: {
                id_user: user.id_user,
                ced_user: user.user_ced,
                name: user.full_name,
                email: user.user_email,
                id_rol: user.id_rol,
                rol: user.rol_name
            },
            tokenSession
        });
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        return res.status(500).json({ message: "Error del servidor" });
    }
};

export const createUser = async (req, res) => { //* Crear Usuario
    const { user_ced, user_name, user_lastname, user_email, user_password } = req.body;

    await check('user_ced').notEmpty().withMessage('La cédula es obligatoria').isNumeric().withMessage("La cédula debe ser numérica").run(req);
    await check('user_name').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('user_lastname').notEmpty().withMessage('El apellido es obligatorio').run(req);
    await check('user_email').notEmpty().withMessage('El correo es obligatorio').isEmail().withMessage("El correo no es válido").run(req);
    await check('user_password').notEmpty().withMessage('La contraseña es obligatoria').run(req);

    const defaultURL = 'AQUI IRA UNA URL';

    const passwordHash = await encrypt(user_password);

    // Obtener el ID del rol "Usuario"
    const queryRole = `SELECT id_rol FROM "roles" WHERE rol_name = 'estudiante'`;
    const { rows: roleRows } = await pool.query(queryRole);
    const id_rol = roleRows[0].id_rol;

    let result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(400).json({
            message: "Errores de validación",
            errors: result.array(),
        });
    }

    //* Verificar si el email ya está en uso por otro usuario
    const query2 = 'SELECT * FROM "users" WHERE user_email = $1 ';
    const { rowCount: emailCount } = await pool.query(query2, [user_email]);

    if (emailCount > 0) {
        return res.status(400).json({ message: "El email ya ha sido registrado" });
    }

    //* Verificar si dos personas tienen la misma cédula
    const query3 = 'SELECT * FROM "users" WHERE user_ced = $1';
    const { rowCount: userCount } = await pool.query(query3, [user_ced]);
    if (userCount > 0) {
        return res.status(400).json({ message: "La cédula ya ha sido registrada" });
    }

    const { rows, rowCount } = await pool.query(
        `INSERT INTO "users" (id_rol, user_url, user_ced, user_name, user_lastname, user_email, user_password) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`,
        [id_rol, defaultURL, user_ced, user_name, user_lastname, user_email, passwordHash]
    );

    if (rowCount === 0) {
        return res.status(404).json({ message: 'Hubo un error al crear el usuario' });
    }

    return res.status(200).json({ message: 'Usuario creado exitosamente', user: rows[0] });
};

export const deleteUser = async (req, res) => { //* Borrar usuario
    const { id } = req.params;
    const { rows, rowCount } = await pool.query('DELETE FROM "users" WHERE id_user = $1 RETURNING *', [id]);

    if (rowCount === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({ message: "Usuario eliminado", user: rows[0] });
};

export const updateUser = async (req, res) => { //* Actualizar Usuario
    const { id } = req.params;
    const { ced_user, name, lastname, email } = req.body;

    await check('ced_user').notEmpty().withMessage('La cédula es obligatoria').isNumeric().withMessage("La cédula debe ser numérica").run(req);
    await check('name').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('lastname').notEmpty().withMessage('El apellido es obligatorio').run(req);
    await check('email').notEmpty().withMessage('El correo es obligatorio').isEmail().withMessage("El correo no es válido").run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Errores de validación",
            errors: errors.array(),
        });
    }

    try {
        //* Verificar si el email ya está en uso por otro usuario
        const query2 = 'SELECT * FROM "users" WHERE user_email = $1 AND id_user != $2';
        const { rowCount: emailCount } = await pool.query(query2, [email, id]);

        if (emailCount > 0) {
            return res.status(400).json({ message: "El email ya está en uso por otro usuario" });
        }

        //* Verificar si dos personas tienen la misma cédula
        const query3 = 'SELECT * FROM "users" WHERE user_ced = $1 AND id_user != $2';
        const { rowCount: userCount } = await pool.query(query3, [ced_user, id]);
        if (userCount > 0) {
            return res.status(400).json({ message: "La cédula ya está en uso por otro usuario" });
        }

        const query = 'UPDATE "users" SET user_ced = $1, user_name = $2, user_lastname = $3, user_email = $4 WHERE id_user = $5 RETURNING *';
        const values = [ced_user, name, lastname, email, id];
        const { rows, rowCount } = await pool.query(query, values);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.json({ message: "Usuario actualizado", user: rows[0] });
    } catch (error) {
        console.error("Error durante la actualización:", error);
        return res.status(500).json({ message: "Error al actualizar el usuario", error });
    }
};

export const updatePassword = async (req, res) => { //* Actualizar contraseña
    const { id } = req.params;
    const { password } = req.body;

    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Errores de validación",
            errors: errors.array(),
        });
    }

    try {
        const passwordHash = await encrypt(password);

        const query = 'UPDATE "users" SET user_password = $1 WHERE id_user = $2 RETURNING *';
        const values = [passwordHash, id];
        const { rows, rowCount } = await pool.query(query, values);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.json({ message: "Contraseña actualizada", user: rows[0] });
    } catch (error) {
        console.error("Error durante la actualización de contraseña:", error);
        return res.status(500).json({ message: "Error al actualizar la contraseña", error });
    }
};
