const express = require("express");
const { auth } = require("../middlewares/auth.middleware");
const { PostModel } = require("../model/post.model");

const postRouter = express.Router();
postRouter.use(auth)
postRouter.post("/add", async (req, res) => {
    try {
        console.log(req.body)
        const post = new PostModel(req.body)
        await post.save()
        res.status(200).send({ "msg": "post created successfully", "post": req.body })
    }
    catch (err) {
        res.status(400).send({ "error": err.message })
    }
})
postRouter.get("/", async (req, res) => {
    console.log(req.body.userName)
    const posts = await PostModel.find({ userName: req.body.userName })
    try {
        res.status(200).send(posts)
    }
    catch (err) {
        res.status(400).send({ "error": err.message })
    }
})
postRouter.patch("/update/:id",async(req,res)=>{
    const {id}=req.params;
    const post=await PostModel.findOne({_id:id})
    try{
        if(post.userID==req.body.userID){
            await PostModel.findByIdAndUpdate({_id:id},req.body)
            res.status(200).send({"msg":`post with ${id} updated successfully`})
        }
        else{
            res.status(200).send("please login")
        }
    }
    catch (err) {
        res.status(400).send({ "error": err.message })
    }
})
postRouter.delete("/delete/:id",async(req,res)=>{
    const {id}=req.params;
    const post=await PostModel.findOne({_id:id})
    try{
        if(post.userID==req.body.userID){
            await PostModel.findByIdAndDelete({_id:id})
            res.status(200).send({"msg":`post with ${id} deleted successfully`})
        }
        else{
            res.status(200).send("please login")
        }
    }
    catch (err) {
        res.status(400).send({ "error": err.message })
    }
})
module.exports = { postRouter }
