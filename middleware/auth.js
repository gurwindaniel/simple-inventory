const obj={}

obj.auth=(req,res,next)=>{
    console.log(req.isAuthenticated())
    if(!req.isAuthenticated()){
        res.redirect('/')
    }
    else{
        
        next()
    }
}

module.exports=obj