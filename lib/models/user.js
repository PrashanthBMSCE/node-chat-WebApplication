var mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
var SALT_WORK_FACTOR = 10

var UserSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    emailid: { type: String, lowercase: true },
    password: {
        type: String,
    },
    hashkey: {
        type: String
    },
    password_token: String,
    token_expiry: Date,
    verified: {
        type: Boolean,
        default: false
    },

}, {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        versionKey: false
    })


UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword) {
    console.log('candidatePassword', candidatePassword)
    return new Promise(function (resolve, reject) {
        bcrypt.compare(candidatePassword, this.password)
            .then(resp => {
                resolve(resp)
            })
            .catch(err => {
                reject(err);
            })
    })

};

var UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel