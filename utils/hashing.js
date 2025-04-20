const bcrypt = require("bcryptjs");
const { createHmac } = require("crypto"); // ✅ Destructure createHmac from crypto

exports.dohash = (value,saltValue)=>
{
       const result = bcrypt.hash(value,saltValue);
       return result
}
//create a function to compare entered pass with db
exports.dohashValidation = (value,hashedValue)=>
{
       const result = bcrypt.compare(value,hashedValue);
       return result
}
exports.hmacprocess = (value,key)=>
{
       const result = createHmac('sha256',key).update(value).digest('hex')
       return result
}