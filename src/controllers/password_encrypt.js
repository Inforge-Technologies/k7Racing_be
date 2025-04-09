const bcrypt = require('bcrypt');

exports.cryptPassword = async function(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        throw err;
    }
};

exports.comparePassword = async function(plainPass, hashword) {
    try {
        const isPasswordMatch = await bcrypt.compare(plainPass, hashword);
        return isPasswordMatch;
    } catch (err) {
        throw err;
    }
};
