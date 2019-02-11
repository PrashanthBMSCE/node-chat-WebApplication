var UserModel = require('../../models/user');
var AppHelper = require('../../task_functions/apphelper');
class UsersDBI {
    constructor() {

    }

    findUser(mailId) {
        return new Promise(function (resolve, reject) {
            UserModel.findOne({ emailid: mailId })
                .then(user => {
                    resolve(user)
                })
                .catch(err => {
                    reject(err);
                })
        })

    }


    register(details) {
        console.log('here too')
        return new Promise(function (resolve, reject) {
            details.password_token = AppHelper.genPasswordToken();
            details.token_expiry = AppHelper.genExpiryDate();
            details.hashkey = AppHelper.genHash();
            console.log('details', details);
            var newUser = new UserModel(details);
            newUser.save()
                .then(user => {
                    resolve(user)
                })
                .catch(err => {
                    reject(err);
                })
        })
    }


    verify(hashkey) {
        return new Promise(function (resolve, reject) {
            UserModel
                .update(
                    {
                        hashkey: hashkey
                    },
                    {
                        $set: {
                            verified: true,
                            hashkey: null
                        }
                    }
                )
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }


    login(loginCreds) {
        return new Promise(function (resolve, reject) {
            UserModel.findOne({ emailid: loginCreds.emailid })
                .then(user => {
                    resolve(user)
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

}

module.exports = new UsersDBI();

