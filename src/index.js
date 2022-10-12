import express  from "express"
import { Server as WebSocketServer } from "socket.io"
import http from "http"
import path from "path"
import * as url from "url"
import Sockets from "./sockets.js"
import dotenv from "dotenv"

dotenv.config()

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const PORT =  process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

app.use(express.static(path.join(__dirname + "public")))

const httpserver = server.listen(PORT, () => {
    console.log("Servidor con exito")
})

const io = new WebSocketServer(httpserver)

Sockets(io)