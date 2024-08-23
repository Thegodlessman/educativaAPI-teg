import { pool } from "../db.js";
import { check, validationResult } from "express-validator";
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) =>{ //* Obtener todos los usuarios

    const {rows} = await pool.query('SELECT * FROM "user"')
    console.log(rows)
    res.json(rows)
}

export const getUsersById = async(req, res) =>{ //* Obtener usuario por ID
    const { id } = req.params
    const {rows} = await pool.query('SELECT * FROM "user" WHERE id_user = $1', [id])

    if(rows.length === 0){
        return res.status(404).json({message: "User not found"})
    }

    res.json(rows)
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validaciones de entrada
    await check('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('El email no es válido')
        .run(req);
    await check('password')
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
            'SELECT * FROM "user" WHERE email = $1',
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const user = rows[0];

        // Comparar la contraseña en texto plano
        if (user.password !== password) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Autenticación exitosa
        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            user: {
                id_user: user.id_user,
                ced_user: user.ced_user,
                name: user.name,
                lastname: user.lastname,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        return res.status(500).json({ message: "Error del servidor" });
    }
};

export const createUser = async (req, res) =>{ //* Crear Usuario
    const {ced_user, name, lastname, email, password} = req.body
        await check("ced_user").notEmpty().withMessage('the cedula is obligatory').isNumeric().withMessage("The cedula can only be numeric").run(req);
        await check('name').notEmpty().withMessage('the name is oblifgatory').run(req);
        await check('lastname').notEmpty().withMessage('the field is oblifgatory').run(req);
        await check('email').notEmpty().withMessage('the field is oblifgatory').isEmail().withMessage("the email is not valid").run(req);
        await check('password').notEmpty().withMessage('the field is oblifgatory').run(req);
    
        console.log(req.body)
    
        let result = validationResult(req);
    
        if (!result.isEmpty()) {
            return res.status(400).json({
                message: "you have these errors",
                errors: result.array(),
            });
        }
    
        console.log(req.data);
    
        //*Verificar si el email ya está en uso por otro usuario
        const query2 = 'SELECT * FROM "user" WHERE email = $1 ';
        const { rowCount: emailCount } = await pool.query(query2, [email]);

        if (emailCount > 0) {
            return res.status(400).json({ message: "Email is already in use by another user" });
        }

        //*Verificar si dos personas tienen la misma cedula
        const query3 = 'SELECT * FROM "user" WHERE ced_user = $1';
        const { rowCount: userCount } = await pool.query(query3, [ced_user]);
        if (userCount > 0) {
            return res.status(400).json({ message: "Ced is already in use by another user" });
        }


        const { rows, rowCount } = await pool.query(
            `INSERT INTO "user" (ced_user, name, lastname, email, password) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [ced_user, name, lastname, email, password]
        );
            
        if(rowCount === 0){
            return res.status(404).json({message: 'something happened idj'});
        }
    
        return res.status(200).json({message:'User created' , user: rows});
}

export const deleteUser = async(req, res) =>{ //* Borrar usuario
    const { id } = req.params
    const {rows, rowCount} = await pool.query('DELETE FROM "user" WHERE id_user = $1 RETURNING *', [id])

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
        const query2 = 'SELECT * FROM "user" WHERE email = $1 AND id_user != $2';
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
        

        let query = 'UPDATE "user" SET ced_user = $1, name = $2, lastname = $3, email = $4 WHERE id_user = $5';
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
        const query = 'UPDATE "user" SET password = $1 WHERE id_user = $2'    
        const values = [password, id]
        const {rowCount, rows} = await pool.query(query, values)
        return res.json({ message: "User updated", user: rows });

    }catch(error){
        return res.status(500).json({ message: "Error updating user password", error: error });
    }

}