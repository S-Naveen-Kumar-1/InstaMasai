const express = require("express")
const bcrypt = require('bcrypt');
const { UserModel } = require("../model/user.model");
var jwt = require('jsonwebtoken');
const { TokenModel } = require("../model/token.model");
const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
    const { name, email, gender, password, age, city, is_married } = req.body;
    const userExists = await UserModel.findOne({ email })
    if (userExists) {
        res.status(200).send({ "msg":"User already registered, please login" })
        return
    }
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {

                res.status(200).send({ "msg": "couldnot hash" })
            }
            else {
                const user = new UserModel({
                    name,
                    email,
                    gender,
                    password: hash,
                    age,
                    city,
                    is_married
                })
                await user.save()
                res.status(200).send({ "msg": "registered successfully" })
            }
        });
    }
    catch (err) {
        res.status(400).send({ "error": err.message })
    }
})
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email })
    try {
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                const token = jwt.sign({ userName: user.name, userID: user._id }, "masai")
                res.status(200).send({ "msg": "login success", "token": token })
            }
            else {
                res.status(200).send({ "msg": "login failure, check login credntials" })

            }
        });
    }
    catch (err) {
        res.status(400).send({ "error": err.message })

    }

})
userRouter.get("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
      await TokenModel.create({
            token
        })
        res.status(200).send({ "msg": "logged out successfully" })

    }
    catch (err) {
        res.status(400).send({ "error": err.message })
    }

})

module.exports = { userRouter }