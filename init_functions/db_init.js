var mongoose = require("mongoose");
mongoose.connect(
    process.env.MONGODB_CONN_URL,
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
