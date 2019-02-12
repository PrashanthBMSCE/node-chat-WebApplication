require('dotenv').config();
var express = require('express');
var path = require('path');
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const socketIO = require('socket.io');
const http = require('http');

const { generateMessage, generateLocationMessage, generateImage } = require('./utils/message');
const { Users } = require('./utils/user');
const { isRealString } = require('./utils/validation');
var users = new Users();

var app = express();
var server = http.createServer(app);
var io = socketIO(server)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));

console.log("port", process.env.PASSWORD)
const port = process.env.PORT || 5000;

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}))
//connect Flash
app.use(flash());
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})


module.exports = app;
require('./init_functions');
require('./routes/default');
io.on('connection', (socket) => {
    console.log('connected user')
    socket.emit('prof', { name: 'jon' });
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and  room are required!!')
        }
        socket.join(params.room)
        users.removeUser(socket.id);
        users.addRoom(params.room)
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room))

        socket.emit('newMessage', {
            from: 'Admin',
            text: 'welcome to chat',
            createdAt: new Date().getTime()
        })
        socket.broadcast.to(params.room).emit('newMessage', {
            from: 'Admin',
            text: `${params.name} has joined.`,
            createdAt: new Date().getTime()

        })

        callback();

    })
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            var msg = generateMessage(user.name, message.text)
            io.to(user.room).emit('newMessage', msg);
            socket.handshake.session.user.messages.push(msg)
            console.log('messages', socket.handshake.session.user.messages)
        }
        callback('this is from server')
    })

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat`))

        }
    })
    socket.on('sendLocation', (coords) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))

        }
    })



})
// require('./events/socket');




server.listen(port, () => {
    console.log('port is on 5000')
})
