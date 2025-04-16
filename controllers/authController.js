//it is just exporting a function that will run whenever the /signup route is hit (via POST usually).
const { signupSchema } = require("../middleware/validator");
const User = require("../models/usersModel")
const {dohash} = require("../utils/hashing")

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signupSchema.validate({ email, password })
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message })
        }
        // to check if a user already exists or not so import user model ad checkby email
        const existingUser =  await User.findOne({email})
        if(existingUser)
            {
                return res.status(401).json({success:false,message:"user already exists"})
            } 
        //if user does not exists then we need to hash the password
        const hashpass = await dohash(password,12)
        const newUser = new User
        (
            {email,
                password:hashpass
            }
        )
        const result = await newUser.save()
        result.password = undefined
        res.status(201).json(
            {
                success:true,message:"Your account has been created",result
            }
        )

    } catch (error) {
        console.error("Signup Error:", error); // more descriptive
        res.status(500).json({ success: false, message: error.message });
    }
    
}
