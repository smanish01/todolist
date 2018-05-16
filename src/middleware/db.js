var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/database');

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

exports.create = function (userObj) {
    var createData = new userTableModel(userObj);
    console.log(createData);
}


