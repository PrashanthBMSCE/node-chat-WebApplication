var app = require('../server')
var Auth = require('../lib/task_functions/auth');
var AppHelper = require('../lib/task_functions/apphelper')
console.log('hdjhbdjsa')
app.get('/login', function (req, res) {
    res.render('login');
})


app.get('/', function (req, res) {
    if (req.session.user) {
        res.redirect('chat')
    } else {
        res.redirect('/login')
    }
})
app.post('/api/login', function (req, res) {
    var loginCreds = {
        emailid: req.body.emailid,
        password: req.body.password
    }
    Auth.logIn(loginCreds)
        .then(user => {
            req.session.user = user
            res.redirect('/chat')
            // req.flash("success_msg", "successfully logged in");
            // res.redirect(req.get("referer"));

        })
        .catch(err => {
            req.flash("error_msg", err.message);
            res.redirect(req.get("referer"));
        })

})

app.get('/chat', function (req, res) {
    if (req.session.user) {
        //res.render("chatindex");
        res.render('chatindex')
    } else {
        req.flash("success_msg", "pleaseLogin");
        res.redirect("/login");
    }

})
app.get('/register', function (req, res) {
    res.render('register');

})

app.post('/api/register', function (req, res) {
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


app.get('/chatjs', function (req, res) {
    console.log("roooo", req.params);
    if (req.session.user) {
        //res.render("chat")
        res.render("chat", {
            userName: req.session.user.firstname,
            room: req.params.room
        });
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