//it is just exporting a function that will run whenever the /signup route is hit (via POST usually).
const { signupSchema, signinSchema } = require("../middleware/validator");
const User = require("../models/usersModel")
const jwt = require("jsonwebtoken")
const { dohash, dohashValidation, hmacprocess } = require("../utils/hashing");
const transport = require("../middleware/sendMail");
const { trusted } = require("mongoose");

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signupSchema.validate({ email, password })
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message })
        }
        // to check if a user already exists or not so import user model ad checkby email
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(401).json({ success: false, message: "user already exists" })
        }
        //if user does not exists then we need to hash the password
        const hashpass = await dohash(password, 12)
        const newUser = new User
            (
                {
                    email,
                    password: hashpass
                }
            )
        const result = await newUser.save()
        result.password = undefined
        res.status(201).json(
            {
                success: true, message: "Your account has been created", result
            }
        )

    } catch (error) {
        console.error("Signup Error:", error); // more descriptive
        res.status(500).json({ success: false, message: error.message });
    }

}

//signin
exports.signin = async (req, res) => {
    const { email, password } = req.body
    try {
        const { error, value } = signinSchema.validate({ email, password })
        if (error) {
            res.status(401).json({
                success: false, message: error.details[0].message

            })
        }
        const existingUser = await User.findOne({ email }).select('+password')
        if (!existingUser) {
            return res.status(401).json({ success: false, message: 'User does not exist' })
        }
        const result = await dohashValidation(password, existingUser.password)
        if (!result) {
            return res.status(401).json({ success: false, message: 'Invalid credentials!' })
        }
        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified,

        }, process.env.TOKEN_SECRET,
            {
                expiresIn: '8h'
            }

        );
        res.cookie("Authoriztion", "Bearer" + token,
            {
                expires: new Date(Date.now() + 8 * 3600000), httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production'

            }
        ).json({
            success: true,
            token,
            message: "logged in successfuly"
        })

    }
    catch (error) {
        console.log(error)
    }
}
exports.signout = async (req, res) => {
    res.clearCookie('Authorization').status(200).json({ success: true, message: "signout successfully" })
}
//send the verification code
exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            res.status(401).json({ success: failure, message: "User does not exists" })
        }
        if (existingUser.verified) {
            res.status(401).json({ success: false, message: "User already verified" })
        }
        const codeValue = Math.floor(Math.random() * 1000000).toString()
        let info = await transport.sendMail(
            {
                from:process.env.EMAIL_ADDRESS,
                to:existingUser.email,
                subject:"verification code",
                html:'<h1>'+codeValue+'</h1>'
            }
        )
        if(info.accepted[0]=== existingUser.email)
        {
            const hashedCodevalue = hmacprocess(codeValue,process.env.HMAC_CODE_SECRETKEY)
            existingUser.verificationCode=hashedCodevalue
            existingUser.verificationCodeValidation = Date.now()
            await existingUser.save()
            return res.status(200).json({success:trusted,message:"code sent"})
        }
        res.status(400).json({success:false,message:"code sent failed"})
    } catch (error) {
        console.log(error)
    }
}
//function to verify the verification code