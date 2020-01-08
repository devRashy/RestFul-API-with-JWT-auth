const jwt = require('jsonwebtoken')
 const User = require('../models/User')
 
 const auth = async (req,res,next) => {
     try{
           const token = req.header('Authorization').replace('Bearer ',"")
           const decoded = jwt.verify(token, "rasheedyusuf")
           const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
           if(!user){
               throw new Error()
           }
            req.token = token
            req.user = user
           next()

     } catch(e){
         //if user is not authenticated
        res.status(401).send({error: "please authenticate"})
     }
 }

 module.exports = auth