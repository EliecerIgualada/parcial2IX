const mongoose = require("mongoose")

const chatgptSchema = mongoose.Schema({
    prompt : String,
    response : String,
    id_user : String,
    date_create : Date
})

const chatgptModel= mongoose.model("chatgpt",chatgptSchema)
module.exports=chatgptModel
