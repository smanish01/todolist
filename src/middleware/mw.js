const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var mongooose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var app = express();
cors = require('cors')
var cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

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

        db.createFiles(imageId, req.session.userId,req.session.notesId,file.originalname,newFilename,file.mimetype);

        console.log(req.session.imageIds)
    },
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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.post('/signup', function (req, res) {

    db.createAccount(req.body);

    res.end()
    //db.findAccount(req.body.name); //testing purpose
})

app.post('/fileupload', requiresLogin, upload.array('selectedFile'), (req, res) => {

    res.status(200).json({message11: req.session.imageIds})

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
                                    console.log('imge doc here => #########################3333333333',imageDoc)

                                    return res.status(200).json({ message: doc, message1: notesTitle ,message2: imageDoc}) 
                                }     
                            )
                        }
                    )
            }
        }
    )
})


app.get('/assets/:imageId',function(req,res) {

    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',req.params.imageId)
    
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
})



app.post('/login', function (req, res) {


    db.checkCredentials(req.body)
        .then((doc) => {
            if (bcrypt.compareSync(req.body.password, doc.password)) {
                req.session.userId = doc._id;
                req.session.imageIds = [];
                console.log(req.session, req.sessionID, req.session.userId);
                return res.status(200).json({ message: 'connected' })
            }
            else
                return res.status(200).json({ message: 'wrong credentials' })
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

    let notesId = db.createNotes(req.body)

    console.log('notes id here ------------------------------>>>>>>>>>>> #############', notesId)
    req.session.notesId = notesId;
    res.status(200).json({ message :  notesId})

})

app.post('/checkuser', function (req, res) {

    if ((req.session && req.sessionID) && req.session.userId)
        return res.status(200).json({ message: 'connected' })

})

app.delete('/deletenotes/:id', requiresLogin,function (req, res) {

    db.deleteNotes(req.params.id)

    res.end()
})

app.put('/updatenotes', requiresLogin,function (req, res) {
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

    res.end()
})


app.get('/viewnotes', requiresLogin, function (req, res) {
    console.log('req id here', req.session.userId)
    db.findNotes(req.session.userId)
        .then(
            (doc) => {
                console.log('date doc here', doc)
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
        .catch(err => console.log(err));
})

app.post('/logout', requiresLogin, function (req, res) {
    console.log('logout session id and email : ', req.sessionID, req.session.userId);
    req.session.destroy();

    return res.status(200).json({ message: 'logged out' })

})

app.post('/changepassword', requiresLogin, function (req, res) {

    var userObj = req.body.userInfo

    console.log(userObj)

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
        .catch((err) => {
            console.log(err)
        })

})

app.all('*',requiresLogin, function (req, res) {
    let indexPath = path.resolve(__dirname + '/../../public/index.html')
    res.sendFile(indexPath)
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
