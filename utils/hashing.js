const bcrypt = require("bcryptjs");
exports.dohash = (value,saltValue)=>
{
       const result = bcrypt.hash(value,saltValue);
       return result
}