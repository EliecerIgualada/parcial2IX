const validateLogin=(req,res,next)=>{
    const {user, password}=req.body
    if ( !user||!password)
    return res.status(400).json({Message: "Faltan campos por llenar"})
    next()
}
module.exports=validateLogin