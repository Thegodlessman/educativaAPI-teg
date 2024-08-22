import express, { urlencoded } from 'express'
import { PORT } from './config.js'
import userRoutes from './routes/users.routes.js'
import cors from "cors";
import bodyParser from 'body-parser';

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(cors());
app.use(userRoutes)

app.use(express.static("public"));


app.listen(PORT)
console.log('server on port', PORT)