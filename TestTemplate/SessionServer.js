var express = require('express');
var app = module.exports = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);
//var cookieSession = require('cookie-session');

//var app = express();


// app.set('views', __dirname + '/views');
// app.engine('html', require('ejs').renderFile);
//
// app.use(session({
//     secret: 'ssshhhhh',
//     name: 'cookie_name',
//     proxy: true,
//     resave: true,
//     saveUninitialized: true,
//
// }));
//

var sess;

var options = {
    host: '10.11.4.36',
    port: 3306,
    user: 'SessionManager',
    password: 'SManager$44',
    database: 'session_DB',
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

var sessionStore = new MySQLStore(options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    key: 'TestSessionKey',
    secret: 'Uesei9872',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: "test.id",
    ttl: (1 * 60 * 60),
    cookie: {
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge:  90000
    }
}));

//app.use(cookieSession());
//app.use(app.router);


app.post('/login',function(req,res){
    console.log(req.body.email);
    sess = req.session;
    console.log("/login session ID:" + sess.id);
    console.log("sess0:" + JSON.stringify(sess, null, "\t"));
    // console.log("req.cookie:" + JSON.stringify(req.cookie, null, "\t"));

//In this we are assigning email to sess.email variable.
//email comes from HTML page.
    sess.email=req.body.email;
//    sess.cookie.name = req.body.email;
    //sess.cookie.pass = req.body.pass;
    console.log("sess1:" + JSON.stringify(sess, null, "\t"));
    //req.session.email=req.body.email;
    //console.log(req.session);
    //res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
    var origin = req.headers.origin;
    res.setHeader("Access-Control-Allow-Origin", origin);
    // //res.writeHeader(200, {"Set-Cookie": "email=" + req.body.email});
    res.cookie;
    // console.log("req.cookieName:" + req.session.cookie.name);
    // console.log("req.cookieValue:" + req.session.cookie.value);
    // console.log("req.cookieMaxAge:" + req.session.cookie.maxAge);
    res.end('done');
});

app.get('/admin',function(req,res){
    //sess = req.session;
    //console.log("sess /admin:" + JSON.stringify(sess, null, "\t"));
    console.log("req.session /admin:" + JSON.stringify(req.session, null, "\t"));
    console.log("/admin session ID:" + sess.id);
    if(sess.email) {
        res.write("<h1>Hello " + sess.email + "</h1>");
        res.end('<a href="+">Logout</a>');
    } else {
        res.write("<h1>Please login first.</h1>");
        res.end('<a href="+">Login</a>');
    }
});

app.get('/logout',function(req,res){
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });

});

app.get('/',function(req,res){
    sess = req.session;
//Session set when user Request our app via URL
    if(sess.email) {
        /*
         * This line check Session existence.
         * If it existed will do some action.
         */
        res.redirect('/admin');
    }
    else {
        res.render('index.html');
    }
});


app.listen(3003,function(){
    console.log("App Started on PORT 3003");
});