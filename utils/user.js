[{
    id: '/#12',
    name: 'Prashant'
}]

//addUser(id,name,room)
//removeUser(id)
//getUser(id)
// getUserList(room);

class Users {
    constructor() {
        this.users = [];
        this.rooms = [];
    }
    addUser(id, name, room) {
        var user = { id, name, room };
        this.users.push(user)
        return user;
    }
    removeUser(id) {
        //returns user that was removed
        var user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id)
        }
        return user;

    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0]

    }
    getUserList(room) {
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);
        return namesArray;

    }

    addRoom(roomName) {
        this.rooms.push(roomName);

    }

    removeRoom(roomName) {

    }

    getRooms() {
        return this.rooms;
    }
}

module.exports = { Users }