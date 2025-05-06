import express, { urlencoded } from 'express'
import cors from "cors";
import http from 'http'
import { Server } from 'socket.io';

import { PORT } from './config.js'
import userRoutes from './routes/users.routes.js'
import profileRoutes from './routes/profile.routes.js'
import roomRoutes from './routes/room.routes.js'
import cloudinaryRoutes from './routes/cloudinary.routes.js'
import testRouter from './routes/test.routes.js'


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

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
    }
})

io.on('conection', (socket) => {
    io.on('connection', (socket) => {
        console.log(`¡Usuario conectado a través de WebSocket! ID: ${socket.id}`);


        // Evento para recibir métricas de juego (se enviará periódicamente o por evento)
        socket.on('game_metric_update', (data) => {
            console.log(`Métrica de juego recibida del cliente ${socket.id}:`, data);
            // TODO: Lógica para procesar 'data' y actualizar métricas en BD (test_metrics)
            // Necesitarás vincular este socket a una prueba y un usuario específicos.
        });

        // Evento al finalizar el juego
        socket.on('game_finished', (finalMetrics) => {
            console.log(`Juego finalizado por cliente ${socket.id}. Métricas finales:`, finalMetrics);
            // TODO: Lógica para calcular score final y riesgo, guardar en BD (tests)
            // También necesitarás vincular este socket a una prueba y un usuario específicos.
        });


        // Manejar la desconexión del cliente
        socket.on('disconnect', () => {
            console.log(`Usuario desconectado de WebSocket. ID: ${socket.id}`);
            // TODO: Lógica si un usuario se desconecta inesperadamente
        });
    });
})

server.listen(PORT, () => {
    console.log('Server HTTP and WebSocket listening on port', PORT);
});