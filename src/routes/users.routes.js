import { Router } from "express";
import { pool } from "../db.js";


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

router.post('/users', (req, res) =>{
    const { id } = req.params
    res.send('Creando Usuario')
})

router.delete('/users/:id', (req, res) =>{
    const { id } = req.params
    res.send('Eliminando usuario')
})

router.put('/users/:id', (req, res) =>{
    const { id } = req.params
    res.send('Actualizar un usuario')
})

export default router; 