var express = require('express');
var app = module.exports = express();
var mysql = require("mysql");
var session = require('express-session');
var path = require("path");
var bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);
var async = require("async");
var router = express.Router();
//var cookieSession = require('cookie-session');

app.set('views', path.join(__dirname,'./','views'));
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieSession());

var pool = mysql.createPool({
    connectionLimit : 100,
    host     : '10.11.4.36',
    user     : 'AppUser',
    password : 'Special888%',
    database : 'session_test',
    port    :  3306
});

var sessionStore = new MySQLStore(options);

var options = {
    host: '10.11.4.36',
    port: 3306,
    user: 'SessionManager',
    password: 'SManager$44',
    database: 'session_test',
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
    expiration: 86400000,// The maximum age of a valid session; milliseconds.
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    connectionLimit: 3,// Number of connections when creating a connection pool
    schema: {
        tableName: 'Sessions',
        columnNames: {
            session_id: 'Session_ID',
            expires: 'Expires',
            data: 'Data'
        }
    }
};

// noinspection JSAnnotator
app.use(session({
    key: 'TestSessionKey',
    secret: 'Uesei9872',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    ttl: (1 * 60 * 60),
    name: "test.id",
    cookie: {
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge:  900000
    }
}));


function handle_database(req,type,callback) {
    async.waterfall([
        function(callback) {
            pool.getConnection(function(err,connection){
                if(err) {
                    // if there is error, stop right away.
                    // This will stop the async code execution and goes to last function.
                    callback(true);
                } else {
                    callback(null,connection);
                }
            });
        },
        function(connection,callback) {
            console.log("UEmail: " + req.body.user_email);
            console.log("UPass: " + req.body.user_password);
            var SQLquery;
            switch(type) {
                case "login" :
                    SQLquery = "SELECT * from user_login WHERE user_email='"+req.body.user_email+"' AND `user_password`='"+req.body.user_password+"'";
                    break;
                case "checkEmail" :
                    SQLquery = "SELECT * from user_login WHERE user_email='"+req.body.user_email+"'";
                    break;
                case "register" :
                    SQLquery = "INSERT into user_login(user_email,user_password,user_name) VALUES ('"+req.body.user_email+"','"+req.body.user_password+"','"+req.body.user_name+"')";
                    break;
                case "addStatus" :
                    SQLquery = "INSERT into user_status(user_id,user_status) VALUES ("+req.session.key["user_id"]+",'"+req.body.status+"')";
                    break;
                case "getStatus" :
                    SQLquery = "SELECT * FROM user_status WHERE user_id="+req.session.key["user_id"];
                    break;
                default :
                    break;
            }
            callback(null,connection,SQLquery);
        },
        function(connection,SQLquery,callback) {
            console.log("SQLquery: " + SQLquery);

            connection.query(SQLquery,function(err,rows){
                connection.release();
                if(!err) {
                    if(type === "login") {
                        callback(rows.length === 0 ? false : rows[0]);
                    } else if(type === "getStatus") {
                        callback(rows.length === 0 ? false : rows);
                    } else if(type === "checkEmail") {
                        callback(rows.length === 0 ? false : true);
                    } else {
                        callback(false);
                    }
                } else {
                    // if there is error, stop right away.
                    // This will stop the async code execution and goes to last function.
                    callback(true);
                }
            });
        }],
    function(result){
        console.log("Result UName: " + result.user_name);

        // This function gets call after every async task finished.
        if(typeof(result) === "boolean" && result === true) {
            callback(null);
        } else {
            callback(result);
        }
    });
}

router.get('/',function(req,res){
    console.log("Welcome /");
    res.render('index.html')
});

router.post('/login',function(req,res){
    console.log("Welcome /login");

    handle_database(req,"login",function(response){
        console.log("/login Response: " + response);

        if(response === null) {
            res.json({"error" : "true","message" : "Database error occured"});
        } else {
            if(!response) {
                res.json({
                    "error" : "true",
                    "message" : "Login failed ! Please register"
                });
            } else {
                req.session.key = response;

                console.log("Req Session Key User_Name: " + req.session.key.user_name);
                // req.session.save(function(err) {
                //     if(err) {
                //         throw err
                //     } else {
                //         console.log("Req Session Saved!")
                //     }// session saved
                // });
                res.json({"error" : false,"message" : "Login success."});
            }
        }
    });
});

router.get('/home',function(req,res){
    console.log("2nd Request");
    console.log("2nd Req Session ID: " + req.session.id);
    //console.log("2nd Req: " + req.session.key.user_name);

    if(req.session.key) {
        //res.render("home.html",{ email : req.session.key["user_name"]});
        res.render("aaa.html");
    } else {
        //res.redirect("/");
        res.render("bbb.html");
    }

    // req.session.save(function(err) {
    //     if(err) throw err;// session saved
    // });
});

// router.get("/fetchStatus",function(req,res){
//     if(req.session.key) {
//         handle_database(req,"getStatus",function(response){
//             if(!response) {
//                 res.json({"error" : false, "message" : "There is no status to show."});
//             } else {
//                 res.json({"error" : false, "message" : response});
//             }
//         });
//     } else {
//         res.json({"error" : true, "message" : "Please login first."});
//     }
// });
//
// router.post("/addStatus",function(req,res){
//     if(req.session.key) {
//         handle_database(req,"addStatus",function(response){
//             if(!response) {
//                 res.json({"error" : false, "message" : "Status is added."});
//             } else {
//                 res.json({"error" : false, "message" : "Error while adding Status"});
//             }
//         });
//     } else {
//         res.json({"error" : true, "message" : "Please login first."});
//     }
// });
//
// router.post("/register",function(req,res){
//     handle_database(req,"checkEmail",function(response){
//         if(response === null) {
//             res.json({"error" : true, "message" : "This email is already present"});
//         } else {
//             handle_database(req,"register",function(response){
//                 if(response === null) {
//                     res.json({"error" : true , "message" : "Error while adding user."});
//                 } else {
//                     res.json({"error" : false, "message" : "Registered successfully."});
//                 }
//             });
//         }
//     });
// });

router.get('/logout',function(req,res){
    if(req.session.key) {
        req.session.destroy(function(){
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

app.use('/',router);

app.listen(3003,function(){
    console.log("I am running at 3003");
});