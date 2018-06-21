const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/db');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');
const MongoDBStore = require('connect-mongodb-session')(session);
var mongooose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var app = express();
cors = require('cors')
var cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

var passport = require('passport')
    , TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
    consumerKey: 'pvotWMSqluRhCekNauhrfzVIi',
    consumerSecret: 'sb0stm2Ha01lJl7AYx7bcAFBpLc63Y4m7OZHg72gS7IqojaMXP',
    callbackURL: "http://localhost:3002/auth/twitter/callback",
    includeEmail: true
},
    function (token, tokenSecret, profile, done) {
        if (profile) {

            user = profile;
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets');
    },
    filename: (req, file, cb) => {

        let imageId = uuidv4()

        const newFilename = `${imageId}`;

        console.log('old file name-----------------------------------', file)
        console.log('new file name$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$444', newFilename)
        console.log('new file name$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$444', imageId)
        console.log('extenam here', file.mimetype)

        cb(null, newFilename);

        db.createFiles(imageId, req.session.userId, req.params.notesId, file.originalname, newFilename, file.mimetype)
    }
});

// create the multer instance that will be used to upload/save the file
const upload = multer({ storage });

mongooose.connect('mongodb://localhost/database');

app.use('/', express.static(path.join(__dirname, '../../public')))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongooose.connection }),
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }
}))

app.use(passport.initialize());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.post('/createaccount', function (req, res) {

    db.createAccount(req.body)
        .then(
            doc => {
                return res.status(200).json({ message: doc })
            }
        )
        .catch(
            err => {
                return res.status(400).json({ message: err })
            }
        )
    //db.findAccount(req.body.name); //testing purpose
})

app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
// app.get('/auth/twitter/callback',
//     passport.authenticate('twitter', {
//         successRedirect: '/viewnote',
//         failureRedirect: '/',
//     }));

app.get('/auth/twitter/callback',
    function (req, res, next) {
        passport.authenticate('twitter', function (err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/'); }
            req.logIn(user, { session: false }, function (err) {
                if (err) { return next(err); }


                console.log('in callback user info here ->>>>>>>>>>>>>>>>>>>>.', user.emails[0].value)

                db.findOrCreateUser(user.emails[0].value)
                    .then(

                        doc => {
                            
                            req.session.userId = doc.doc._id
                            return res.redirect('/viewnote');

                        }

                    )
                    .catch(
                        err => {
                            console.log('error: ', err)
                        }
                    )

            });
        })(req, res, next)
    });


app.post('/fileupload/:notesId', requiresLogin, upload.array('selectedFile'), (req, res) => {

    console.log('req param notesid here->>>>>>>>>>@@@@@@@@@@@@@############', req.param.notesId)


    db.findImageContent(req.params.notesId).then(
        imageDoc => {

            console.log('imagedoc here ->>%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%###########', imageDoc)
            return res.status(200).json({ message11: imageDoc })
        }

    )
        .catch(
            err => {
                return res.status(400).json({ message11: err })
            }
        )
});



app.get('/notes1/:notesId', requiresLogin, function (req, res) {

    console.log('notes req params here', req.params.notesId);
    db.findNotesTitle(req.params.notesId, req.session.userId).then(
        notesTitle => {

            if (notesTitle == null)
                return res.status(401).json({ message: 'no notes found' })
            else {
                db.findContent(req.params.notesId)
                    .then(
                        doc => {
                            db.findImageContent(req.params.notesId)
                                .then(
                                    imageDoc => {
                                        console.log('imge doc here => #########################3333333333', imageDoc)

                                        return res.status(200).json({ message: doc, message1: notesTitle, message2: imageDoc })
                                    }
                                )
                        }
                    )
            }
        }
    )
        .catch(
            err => {
                return res.status(400).json({ message: err })
            }
        )
})


app.get('/assets/:imageId', requiresLogin, function (req, res) {

    // console.log('res file here->>>>>>>>>>>>>>>>>>>>',res.sendFile(req.params.imageId, { root: path.join(__dirname, './assets') })) 
    res.sendFile(__dirname + "/assets/" + req.params.imageId)
    // fs.readFile(__dirname + "/assets/" + req.params.imageId, "utf8", function(err, data){
    //     if(err) throw err;
    //     res.send(data)

    // });

})

app.get('/userinfo', requiresLogin, function (req, res) {

    db.findUserInfo(req.session.userId)
        .then(
            doc => {
                if (doc == null)
                    return res.status(400).json({ message: 'user info not found' })
                else {

                    console.log(doc);

                    var userDoc = {
                        name: doc.name,
                        emailId: doc.emailId,
                        userName: doc.userName
                    }

                    return res.status(200).json({ message: userDoc })
                }
            }
        )
        .catch(
            err => {
                return res.status(400).json({ message: err })
            }
        )
})

app.delete('/deleteimage/:imageId', requiresLogin, function (req, res) {

    db.deleteImage(req.params.imageId)
        .then(
            doc => {

                fs.unlink(__dirname + "/assets/" + req.params.imageId, function (error) {
                    if (error) {
                        throw error;
                    }
                    console.log('Deleted image!!');
                });

                return res.status(200).json({ message: doc })
            }

        )
        .catch(
            err => {
                return res.status(400).json({ message: err })
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

app.post('/checkemailid', function (req, res) {
    // console.log(req.body.emailId)
    db.checkEmail(req.body.emailId)
        .then(

            doc => {
                if (doc == null)
                    res.status(200).json({ message: 'not there' });
                else if (doc.emailId == req.body.emailId)
                    res.status(200).json({ message: 'already' });
            }

        )
        .catch(
            err => {
                return res.status(400).json({ message: err })
            }
        )
})


/* testing purpose
app.get('/hello', (req, res) => {
viewnotes
    console.log(req.sessionID);
    console.log(req.session.userId);
    res.send(req.session);

})
*/

app.post('/addnotes', requiresLogin, function (req, res) {
    console.log('add notes req.body ->>>>>>>>>>>>>>>>>>$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', req.body);


    console.log('in addnotes req.session.userId ->>>>>>>>>>>>>>>>>>>>>>>>>>>>', req.session.userId)

    req.body.userId = req.session.userId;

    var contentAray = req.body.values;

    db.createNotes(req.body)
        .then(
            (notesBody) => {

                contentAray.map(
                    content => {
                        content.notesID = notesBody._id
                    }
                )

                if (contentAray.length > 0) {
                    db.createContent(contentAray)
                        .then(
                            doc => {
                                return res.status(200).json({ message: notesBody._id })

                            }
                        )
                        .catch(
                            (err) => {
                                return res.status(400).json({ message: err })
                            }

                        )
                }
                else
                    return res.status(200).json({ message: notesBody._id })

            }
        )
        .catch(
            err => {
                // return res.status(400).json({ message: err })
                console.log('err here------->>>>>>>>>>>>>%%%%%%%%%%%%%%%%%%%%%%%%', err)
            }
        )
})

app.post('/checkuser', function (req, res) {

    // console.log('req.session here ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',req.session)

    if ((req.session && req.sessionID) && req.session.userId)
        return res.status(200).json({ message: 'connected' })
    else
        return res.status(400).json({ message: 'not connected' })

})

app.delete('/deletenotes/:id', requiresLogin, function (req, res) {

    db.deleteNotes(req.params.id)
        .then(
            doc => {
                return res.status(200).json({ deletedNotes: doc })
            }
        )
})

app.put('/updatenotes', requiresLogin, function (req, res) {
    console.log('updates here', req.body);

    req.body.deletedContent.map(
        id => db.deleteContent(id)
    )

    req.body.values.map(content => {
        if (content.notesID)
            db.updateContent(content)
        else
            db.createContentByUpdate(content, req.body.notesID)
    })

    db.updateNotesTitle(req.body.notesID, req.body.notesTitle)
})


app.get('/viewnotes', requiresLogin, function (req, res) {

    db.findNotes(req.session.userId)
        .then(
            (doc) => {
                var docData = [];

                //map the parameter required
                doc.map(
                    (values) => {
                        var docColumn = {
                            _id: values._id,
                            title: values.title,
                            createdAt: values.createdAt,
                            updatedAt: values.updatedAt
                        }
                        docData.push(docColumn);
                    }
                )
                console.log('docData here', docData);
                return res.status(200).json({ message: docData })
            }

        )
        .catch(
            err => {
                return res.status(400).json({ message: err })
            }
        )
})

app.post('/logout', requiresLogin, function (req, res) {
    console.log('logout session id and userId : ', req.sessionID, req.session.userId);
    req.session.destroy();
    console.log('after logout session id and email : ', req.session);

    return res.status(200).json({ message: 'logged out' })

})

app.post('/changepassword', requiresLogin, function (req, res) {

    var userObj = req.body.userInfo

    var currentPassword = req.body.values.currentPassword

    var newPassword = req.body.values.newPassword

    db.checkCredentials(userObj)
        .then((doc) => {
            if (bcrypt.compareSync(currentPassword, doc.password)) {

                db.changePassword(req.session.userId, newPassword)
                    .then(doc => {
                        if (doc != null)
                            return res.status(200).json({ message: 'changed' })
                    })
            }
            else
                return res.status(200).json({ message: 'not changed' })
        })
        .catch(
            err => {
                return res.status(400).json({ message: err })
            }
        )

})


function requiresLogin(req, res, next) {

    if ((req.session && req.sessionID) && req.session.userId)
        return next()
    else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);

    }

};

app.all('*', function (req, res) {
    let indexPath = path.resolve(__dirname + '/../../public/index.html')
    res.sendFile(indexPath)
})

app.listen(3002, function () {
    console.log('Server started')
});
