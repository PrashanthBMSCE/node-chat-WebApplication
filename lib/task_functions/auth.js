var UserDBI = require('../endpoints/dbi_services/user_dbi');
const bcrypt = require("bcryptjs");
var Auth = function () {

}
Auth.prototype.register = async function (registrationDetails) {
    console.log('details0', registrationDetails);
    var foundUser;
    try {
        foundUser = await UserDBI.findUser(registrationDetails.emailid)
        console.log("found ", foundUser);
    } catch (e) {
        throw new Error("something is wrong")
    }
    if (foundUser != null) {
        throw new Error('user already registered')
    } else {
        console.log('coming here');
        var user = await UserDBI.register(registrationDetails)
        return user;
    }


}

Auth.prototype.verify = async function (hashkey) {
    let data;
    try {
        data = await UserDBI.verify(hashkey)
    } catch (e) {
        throw new Error('something went wrong')

    }
    if (data) {
        return data;
    }


}

Auth.prototype.logIn = async function (loginCreds) {
    let user;
    try {
        user = await UserDBI.login(loginCreds)
    } catch (e) {
        throw new Error(e);
    }
    if (!user) {
        throw new Error('emailID not registered')
    } else if (!user.verified) {
        throw new Error('Please verify email')
    } else {

        let resp = await bcrypt.compare(loginCreds.password, user.password)
        if (resp) {
            return user
        } else {
            throw new Error('Inavlid creds')
        }
    }

}
module.exports = new Auth();