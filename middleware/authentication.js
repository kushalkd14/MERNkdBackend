const jwt = require("jsonwebtoken")
const User = require("../db/model/userSchema")


const Authenticate = async (req, res, next) =>{
    try{
        const vtoken = req.cookies.jwttoken;
        const verifyToken = jwt.verify(vtoken,process.env.SECRET_KEY);
        const rootUser = await User.findOne({_id: verifyToken._id, "tokens.token":vtoken});

        if(!rootUser) {throw new Error('User not Found')};
        req.token = vtoken;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();

    } catch(err){
        res.status(401).send('Unauthorized: No token Provided');
        console.log(err)
    }
}

module.exports = Authenticate;