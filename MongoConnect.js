const mongoose=require("mongoose")

const MongoConnect=()=>{
    mongoose.connect(process.env.DB_URL) //
    .then (()=>{console.log("Se conectó a la BD")})
    .catch((error)=>{console.log("Error:" + error)})
}
module.exports = MongoConnect