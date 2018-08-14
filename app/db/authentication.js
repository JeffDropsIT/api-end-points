const crypto = require('crypto');
const hashPassword = async (password) =>{
    console.log("hashPassword. . .begin")
    const hash = await crypto.createHash("sha256").update(password).digest("hex");
    console.log("hashPassword. . .done")
    return await hash;
};


module.exports = {
    hashPassword,
}