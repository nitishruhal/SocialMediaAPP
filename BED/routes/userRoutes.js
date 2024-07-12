const express = require('express')
const bcrypt = require('bcrypt')
const userRoutes = express.Router()
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

const generateAccessToken = (user)=>{
    return jwt.sign(user, `${process.env.SECRET}`, {expiresIn:'1h'})
}

userRoutes.post('/register', async (req, res) => {
    const encpass = await bcrypt.hash(req.body.password, 10);
    let user = new userModel({ ...req.body, password: encpass })
    await user.save();
    res.json("sucessfull")
})
userRoutes.post('/login', async (req, res) => {
    let data = req.body;
    console.log(data);
    let userData = await userModel.find({email:data.email})
    console.log(userData);

    if(userData.length <= 0){
        res.json({msg:"user doesn't exist or the credentials are wrong.", status: false})
    }
    else{
        let user = userData[0];
        let result = await bcrypt.compare(data.password,user.password);

        if(result){
            let access_token = generateAccessToken(user.toJSON());
            res.json({msg:"Login Success", status:true, token: access_token})
        }else{
            res.json({msg:"Login Failed, Wrong Credentials", status:false})
        }
    }

})

module.exports = userRoutes;