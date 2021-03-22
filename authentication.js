const jwt = require('jsonwebtoken');
const fs = require('fs');

const TEST_PRIVATE_KEY = fs.readFileSync('./pri.key');

exports.signToken = (body) => {
    const token = jwt.sign(body, TEST_PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: 300,
    })
    return token;
}