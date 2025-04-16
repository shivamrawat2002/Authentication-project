
const joi = require("joi")
// Joi stops it before even reaching the database
// You can immediately return a 400 response with a helpful error
// It’s much faster + safer Joi is the bouncer at the door
//🧱 Mongoose is the security guard inside

exports.signupSchema = joi.object(
{
    email: joi.string().min(6).max(60).required().email(
        {
            tlds:{allow:['com','net']}
        }
    ),
    password: joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'))
});

