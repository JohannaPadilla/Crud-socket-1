import { v4 as hash } from "uuid"
import fs from "fs"


let notes = []

export default (io) => {
    io.on("connection", (socket) => {
        console.log(`Nuevo usuario conectado en: ${socket.id} `)

        if(fs.existsSync("notas.json")){
            console.log("Historial de notas encontrado")
        } else {
            fs.writeFile("notas.json", "", () => {
                console.log("Historial de notas creado...")
            })
        }  

        socket.emit("server:loadnotes", notes)

        socket.on("client:newnote", (newNote) => {
            const note = {...newNote, id: hash()}
            notes.push(note)
            fs.appendFileSync("notas.json", JSON.stringify(note), () => {
                console.log("Nota agregada")
            })
            io.emit("server:newnote", note)
        })

        socket.on("client:deletenote", (id) => {
            console.log("Se quiere borrar la nota " + id)
            notes = notes.filter((note) => note.id !== id)
            io.emit("server:loadnotes", notes)
        })

        socket.on("client:getnote", (id) => {
            const note = notes.find((note) => note.id === id)
            socket.emit("server:selectednote", note)
        })

        socket.on("client:updatenote", (updateNote) => {
            notes = notes.map((note) => {
                if(note.id === updateNote.id) {
                    note.title = updateNote.title
                    note.description = updateNote.description
                } 
                return note
            })
            io.emit("server:loadnotes", notes)
        })

        socket.on("disconnect", () => {
            console.log(`El socket ${socket.id} se ha desconectado`)
        })
    })
}