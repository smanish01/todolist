const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost/database');
const saltRounds = 10;

//defining the schema
var userTableSchema = new mongoose.Schema({

    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: String,
    emailId: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    // 'password' will be hashed 
    password: {
        type: String,
        required: true,
    },
    profilePhoto: Buffer
})

var notesTableSchema = new mongoose.Schema({

    // id of the owner
    uId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userTableModel'
    },
    title: String,
    date: { type: Date, default: Date.now() },
    isDeleted: {
        type: Boolean,
        default: false
    },
    //collaborators of the note
    sharedWith: Array

})

var contentTableSchema = new mongoose.Schema({

    // the id of the note it is present in
    notesID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notesTableModel'
    },
    content: String,
    isChecked: {
        type: Boolean,
        default: false
    }

})

//defining the model
var userTableModel = mongoose.model('userTableModel', userTableSchema);
var notesTableModel = mongoose.model('notesTableModel', notesTableSchema);
var contentTableModel = mongoose.model('contentTableModel', contentTableSchema);



exports.createAccount = function (userObj) {

    userObj.password = bcrypt.hashSync(userObj.password, saltRounds);;
    // console.log(userObj);
    var createAccount = new userTableModel(userObj);
    createAccount.save(function (err) {
        if (err) return handleError(err);
        // saved!
    });

}

exports.createNotes = function (notesObj) {
    console.log(notesObj);

    //creating notes objects

    var notesObjDatabase = {
        uId: notesObj.userId,
        title: notesObj.notes
    };


    var createNotes = new notesTableModel(notesObjDatabase);
    createNotes.save(function (err, notesData) {

        if (err) return handleError(err);

        //map the notesObj.values for content values

        notesObj.values.map(
            (values) => {

                var contentObjDatabase = {
                    notesID: notesData._id,
                    content: values.content

                };

                console.log('contentObjDatabase here :', contentObjDatabase)

                var createContents = new contentTableModel(contentObjDatabase);
                createContents.save(function (err, contentData) {
                    if (err) return handleError(err);
                    console.log(contentData)
                });
            }
        )

    });

}

//testing purpose
// exports.findAccount = function (name) {
//     userTableModel.find({ name: name }, (err, doc) => {
//         if (err) throw err
//         console.log(doc);
//     })
// }

exports.checkCredentials = function (userObj) {
    return userTableModel.findOne({ emailId: userObj.emailId }).exec();
}

exports.findNotes = function (userId) {
    //isDeleted: false soft delete
    return notesTableModel.find({ uId: userId, isDeleted: false }, (err, doc) => {
        if (err) throw err
        console.log('find notes here', doc);
    })
}

exports.findContent = function (notesId) {
    return contentTableModel.find({notesID : notesId}, (err,doc) => {
        if (err) throw err
        console.log('find contents here', doc);
    })
}

exports.updateContent = function(contentObj) {

    contentTableModel.findById(contentObj._id, function (err, content) {
        if (err) return handleError(err);
      
        content.content = contentObj.content;
        content.isChecked = contentObj.isChecked;
        content.save(function (err, updatedContent) {
          if (err) return handleError(err);
        //   res.send(updatedTank);
        console.log(updatedContent);
        });
      });

} 

exports.createContentByUpdate = function(contentObj, notesID) {

    var contentObjDatabase = {
        notesID: notesID,
        content: contentObj.content,
        isChecked: contentObj.isChecked

    };

    console.log('contentObjDatabase here :', contentObjDatabase)

    var createContents = new contentTableModel(contentObjDatabase);
    createContents.save(function (err, contentData) {
        if (err) return handleError(err);
        console.log(contentData)
    });

}
