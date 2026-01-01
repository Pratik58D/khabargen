const errorHandling = (err,req,res,next) =>{
    console.log('error from error middleware' , err)

    return res.status(err.status || 500).json({
        message : err.message || "Internal Server error"
    })

}



export default errorHandling;