// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 9088;

var passport = require('passport');
var flash    = require('connect-flash');

// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/css", express.static(__dirname + "/css"));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
var options = {
    host: '10.11.4.36',
    port: 3306,
    user: 'SessionManager',
    password: 'SManager$44',
    database: 'session_DB',
    checkExpirationInterval: 60000,// How frequently expired sessions will be cleared; milliseconds.
    expiration: 300000,// The maximum age of a valid session; milliseconds.
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    connectionLimit: 10,// Number of connections when creating a connection pool
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

app.use(session({
    secret: 'Uesei9872',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
    //ttl: (1 * 60 * 60),
    // cookie: {
    //     path: "/",
    //     httpOnly: true,
    //     secure: true,
    //     maxAge: 300000
    // }
 })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);