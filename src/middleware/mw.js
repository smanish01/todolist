const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('../database/db');
const bcrypt = require('bcrypt');
const session = require('express-session');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//allow cors 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.post('/signup', function (req, res) {

    db.createAccount(req.body);

    //db.findAccount(req.body.name); //testing purpose
})

app.post('/login', function (req, res) {

    db.checkCredentials(req.body)
        .then((doc) => {
            if (bcrypt.compareSync(req.body.password, doc.password))
                return res.status(200).json({ message: 'connected' });

        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: 'Wrong credentials' });
        })
})

app.listen(3001);
