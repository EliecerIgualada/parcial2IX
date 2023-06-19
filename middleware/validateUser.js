const validateUser=(req,res,next)=>{

    const {user, password, name, }=req.body

    if ( !user||!password||!name)
    return res.status(400).json({Message: "Faltan campos por llenar"})

    next()
}

module.exports=validateUser