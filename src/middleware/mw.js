const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/db');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var mongooose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var app = express();
cors = require('cors')
var cookieParser = require('cookie-parser');
const path = require('path');



mongooose.connect('mongodb://localhost/database');

app.use('/', express.static(path.join(__dirname, '../../public')))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store:new MongoStore({ mongooseConnection: mongooose.connection }),
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000}
}))


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/signup', function (req, res) {

    db.createAccount(req.body);

    //db.findAccount(req.body.name); //testing purpose
})

app.post('/login', function (req, res) {

    db.checkCredentials(req.body)
        .then((doc) => {
            if (bcrypt.compareSync(req.body.password, doc.password)) {
                req.session.emailID = doc;
                console.log(req.session,req.sessionID);
                return res.status(200).json({ message: 'connected' })
                
                // db.findSession(req.sessionID);
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: 'Wrong credentials' });
        })
})

app.get('/hello',(req,res)=>{
    
        console.log(req.sessionID);
        res.send(req.session);
    
})

app.post('/addnotes', function (req, res) {
    console.log(req.body);
})

app.post('/logout', function (req, res) {
        console.log('logout session id : ', req.sessionID);
        req.session.destroy();

})

/*
//authentication 
function requiresLogin(req, res, next) {
    console.log(req.sessionID);


        return next();
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}
*/

app.listen(3002, function () {
    console.log('Server started')
});
