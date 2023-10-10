const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../db/model/userSchema');
const authenticate = require("../middleware/authentication");
const router = express.Router();
const bcrypt = require('bcryptjs');

const cookieParser = require('cookie-parser')

router.use(cookieParser());
require("../db/conn");
var cors = require('cors');
const body = require('body-parser');
router.use(
    cors({
        credentials: true,
        origin: 'https://mernkd.netlify.app/'
    })
)
router.get('/', (req, res) => {

    res.redirect("https://mernkd.netlify.app/");

})
router.get('/login', (req, res) => {

    res.redirect("https://mernkd.netlify.app/login");
})
router.get('/signup', (req, res) => {

    res.redirect("https://mernkd.netlify.app/signup");

})
router.get('/contact', (req, res) => {

    res.redirect("https://mernkd.netlify.app/contact");

})
router.post('/Signup', async (req, res) => {

    const { name, email, phone, password, cpassword } = req.body;

    if (!name || !email || !phone || !password || !cpassword) {
        return res.status(404).json({ error: "plz filled all feild properly" });
    }
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.json({ error: "email is already exist" });
        }
        else{
        const user = new User({ name, email, phone, password, cpassword });
        console.log(user);
        const response = await user.save();
        if(response){
            res.status(200).json({message:'send data'});
        }
        else{
            res.status(400).json({message:'not send data'});
        }
        }

    }
    catch (err) {
        console.log(err);
    }
    // User.findOne({email:email}).then((userexist)=>{
    //     if(userexist){
    //        return res.json({error:"email is already exist"});
    //     }
    //     const user=new User({name,email,phone,password,cpassword});
    //     user.save().then(()=>{
    //         res.json({message:"user regoster successfully"});
    //     }).catch(()=>{
    //         res.status(400).json({error:"error! not register"});
    //     })
    // }).catch(err=>{console.log(err);});

})

//Sign in

router.post('/Login', async (req, res) => {
    let token;
    const password  = req.body.password;
    const email  = req.body.email;
    if (!email || !password) {
        console.log(req.body);
        res.status(400).json({ message: 'please fill all detail' });
    }

    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            token = await userExist.generateAuthToken();
            
            const jtoken=res.cookie('jwttoken',token,{
                expires: new Date(Date.now()+ 25000000000),
                httpOnly: true
            });
            console.log(jtoken);
            const isMatch = await bcrypt.compare(password, userExist.password);
            if (isMatch) {
                res.status(200).json({message:'login successful'});
            }
            else{
                res.status(400).json({message:"Invalid Credentials"});
            }
            
        }
       
        
        
    }
    catch (err) {
        res.status(400).send();
        console.log(err);
    }
})


router.get('/about',authenticate,(req,res)=>{
    res.send(req.rootUser);
})

//logout page

router.get('/logout',(req,res)=>{
    res.clearCookie('jwttoken',{path:'/'});
    res.status(200).send("logout successful");
})


module.exports = router;
