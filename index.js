const express = require("express");
const cors=require("cors")
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { postRouter } = require("./routes/posts.routes");
const app = express()
app.use(express.json())
app.use(cors())
app.use("/users",userRouter)
app.use("/posts",postRouter)
app.listen(8080, async () => {
    try {
        await connection
        console.log("connected to db")
        console.log("server running in 8080")
    }
    catch (err) {
        console.log(err)
    }
})