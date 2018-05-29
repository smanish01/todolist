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
    store: new MongoStore({ mongooseConnection: mongooose.connection }),
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }
}))


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/signup', function (req, res) {

    db.createAccount(req.body);

    //db.findAccount(req.body.name); //testing purpose
})

app.post('/notes1', requiresLogin, function (req, res) {

    console.log('notes req body', req.body.notesId);
    db.findContent(req.body.notesId)
        .then(
            doc => {
                return res.status(200).json({ message: doc })
            }
        )
})

app.post('/login', function (req, res) {


    db.checkCredentials(req.body)
        .then((doc) => {
            if (bcrypt.compareSync(req.body.password, doc.password)) {
                req.session.userId = doc._id;
                console.log(req.session, req.sessionID, req.session.userId);
                return res.status(200).json({ message: 'connected' })
            }
        })
        .catch((err) => {
            return res.status(200).json({ message: 'wrong credentials' })
        })
})

/* testing purpose
app.get('/hello', (req, res) => {

    console.log(req.sessionID);
    console.log(req.session.emailId);
    res.send(req.session);

})
*/

app.post('/addnotes', requiresLogin, function (req, res) {
    console.log(req.body);
    req.body.userId = req.session.userId;
    db.createNotes(req.body);
})

app.post('/checkuser', function (req, res) {

    if ((req.session && req.sessionID) && req.session.userId)
        return res.status(200).json({ message: 'connected' })

})

app.post('/updatenotes', function (req, res) {
    console.log('updates here', req.body);

    req.body.values.map(content => {
        if (content.notesID)
            db.updateContent(content)
        else
            db.createContentByUpdate(content, req.body.notesID)
    })

})

app.post('/viewnotes', requiresLogin, function (req, res) {
    console.log('req id here', req.session.userId)
    db.findNotes(req.session.userId)
        .then(
            (doc) => {
                var docData = [];

                //map the parameter required
                doc.map(
                    (values) => {
                        var docColumn = {
                            _id: values._id,
                            title: values.title
                        }

                        docData.push(docColumn);
                    }
                )
                console.log('docData here', docData);
                return res.status(200).json({ message: docData })
            }

        )
        .catch(err => console.log(err));
})

app.post('/logout', requiresLogin, function (req, res) {
    console.log('logout session id and email : ', req.sessionID, req.session.userId);
    req.session.destroy();

    return res.status(200).json({ message: 'logged out' })

})


function requiresLogin(req, res, next) {
    console.log(req.session, req.sessionID, req.session.userId);
    if ((req.session && req.sessionID) && req.session.userId)
        return next();
    else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);

    }
};


app.listen(3002, function () {
    console.log('Server started')
});
