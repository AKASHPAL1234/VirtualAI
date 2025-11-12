import jwt from "jsonwebtoken";

export const isAuth=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            res.status(400).json({message:"Token not found"})
        }
        console.log(token)
        const verifytoken= jwt.verify(token,process.env.JWTSECRETKEY)
        console.log("Received token:", req.cookies.token);

        req.userId=verifytoken.userId;
        next()
        
    } catch (error) {
        console.log(error);
         res.status(500).json({message:`Error in isAuth ${error}`});

    }
}

