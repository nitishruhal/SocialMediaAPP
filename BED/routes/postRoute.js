const express = require("express");
const jwt = require("jsonwebtoken");
const postRoutes = express.Router();
require("dotenv").config();
const postModel = require('../models/postmodel');

function validateToken(req, res, next) {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
        req.body = { msg: "No token provided", status: false };
        return next();
    }

    let token = authHeader.split(" ")[1];
    try {
        let result = jwt.verify(token, `${process.env.SECRET}`);
        console.log(result);
        req.body = { data: { username: result.username, ...req.body }, status: true };
    } catch (error) {
        console.log(error);
        req.body = { msg: "Session Expired", status: false };
    }
    next();
}

postRoutes.post('/createPost', validateToken, async (req, res) => {
    console.log(req.body);

    if (!req.body.status) {
        return res.status(401).json({ msg: req.body.msg, status: false });
    } else {
        let postData = req.body.data
        console.log(postData);

        try {
            let post = new postModel(postData);
            await post.save();
            res.status(201).json({ msg: "Post created successfully", post });
        } catch (error) {
            res.status(500).json({ msg: "Error saving the post", error });
        }
    }
});

postRoutes.get('/author/:authorName', async (req, res) => {
    let authorName = req.params.authorName;

    try {
        let posts = await postModel.find({ author: authorName });

        if (posts.length > 0) {
            res.json({ data: posts, status: true })
        } else {
            res.json({ msg: "No Such Author Found, try another author", status: false })
        }
    } catch (error) {
        res.json({ msg: "Error is finding the author, Try another author", status: false })
    }

})

postRoutes.delete('/deletePost/:id', async (req, res) => {
    let postId = req.params.id;

    let postData = await postModel.findByIdAndDelete(postId);

    if (postData.length <= 0) {
        res.json({ msg: "No such Post exists.", status: false })
    } else {
        res.json({ msg: "Post Deleted Successfuly", status: true })
    }

})

postRoutes.get('/getPost/:id', async (req, res) => {

    let authHeaders = req.headers.authorization;
    let token = authHeaders && authHeaders.split(" ")[1];

    try {
        let result = jwt.verify(token, `${process.env.SECRET}`);

        let postData = await postModel.findById(req.params.id);

        // console.log(postData);
        // res.json({msg:"Finding posts"});

        if (postData) {
            res.json({ data: postData, status: true })
        } else {
            res.json({ msg: "Error in finding the Post", status: false })
        }


    } catch (error) {
        res.json({msg:"Unauthorised Access, Login Again", status:false})
    }


})

postRoutes.put('/editPost/:id',async(req,res)=>{
    let authHeaders = req.headers.authorization;
    let token = authHeaders && authHeaders.split(" ")[1];
    let postData = req.body;
    let postId = req.params.id

    try {
        let result = jwt.verify(token, `${process.env.SECRET}`);

        let responseData = await postModel.findByIdAndUpdate(postId, postData, {new:true})
        
        if(responseData){
            res.json({msg:"Data Updated successfully", status:true})
        }else{
            res.json({msg:"Error in Updating the data", status:false})
        }        
    }
    catch(error){
        res.json({msg:"Unauthorised Access", status:false})
    }
})
postRoutes.get('/likePost/:postId/:userName', validateToken, async (req, res) => {
    let { postId, userName } = req.params;
    console.log(postId, userName);

    try {
        let post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Post not found", status: false });
        }

        if (post.likes.includes(userName)) {
            // Unlike the post
            post.likes = post.likes.filter(user => user !== userName);
            await post.save();
            console.log("Like removed");
            res.json({ msg: "Like removed", status: false, likesCount: post.likes.length });
        } else {
            // Like the post
            post.likes.push(userName);
            await post.save();
            console.log("Like added");
            res.json({ msg: "Post liked", status: true, likesCount: post.likes.length });
        }

    } catch (error) {
        console.error("Error in updating likes:", error);
        res.status(500).json({ msg: "Error in updating likes", status: false });
    }
});

postRoutes.get('/showCurrentUserpost/:currentUser',async(req,res)=>{
    let currentUser = req.params.currentUser
    console.log(currentUser);
    try {
        let posts = await postModel.find({ username: currentUser});

        if (posts.length > 0) {
            res.json({ data: posts, status: true })
        } else {
            res.json({ msg: "No such post Found, try another create some posts", status: false })
        }
    } catch (error) {
        res.json({ msg: "Error is finding the post ", status: false })
    }


    // res.json("done")
})

module.exports = postRoutes;
