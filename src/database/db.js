var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database');
var bcrypt = require('bcrypt');
var Promise = require("bluebird");
const saltRounds = 10;

//defining the schema
var userTableSchema = new mongoose.Schema({

    userName: String,
    name: String,
    emailId: String,
    // 'password' will be hashed 
    password: String,
    profilePhoto: Buffer,
    // the token of the user
    sessionId: String

})

var notesTableSchema = new mongoose.Schema({

    // id of the owner
    uId: String,
    title: String,
    date: Date,
    isDeleted: Boolean,
    //collaborators of the note
    sharedWith: Array

})

var contentTableSchema = new mongoose.Schema({

    // the id of the note it is present in
    notesID: String,
    content: String,
    isChecked: Boolean

})


//defining the model
var userTableModel = mongoose.model('userTableModel', userTableSchema);
var notesTableModel = mongoose.model('notesTableModel', notesTableSchema);
var contentTableModel = mongoose.model('contentTableModel', contentTableSchema);

//exporting the functions

exports.createAccount = function (userObj) {

    userObj.password = bcrypt.hashSync(userObj.password, saltRounds);;
    console.log(userObj);
    var createData = new userTableModel(userObj);
    createData.save(function (err) {
        if (err) return handleError(err);
        // saved!
    });

}

exports.findAccount = function (name) {
    userTableModel.find({ name: name }, (err, doc) => {
        if (err) throw err
        console.log(doc);
    })
}

exports.checkCredentials = function (userObj) {

    userTableModel.findOne({ userName: userObj.userName })
        .then(res => {
            result = bcrypt.compareSync(userObj.password, res.password);
        }).catch(err => console.log(err)).exec();

}
