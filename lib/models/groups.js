var mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
var SALT_WORK_FACTOR = 10

var GroupSchema = mongoose.Schema({
    groupname: { type: String, unique: true },
    emailid: { type: String, lowercase: true },
    userid: mongoose.Schema.Types.ObjectId
}, {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        versionKey: false
    })
var GroupModel = mongoose.model('groups', GroupSchema);
module.exports = GroupModel