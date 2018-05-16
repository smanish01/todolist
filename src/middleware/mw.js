var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
const create = require('./db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//allow cors 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/', function (req, res) {
    create(req.body);
})

app.listen(3001);
