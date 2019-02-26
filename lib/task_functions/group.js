var GroupDBI = require('../endpoints/dbi_services/group_dbi');
class Group {
    constructor() {
    }
    saveGroup(data) {
        return new Promise(function (resolve, reject) {
            GroupDBI.saveGroupName(data)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        })

    }
    getGroups(userId) {
        return new Promise(function (resolve, reject) {
            GroupDBI.getGroupNames(userId)
                .then(groups => {
                    resolve(groups);
                })
                .catch(err => {
                    reject(err);
                })
        })

    }

    getGroupByName(gname) {
        return new Promise(function (resolve, reject) {
            GroupDBI.getGroupByName(gname)
                .then(gname => {
                    resolve(gname)
                })
                .catch(err => {
                    reject(err);
                })

        })
    }

}

module.exports = new Group();