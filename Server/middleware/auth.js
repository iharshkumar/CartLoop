import jwt from "jsonwebtoken"

const auth = async (request,response,next)=>{
    try{
        let token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]
        
        if(!token){
            token = request.query.token
        }
        
        if(!token){
            return response.status(401).json({
                message:"Provide token"
            })
        }

        const decode = jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)

        if(!decode){
            return response.status(401).json({
                message:"unauthorized access",
                error:true,
                success:true
            })
        }

        request.userId = decode.id

        next()
    }
    catch(error)
    {
        console.error('Auth middleware error:', error.message);
        return response.status(401).json({
            message: error.message || "You have not login",
            error:true,
            success:false
        })
    }
}

export default auth