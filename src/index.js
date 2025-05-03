import express, { urlencoded } from 'express'
import { PORT } from './config.js'
import userRoutes from './routes/users.routes.js'
import profileRoutes from './routes/profile.routes.js'
import roomRoutes from './routes/room.routes.js'
import cloudinaryRoutes from './routes/cloudinary.routes.js'
import testRouter from './routes/test.routes.js'
import cors from "cors";

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(cors());
app.use(userRoutes)
app.use(profileRoutes)
app.use(roomRoutes)
app.use(cloudinaryRoutes)
app.use(testRouter)

app.use(express.static("public"));


app.listen(PORT)
console.log('server on port', PORT)