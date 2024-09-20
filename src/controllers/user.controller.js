import { pool } from "../db.js";
import { check, validationResult } from "express-validator";
import { encrypt, compare }  from "../helpers/handleBcrypt.js"
import { tokenSign } from "../helpers/generateToken.js";

export const getUsers = async (req, res) =>{ //* Obtener todos los usuarios

    const {rows} = await pool.query('SELECT * FROM "users"')
    console.log(rows)
    res.json(rows)
}

export const getUsersById = async(req, res) =>{ //* Obtener usuario por ID
    const { id } = req.params
    const {rows} = await pool.query('SELECT * FROM "users" WHERE id_user = $1', [id])

    if(rows.length === 0){
        return res.status(404).json({message: "User not found"})
    }

    res.json(rows)
}

export const loginUser = async (req, res) => {//* Iniciar Sesión
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
                CONCAT(usuario.user_name,' ', usuario.user_lastname) AS full_name, 
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

        if (!checkPassword || rows.legth === 0) {
            return res.status(401).json({ message: "Correo Electronico o contraseña incorrectos" });
        }

        const tokenSession = await tokenSign(user)


        //* Autenticación exitosa
        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            user: {
                id_user: user.id_user,
                ced_user: user.ced_user,
                name: user.full_name,
                email: user.email,
                id_rol: user.id_role,
                rol: user.rol_name
            },
            tokenSession
        });
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        return res.status(500).json({ message: "Error del servidor" });
    }
};

export const createUser = async (req, res) =>{ //* Crear Usuario
    const {user_ced, user_name, user_lastname, user_email, user_password} = req.body
        await check('user_ced').notEmpty().withMessage('the cedula is obligatory').isNumeric().withMessage("The cedula can only be numeric").run(req);
        await check('user_name').notEmpty().withMessage('the name is oblifgatory').run(req);
        await check('user_lastname').notEmpty().withMessage('the field is oblifgatory').run(req);
        await check('user_email').notEmpty().withMessage('the field is oblifgatory').isEmail().withMessage("the email is not valid").run(req);
        await check('user_password').notEmpty().withMessage('the field is oblifgatory').run(req);

        const defaultURL = 'AQUI IRA UNA URL';

        const passwordHash = await encrypt(user_password)

        const queryRole = `SELECT id_rol FROM "roles" WHERE rol_name = 'Usuario'`
        const {rows: roleRows} = await pool.query(queryRole);
        
        const id_rol = roleRows[0].id_rol;
        console.log("el id es:" + id_rol)

        let result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({
                message: "you have these errors",
                errors: result.array(),
            });
        }
    
        console.log(req.data);
    
        //*Verificar si el email ya está en uso por otro usuario
        const query2 = 'SELECT * FROM "users" WHERE user_email = $1 ';
        const { rowCount: emailCount } = await pool.query(query2, [user_email]);

        if (emailCount > 0) {
            return res.status(400).json({ message: "El email ya ha sido registrado" });
        }

        //*Verificar si dos personas tienen la misma cedula
        const query3 = 'SELECT * FROM "users" WHERE user_ced = $1';
        const { rowCount: userCount } = await pool.query(query3, [user_ced]);
        if (userCount > 0) {
            return res.status(400).json({ message: "La cedula ya ha sido registrada" });
        }

        const { rows, rowCount } = await pool.query(
            `INSERT INTO "users" (id_rol, user_url, user_ced, user_name, user_lastname, user_email, user_password) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
            [id_rol, defaultURL, user_ced, user_name, user_lastname, user_email, passwordHash]
        );
            
        if(rowCount === 0){
            return res.status(404).json({message: 'something happened idj'});
        }
    
        return res.status(200).json({message:'User created' , user: rows});
}

export const deleteUser = async(req, res) =>{ //* Borrar usuario
    const { id } = req.params
    const {rows, rowCount} = await pool.query('DELETE FROM "users" WHERE id_user = $1 RETURNING *', [id])

    if(rowCount === 0){
        return res.status(404).json({message: "User not found"})
    }
    console.log(rows)
    return res.json({message: "User deleted", user: rows})
}

export const updateUser = async (req, res) => { //* Actualizar Usuario
    const { id } = req.params;
    const { ced_user, name, lastname, email } = req.body;

    await check("ced_user").notEmpty().withMessage('The cedula is obligatory').isNumeric().withMessage("The cedula can only be numeric").run(req);
    await check('name').notEmpty().withMessage('The name is obligatory').run(req);
    await check('lastname').notEmpty().withMessage('The lastname is obligatory').run(req);
    await check('email').notEmpty().withMessage('The email is obligatory').isEmail().withMessage("The email is not valid").run(req);

    console.log(req.body);

    try {
        
        //*Verificar si el email ya está en uso por otro usuario
        const query2 = 'SELECT * FROM "users" WHERE user_email = $1 AND id_user != $2';
        const { rowCount: emailCount } = await pool.query(query2, [email, id]);

        if (emailCount > 0) {
            return res.status(400).json({ message: "Email is already in use by another user" });
        }

        //*Verificar si dos personas tienen la misma cedula
        const query3 = 'SELECT * FROM "user" WHERE ced_user = $1 AND id_user != $2';
        const { rowCount: userCount } = await pool.query(query3, [ced_user, id]);
        if (userCount > 0) {
            return res.status(400).json({ message: "Ced is already in use by another user" });
        }
        

        let query = 'UPDATE "users" SET ced_user = $1, name = $2, lastname = $3, email = $4 WHERE id_user = $5';
        const values = [ced_user, name, lastname, email, id];
        const { rows, rowCount } = await pool.query(query, values);

        return res.json({ message: "User updated", user: rows });
    } catch (error) {
        return res.status(500).json({ message: "Error updating user", error: error });
    }
}

export const updatePassword = async(req,res) => { //* Actualizar contraseña
    const { id } = req.params;
    const {password} = req.body;

    await check('password').notEmpty().withMessage('the field is oblifgatory').run(req);

    try{
        const query = 'UPDATE "users" SET password = $1 WHERE id_user = $2'    
        const values = [password, id]
        const {rowCount, rows} = await pool.query(query, values)
        return res.json({ message: "User updated", user: rows });

    }catch(error){
        return res.status(500).json({ message: "Error updating user password", error: error });
    }

}