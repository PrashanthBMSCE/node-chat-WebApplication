var mongoose = require("mongoose");


mongoose.connect(
    "mongodb://localhost:27017/chat_app",
    { useNewUrlParser: true }
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
    console.log("h");
});

exports.test = function (req, res) {
    res.render("test");
};
