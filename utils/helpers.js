const jwt = require('jsonwebtoken');

class Helpers {
    static generateAuthToken(obj) {
        const token = jwt.sign(obj, process.env.JWT_PRIVATE_KEY, 
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        );

        return token;
    }
}

module.exports = Helpers;