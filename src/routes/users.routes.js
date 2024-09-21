import { Router } from "express";
import {createUser, deleteUser, getUsers, getUsersById, loginUser, updatePassword, updateUser} from '../controllers/user.controller.js'
import capitalizeNames from "../middleware/format.js";

const router = Router();

//*Traer a todos los usuarios
router.get('/users', getUsers)

//*Traer al usuario dependiendo del ID
router.get('/users/:id', getUsersById)

//*Iniciar Sesión
router.post('/login', loginUser)

//*Actualizar contraseña
router.patch('/users/password/:id' , updatePassword)

//*Crear un usuario
router.post('/users', capitalizeNames, createUser)

//*Borrar un usuario
router.delete('/users/:id', deleteUser)

//*Actualizar un usuario
router.put('/users/:id', updateUser);

export default router; 