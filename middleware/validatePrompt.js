const validatePrompt=(req,res,next)=>{
    const {name,id_user}=req.body

    if ( !name || !id_user)
    return res.status(400).json({ status: "Error", message: "Prompt inválido" });
    
    next()
}
module.exports=validatePrompt