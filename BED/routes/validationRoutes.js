const express = require("express")
const authRoute = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken")
const postModel = require("../models/postmodel")

authRoute.get('/validateToken',async (req, res) => {
    let authHeaders = req.headers.authorization;

    let token = authHeaders && authHeaders.split(" ")[1];

    try {
        let result = jwt.verify(token, `${process.env.SECRET}`)
        // console.log(result);

        let postData = await postModel.find();

        res.json({ payload: result, data: postData, status: true })
    } 
    catch (error) {
        res.json({msg:"Session Expired", status: false})
    }
})

authRoute.get("/validate",(req,res)=>{
    let authHeaders = req.headers.authorization;
    let token = authHeaders && authHeaders.split(" ")[1];

    try {
        let result = jwt.verify(token, `${process.env.SECRET}`);
        alert("valid session")
        res.json({msg:"Session Valid", status:true, data:result.username})
    } catch (error) {
        res.json({msg:"Session Expired", status:false})
    }
})

module.exports = authRoute;