/**
 * Created by imacbig04 on 9/6/17.
 */
var express = require('express');
var app = express();
var mysql = require('mysql');
var multer = require('multer');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
    multipleStatements: true,
    host: '10.11.4.36',
    user: 'AppUser',
    password: 'Special888%',
    database: 'FAO'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '/Users/imacbig02/Desktop/Test');
    },
    filename: function (req, file, callback) {
        //console.log(file.fieldname + " " + file.originalname);
        callback(null, file.fieldname + '-' + file.originalname);
    }
});
//var upload = multer({ storage : storage}).any('userPhoto');
var upload = multer({ storage : storage}).any();

app.post('/upload', upload, function(req,res){
    var origin = req.headers.origin;
    res.setHeader("Access-Control-Allow-Origin", origin);
    // var filesReceived = JSON.stringify(req.files);
    // console.log(req.files.fieldname);
    // console.log(req.body);

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

app.get('/insert', function (req, res) {
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


app.get('/query', function (req, res) {
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


var server = app.listen(9088, function () {
    "use strict";
    var host = server.address().address;
    var port = server.address().port;
    console.log("The app is listening at http://%s:%s", host, port)
});