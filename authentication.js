const jwt = require('jsonwebtoken');
const fs = require('fs');

const TEST_PRIVATE_KEY = fs.readFileSync('./pri.key');
const TEST_PUBLIC_KEY = fs.readFileSync('./pub.key');

exports.signToken = (body) => {
    const token = jwt.sign(body, TEST_PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: 300,
    })
    return token;
}

exports.checkToken = (req) => {
    const token = req.get("Authorization");
    if(token){
        try {
            const jwtToken = token.split(' ')[1];
            var decoded = jwt.verify(jwtToken, TEST_PUBLIC_KEY);
            console.log(decoded);
            return true;
          } catch(err) {
            // err
            console.error(err);
            return false;
          }
    } else {
        return false;
    }
}