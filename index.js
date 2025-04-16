const express = require("express")
const app = express()
const cors = require("cors")//security feature builtin web browsers
const helmet = require('helmet')//middleware
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");
app.use(cors())
app.use(helmet())
app.use(cookieParser())
//importing authRouter
app.use(express.json())
const authRouter = require("./routers/authRouter");
app.use(express.urlencoded({ extended: true }))
//if someone sends JSON data in a request (like in a POST or PUT), please automatically parse it and give it to me in req.body."
//allows your server to parse URL-encoded data, like data from HTML <form> submissions.
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Database connected successfully")
}).catch((err) => {
    console.log(err)
})
//Connecting with router
app.use("/api/auth",authRouter);

app.get("/", (req, res) => {
    res.json({ "message": "Hello" })
})

app.listen(process.env.PORT, () => {
    console.log("Server is running")
})