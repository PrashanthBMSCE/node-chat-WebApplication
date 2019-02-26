var GroupModel = require('../../models/groups');

class GroupDBI {
    constructor() { }
    saveGroupName(details) {
        return new Promise(function (resolve, reject) {
            var group = new GroupModel(details)
            group.save()
                .then(group => {
                    resolve(group)
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
    getGroupNames(userId) {
        return new Promise(function (resolve, reject) {
            GroupModel.find({
                userid: userId
            }, {
                    groupname: 1
                })
                .then(groups => {
                    resolve(groups)
                })
                .catch(err => {
                    reject(err);
                })
        })

    }
    getGroupByName(gname) {
        return new Promise(function (resolve, reject) {
            GroupModel.findOne({
                groupname: gname
            })
                .then(gname => {
                    resolve(gname)
                })
                .catch(err => {
                    reject(err);
                })

        })
    }

}

module.exports = new GroupDBI()