require("dotenv").config()
const express = require("express")
const app = express() 

const acces = require("./middleware/regAcces")
// exportacion de las rutas 
const rutaUsuarios = require("./routes/user")
const rutaChatgpt = require("./routes/chatgpt") 

app.use(acces); //Midleware de acces

//rutas para las peticiones
app.use("/user", rutaUsuarios)
app.use("/chatgpt", rutaChatgpt)

app.listen(process.env.PORT, ()=>{
    console.log("Servicio Iniciado, puerto: "+process.env.PORT)})

