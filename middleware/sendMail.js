const nodemailer = require("nodemailer")
const transport = nodemailer.createTransport
(
    {
        service:"gmail",
        auth:
        {
            user:process.env.EMAIL_ADDRESS,
            pass:process.env.EMAIL_PASS
        }
    }
)
module.exports = transport