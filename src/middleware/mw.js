var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var db = require('../database/db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//allow cors 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/signup', function (req, res) {

    //steps to hash the password
    db.createAccount(req.body);

    //db.findAccount(req.body.name);
})

app.post('/login', function (req, res) {
    
    var result = db.checkCredentials(req.body)
})

app.listen(3001);
