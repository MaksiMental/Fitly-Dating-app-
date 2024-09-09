const bcrypt = require('bcrypt');



async function haha(password) {
    const salt = await bcrypt.genSalt(10);
    let poulPassword = password;
    poulPassword = await bcrypt.hash(password, salt);
    return poulPassword;
}

console.log(haha('poul'));