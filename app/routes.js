// app/routes.js
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
var upload = require('../config/upload');

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

    app.get('/pageA', isLoggedIn, function(req, res) {
        res.render('insert.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

    app.post('/upload', upload, function(req,res){
        var origin = req.headers.origin;
        res.setHeader("Access-Control-Allow-Origin", origin);

        upload(req,res,function(err) {
            if(err) {
                console.log(err);
                res.json({"error": true, "message": "Fail"});
                //res.send("Error uploading file.");
            } else {
                console.log("success");
                res.json({"error": false, "message": "Success"});
                //res.send("File is uploaded");
            }
        });
    });

    // show the data entry page
    app.get('/dataEntry', isLoggedIn, function(req, res) {
        res.render('insert.ejs', {
            user : req.user, // get the user out of session and pass to template
            message: req.flash('Data Entry Message')
        });
    });

    app.get('/insert', function (req, res) {
        connection.query('USE ' + dbconfig.Upload_db);
        var insertInfo = req.query.statement;
        console.log(insertInfo);

        var insertStatement = "INSERT INTO FAW_Data_Entry VALUES (" + insertInfo + ");";
        console.log(insertStatement);

        var origin = req.headers.origin;
        res.setHeader("Access-Control-Allow-Origin", origin);

        console.log(req.files);

        connection.query(insertStatement, function(err, results, fields) {
            if (err) {
                console.log(err);
                res.send("fail");
                res.end();
            } else {
                res.send("success");
                res.end();
            }
        });
    });

    // show the data query form
    app.get('/dataQuery', isLoggedIn, function(req, res) {
        res.render('query.ejs', {
            user : req.user, // get the user out of session and pass to template
            message: req.flash('Data Query Message')
        });
    });

    app.get('/query', function (req, res) {
        connection.query('USE ' + dbconfig.Upload_db);
        var date = req.query.date;
        console.log(date);

        var queryStatement = "SELECT * FROM FAW_Data_Entry WHERE Date = '" + date + "';";
        console.log(queryStatement);

        var origin = req.headers.origin;
        res.setHeader("Access-Control-Allow-Origin", origin);

        connection.query(queryStatement, function(err, results, fields) {
            //console.log(results);

            var status = [{errStatus: ""}];

            if (err) {
                console.log(err);
                status[0].errStatus = "fail";
                res.send(status);
                res.end();
            } else if (results.length === 0) {
                status[0].errStatus = "no data entry";
                res.send(status);
                res.end();
            } else {
                var JSONresult = JSON.stringify(results, null, "\t");
                //console.log(JSONresult);
                res.send(JSONresult);
                res.end();
            }
        });
    });

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
