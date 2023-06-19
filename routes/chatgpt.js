const express = require('express')
const axios = require('axios')
const router = express.Router()
//models
const chatgptModel = require('../models/chatgptModel')
//middleware
const validateToken = require('../middleware/validateToken')
const validatePrompt = require('../middleware/validatePrompt')
//Conexion a la Base de Datos
const MongoConnect=require("../MongoConnect")
MongoConnect()

router.use(express.json()) 

//CUMPLE CON GUARDAR LOS DATOS, Recibe un json con los datos prompt, response, id_user y lo almacena en la colección. Estos datos se generan una vez la API de ChatGPT responde la petición. Debe recibir el token de autorización. 
router.post('/',validateToken, validatePrompt, async(req, res) => {

    const { prompt, response, id_user } = req.body;

    const message =  req.body.name; // Obtener el mensaje enviado por el cliente en el cuerpo de la solicitud
    const apiUrl = process.env.API_URL // URL de la API de OpenAI
    const apiKey = process.env.OPENAI_API_KEY // Clave de API de OpenAI // (reemplazar por la propia)
    // Configurar los parámetros de la solicitud a la API de OpenAI en formato JSON
    axios.post(apiUrl, {
        "model": "gpt-3.5-turbo", // Nombre del modelo pre-entrenado a utilizar
        "messages": [{ role: "system", "content": message }
        ],
        "temperature": 0.7, // Controla la aleatoriedad de la respuesta generada por el modelo de lenguaje
        "max_tokens": 512, // Controla el tamaño máximo de la respuesta generada por el modelo de lenguaje
        "top_p": 1, // Controla la generación de texto basada en la probabilidad de cada palabra
        "frequency_penalty": 0, // Controla la repetición de palabras en la respuesta generada por el modelo de lenguaje
        "presence_penalty": 0, // Controla la inclusión de palabras específicas en la respuesta generada por el modelo de lenguaje
    }, {
        headers: {
            'Content-Type': 'application/json', // Especifica que se está enviando JSON en el cuerpo de la solicitud
            'Authorization': `Bearer ${apiKey}` // Se envía la clave de API como un token de autorización en la cabecera de la solicitud
        }
    })
        .then(response => {
            // Extraer la respuesta generada por el modelo de lenguaje a partir de la propiedad 'choices' de la respuesta de la API
            const completion = response.data.choices[0].message.content;
            const date_create = new Date()
            const chat = new chatgptModel({prompt:message, response:completion, id_user, date_create})
            chat.save()
            return res.status(201).json(chat);
            res.json({response:completion}); // Enviar la respuesta generada por el modelo de lenguaje al cliente 
        })
        .catch(error => {
            console.log(error); // Manejar cualquier error que ocurra durante la solicitud a la API de OpenAI
            res.status(500).json('Ha ocurrido un error en la solicitud a la API de ChatGPT'); // Enviar una respuesta de error al cliente
        });


});


//LISTO Recibe un id de un chat y devuelve un json con el registro que coincida. 
router.get('/:id', async (req, res) => {
    try {
      const chatId = req.params.id;
  
      // Buscar el chat por su id en la colección
      const chat = await chatgptModel.findById(chatId);
  
        if (!chat) {
            return res.status(404).json({ error: 'Id del chat no encontrado' });
        }
    return res.json(chat);

    } catch (error) {

      return res.status(500).json({ error: 'Error de servidor' });
    }
  });

//MEDIO LISTO,  Recibe un id con el id del usuario que registro el chat, devuelve todos los registros de ese usuario buscando por el campo utilizando el método find. 
router.get('/user/:id_user', async (req, res) => {
    try {

      const userId = req.params.id_user;
      // Buscar todos los chats del usuario en la colección
      const chats = await chatgptModel.find({ id_user: userId }); 

      return res.json(chats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error de servidor' });
    }
  });


  router.delete("/:id",async(req,res)=>{
    try{
        const {id}=req.params
        const chatgpt = await chatgptModel.findByIdAndDelete(id)
        if(!chatgpt)
            return res.status(404).json({status:"No se encuentra el id"})
        return res.json("Exito al eliminar el Chat")
         }catch(error){
            console.log(error)
         return res.status(500).json({status:"Error de Servidor"})
     }
})

module.exports=router