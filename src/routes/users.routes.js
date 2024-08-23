import { Router } from "express";
import { pool } from "../db.js";
import { check, validationResult } from "express-validator";


const router = Router();

router.get('/users', async (req, res) =>{

    const {rows} = await pool.query('SELECT * FROM "user"')
    console.log(rows)
    res.json(rows)
})

router.get('/users/:id', async(req, res) =>{
    const { id } = req.params
    const {rows} = await pool.query('SELECT * FROM "user" WHERE id_user = $1', [id])

    if(rows.length === 0){
        return res.status(404).json({message: "User not found"})
    }

    res.json(rows)
})

router.post('/users', async (req, res) =>{
const { ced_user, name, lastname, email, password} = req.body
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
})

router.delete('/users/:id', async(req, res) =>{
    const { id } = req.params
    const {rows, rowCount} = await pool.query('DELETE FROM "user" WHERE id_user = $1 RETURNING *', [id])

    if(rowCount === 0){
        return res.status(404).json({message: "User not found"})
    }
    console.log(rows)
    return res.json({message: "User deleted", user: rows} )
})

router.put('/users/:id', (req, res) =>{
    const { id } = req.params
    res.send('Actualizar un usuario')
})

export default router; 