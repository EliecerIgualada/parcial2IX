const express = require ("express")
const jwt = require ("jsonwebtoken")
const bc = require("bcryptjs")
const router = express.Router()
//Models
const userModels = require("../models/userModels")
//midleware
const validateUser = require("../middleware/validateUser")
const validateLogin = require("../middleware/validateLogin")
const validateToken = require("../middleware/validateToken")
//Conexion a la Base de Datos
const MongoConnect=require("../MongoConnect")
MongoConnect()




//9 Middleware necesario
router.use(express.json())



// 1 POST Recibe un json con campos “user” y “password” sin cifrar. En este método, si el user y password existen en la base de datos, se debe devolver el token de autentificación.  
router.post("/login",validateLogin, async(req,res)=>{ // validar usuario y contrasena 

    try{
        const {user, password } = req.body  // Obtener los datos del cuerpo de la solicitud

        const  usuario = await userModels.findOne({user})
        const pass = await userModels.findOne({password})

    // Buscar el usuario en la base de datos
            if (!usuario) {
        return res.status(404).json({ status: "Usuario Invalido" });
            }
            // Verificar la contraseña
        if (!pass) {
        return res.status(404).json({ status: "Contraseña Incorrecta" });
        }
        // Generar un token de autenticación
        const token = jwt.sign({usuario,pass}, process.env.LOCALKEY, (error, token)=>{
            if (error)
            return res.status(500).json({status:"Token no generado"})
            return res.json(token)
        }); 

    }catch(error){
        return res.status(500).json({status:"Error de Servidor"})
     }
    })

// 2 GET Extrae un usuario específico. Debe devolver un json del usuario buscado. Debe recibir el token de autorización. 
router.get("/:id", validateToken, async(req,res)=>{
        try{
            const {id}=req.params //params 
            const usuarios = await userModels.findById(id)
            if(!usuarios)
            return res.status(404).json({status:"NO se encuentra el id"})
            return res.json(usuarios)
             }catch(error){
             return res.status(500).json({status:"Error de Servidorrr"})
         }
})

   //Listooooo el Instert // 3 POST Recibe un json con los campos user, password, name para realizar el ingreso de los datos.  El campo date_create debe calcularse en el método utilizando la función de javascript Date(). El salt debe generarse con la función saltSync. Y el password se debe guardar con la función hashSync.  
   router.post("/", validateUser, async(req,res)=>{
    try{
        const{ user, password, name}=req.body
        const existUser = await userModels.findOne({user})
        if (existUser){
            return res.status(400).json({ status: "Error", message: "El nombre de usuario ya existe" });
        }

        const salt = bc.genSaltSync(10)
        const hashPassword = await bc.hashSync(password,salt)
        const date_create = new Date()
        const registroU = new userModels({ user, salt, password:hashPassword, name, date_create})
        await registroU.save()
        return res.json(registroU)
    }catch(error){
        console.log(error)
        return res.status(500).json({status:"Error de Servidor"})

    }
})  


// 4 PUT Recibe un json con los campos user, password, name y el parámetro _ID del registro para realizar la actualización de los datos.   Debe recibir el token de autorización. 
router.put("/:id",validateToken,async(req,res)=>{
    try{
       const {id}=req.params
       const {user,password,name}=req.body
       const usuarios = await userModels.findByIdAndUpdate(id, {user,password,name}, {new: true})

       if(!usuarios){
           return res.status(404).json({status:"NO se encuentra el id"})
        }
        return res.json({ status: "Usuario Actualizado con Exito" });

    }catch(error){
        return res.status(500).json({status:"Error de Servidor"})
    }
   })

   // 5 DELETE Recibe un parámetro con el _ID del usuario a eliminar. Debe recibir el token de autorización. 
router.delete("/:id",validateToken,async(req,res)=>{
    try{
        const {id}=req.params
        const usuarios = await userModels.findByIdAndDelete(id)
        if(!usuarios)
            return res.status(404).json({status:"NO se encuentra el id"})
        return res.json("Exito al eliminar el usuario")
         }catch(error){
            console.log(error)
         return res.status(500).json({status:"Error de Servidor"})
     }
})

module.exports = router

