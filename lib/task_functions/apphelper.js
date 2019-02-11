require('dotenv').config();
const uuidv1 = require("uuid/v4");
var jwt = require('jsonwebtoken')
var uid = require('uid');
var nodemailer = require("nodemailer");

var tokenValidTime = 3600000 * 72;
class AppHelper {
    constructor() {

    }
    genPasswordToken() {
        var token = uuidv1();
        return token;
    }
    genExpiryDate() {
        return Date.now() + tokenValidTime
    }
    genHash() {
        return uid(5);
    };

    sendEmailVerification(emailId, hashkey) {
        var url = `${process.env.API_URL}api/confirm/${hashkey}`;
        let transpoter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            services: "gmail",
            secure: false,
            port: 587,
            auth: {
                user: process.env.USER_NAME,
                pass: process.env.PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        var helperOption = {
            from: process.env.USER_NAME,
            to: emailId,
            subject: "please verify your emailId",
            html: `please click here:<a href="${url}">${url}</a>`
        };

        transpoter.sendMail(helperOption, (err, info) => {
            if (err) {
                throw err;
            } else {
                console.log("message sent successfuuly!!");
            }
        });

    }

}

module.exports = new AppHelper();