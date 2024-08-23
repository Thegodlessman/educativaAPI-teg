import { Router } from "express";
import {createUser, deleteUser, getUsers, getUsersById, updatePassword, updateUser} from '../controllers/user.controller.js'

const router = Router();


//*Traer a todos los usuarios
router.get('/users', getUsers)

//*Traer al usuario dependiendo del ID
router.get('/users/:id', getUsersById)

//*Crear un usuario
router.post('/users', createUser)

//*Borrar un usuario
router.delete('/users/:id', deleteUser)

//*Actualizar un usuario
router.put('/users/:id', updateUser);

//*Actualizar contraseña
router.patch('/users/password/:id' , updatePassword)

export default router; 