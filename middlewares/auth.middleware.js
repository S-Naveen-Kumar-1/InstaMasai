const { TokenModel } = require("../model/token.model")
var jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const token1 = await TokenModel.findOne({ token })
    if (token1) {
        res.status(200).send({ "msg": "please login" })
    }
    else {
        try {
            jwt.verify(token, "masai", (err, decoded) => {
                if (decoded) {
                    req.body.userName = decoded.userName;
                    req.body.userID = decoded.userID;
                    next()
                }
                else {
                    res.status(200).send({ "msg": "please login" })
                }
            })
        }
        catch (err) {
            res.status(400).send({ "error": err.message })
        }


    }
}
module.exports = { auth }