var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(88);


var messages = [];
var users = [];
var writeSomehings = [];
io.on("connection", function(socket) {
    console.log("Co nguoi ket noi " + socket.id);

    socket.on("client-send-username", function(data) {
        if (users.indexOf(data) >= 0) { // neu da co user
            socket.emit("server-send-register-fail");
        } else {
            users.push(data);
            socket.username = data;
            console.log(socket.id + " vua dang ky voi username: " + data);
            socket.emit("server-send-register-success", data);
            socket.broadcast.emit("server-send-update-userlist", { list: users, user: socket.username, type: 'join' });
        }
    });

    socket.on("logout", function() {
        users.splice(
            users.indexOf(socket.username), 1
        );
        socket.broadcast.emit("server-send-update-userlist", { list: users, user: socket.username, type: 'leave' });
    });

    socket.on("client-send-message", function(msg) {
        if (messages.length > 50) {
            messages = messages.splice(0, 1);
        }
        var md = { user: socket.username, msg: msg };
        messages.push(md)
        io.sockets.emit('server-send-message', md);
    });
    socket.on('writing', function() {
        if (!(writeSomehings.indexOf(socket.username) >= 0)) {
            writeSomehings.push(socket.username);
        }
        socket.broadcast.emit("someone-are-writing", writeSomehings);
    });
    socket.on('stop-writing', function() {
        if ((writeSomehings.indexOf(socket.username) >= 0)) {
            writeSomehings.splice(writeSomehings.indexOf(socket.username), 1);
        }
        socket.broadcast.emit("someone-are-writing", writeSomehings);
    });

});

app.get("/", function(req, res) {
    res.render("index");
});