var app = require('../server')
var Auth = require('../lib/task_functions/auth');
var AppHelper = require('../lib/task_functions/apphelper')
var Group = require('../lib/task_functions/group');
console.log('hdjhbdjsa')
app.get('/login', function (req, res) {
    res.render('login');
})

app.get('/reddy', function (req, res) {
    res.cookie('name', 'express').send('cookie set');

})
app.get('/', function (req, res) {
    if (req.session.user) {
        res.redirect('/chat')
    } else {
        res.redirect('/login')
    }
})

app.post('/login', function (req, res) {
    var loginCreds = {
        emailid: req.body.emailid,
        password: req.body.password
    }
    Auth.logIn(loginCreds)
        .then(user => {
            console.log('user');
            req.session.user = user
            res.redirect('/chat')
            // req.flash("success_msg", "successfully logged in");
            // res.redirect(req.get("referer"));

        })
        .catch(err => {
            console.log('error', err);
            req.flash("error_msg", err.message);
            res.redirect(req.get("referer"));
        })

})

app.get('/chat', function (req, res) {
    if (req.session.user) {
        //res.render("chatindex");
        Group.getGroups(req.session.user._id)
            .then(groups => {
                var grps = [];
                groups.map(function (item) {
                    grps.push(item.groupname)
                })
                res.render('chatindex', {
                    groups: grps
                })
            })
            .catch(err => {
                console.log('err=>', err);
            })

        // res.render('chatindex')
    } else {
        req.flash("success_msg", "pleaseLogin");
        res.redirect("/login");
    }

})
app.get('/register', function (req, res) {
    res.render('register');

})

app.post('/register', function (req, res) {
    //  console.log('req.body', req.body);
    var registrationDetails = {
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        emailid: req.body.emailId,
        password: req.body.passWord
    }
    Auth.register(registrationDetails)
        .then(user => {
            AppHelper.sendEmailVerification(user.emailid, user.hashkey);
            req.flash("success_msg", "successfully registered");
            res.redirect(req.get("referer"));
        })
        .catch(err => {
            console.log("err", err);

            req.flash("error_msg", "EmailId already registered");
            res.redirect(req.get("referer"));
            //console.log('err', err);
        })
})


app.get("/api/confirm/:_id", function (req, res) {

    Auth
        .verify(req.params._id)
        .then(updateddata => {
            console.log("updateddata", updateddata);
            if (updateddata.n === 1) {
                res.send("<h3>verification is successfull!!</h3>");
            } else {
                res.send("<h3>already verified</h3>");
            }
        })
        .catch(err => {
            console.log("err0", err);
        });
});


app.post('/chatjs', function (req, res) {

    if (req.session.user) {
        //res.render("chat")
        data = {
            userid: req.session.user._id,
            emailid: req.session.user.emailid,
            groupname: req.body.room
        }
        Group.saveGroup(data)
            .then(data => {
                res.render("chat", {
                    userName: req.session.user.firstname,
                    room: req.body.room
                });
            })
            .catch(err => {
                // console.log("err", err);
                req.flash("success_msg", "group-name already present");
                res.redirect(req.get("referer"));

            })

        //res.sendFile()
    } else {
        res.redirect("/login");
        req.flash("success_msg", "Please Login");
    }

})

app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        console.log("errrr", err);
    });
    res.redirect("/login");
});


app.get('/api/getchat/:groupname', function (req, res) {
    if (req.session.user) {
        res.render("chat", {
            userName: req.session.user.firstname,
            room: req.params.groupname
        })
    } else {
        res.redirect("/login");
        req.flash("success_msg", "Please Login");
    }

})

app.post('/joingroup', function (req, res) {
    if (req.session.user) {
        var groupName = req.body.room;
        console.log("hitting")
        Group.getGroupByName(groupName)
            .then(gname => {
                if (gname) {
                    res.render("chat", {
                        userName: req.session.user.firstname,
                        room: groupName
                    })
                } else {
                    req.flash("error_msg", "group name is incorrect");
                    res.redirect(req.get("referer"));
                }
            })
            .catch(err => {
                console.log("errrrrrr", err);
            })

    } else {
        res.redirect("/login");
        req.flash("success_msg", "Please Login");
    }

})

