const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost/database');
const saltRounds = 10;
mongoose.Promise = Promise;



//defining the schema
var userTableSchema = new mongoose.Schema({

    userName: String,
    name: String,
    emailId: {
        type: String,
        unique: true
    },
    // 'password' will be hashed 
    password: String,
    profilePhoto: Buffer
})


var notesTableSchema = new mongoose.Schema({

    // id of the owner
    uId: String,
    title: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: Date,
    deletedAt: Date,
    //collaborators of the note
    sharedWith: Array

})



var contentTableSchema = new mongoose.Schema({

    // the id of the note it is present in
    notesID: String,
    content: String,
    isChecked: {
        type: Boolean,
        default: false
    }

})

var noteAttachmentSchemaHandle = new mongoose.Schema({
    imageId: String,
    uId: String,
    notesID: String,
    originalName: String,
    savedName: String,
    mimeType: String
})



//defining the model
var userTableModel = mongoose.model('userTableModel', userTableSchema);
var notesTableModel = mongoose.model('notesTableModel', notesTableSchema);
var contentTableModel = mongoose.model('contentTableModel', contentTableSchema);
var noteAttachmentModel = mongoose.model('noteAttachmentModel', noteAttachmentSchemaHandle);




exports.createAccount = function (userObj) {

    userObj.password = bcrypt.hashSync(userObj.password, saltRounds);
    // console.log(userObj);
    var createAccount = new userTableModel(userObj);
    createAccount.save(function (err) {
        if (err) throw err
        // saved!
    });

}


exports.createFiles = function (imageId, userId, notesId, originalname, newFilename, mimetype) {

    let fileObjDatabase = {
        imageId: imageId,
        uId: userId,
        originalName: originalname,
        savedName: newFilename,
        mimeType: mimetype
    }

    let fileObj = new noteAttachmentModel(fileObjDatabase);

    fileObj.save(function (err, fileData) {

        //files save
    })

    return fileObj.imageId;
}

exports.createNotes = function (notesObj) {
    console.log(notesObj);

    //creating notes objects

    var notesObjDatabase = {
        uId: notesObj.userId,
        title: notesObj.notes,
        createdAt: Date.now(),
        updatedAt: Date.now()

    };


    var createNotes = new notesTableModel(notesObjDatabase);
    createNotes.save(function (err, notesData) {

        if (err) throw err

        //map the notesObj.values for content values

        notesObj.values.map(
            (values) => {

                var contentObjDatabase = {
                    notesID: notesData._id,
                    content: values.content,
                    isChecked: values.isChecked

                };

                console.log('contentObjDatabase here :', contentObjDatabase)

                var createContents = new contentTableModel(contentObjDatabase);
                createContents.save(function (err, contentData) {
                    if (err) return handleError(err);
                    console.log(contentData)
                });
            }
        )

    })


    return createNotes

}

exports.findImageContent = function(notesId) {
    return noteAttachmentModel.find({notesID:notesId}).exec()
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

    return notesTableModel.find({ uId: userId, deletedAt: null }, (err, doc) => {
        if (err) throw err
        console.log('find notes here', doc);
    })
}

exports.findContent = function (notesId) {

    return contentTableModel.find({ notesID: notesId }, (err, doc) => {
        if (err) throw err
        console.log('find contents here', doc);
    })
}

exports.findNotesTitle = function (notesId, userId) {

    return notesTableModel.findOne({ uId: userId, _id: notesId }, (err, doc) => {
        if (err) throw err
        console.log('find notes here', doc);
    })
}

exports.updateNotesTitle = function (notesId, notesTitle) {
    var query = { '_id': notesId };
    notesTableModel.findByIdAndUpdate(query, { title: notesTitle, updatedAt: Date.now() }, (err, doc) => {
        if (err) throw err
        console.log('update notes here', doc);
    })
}

// exports.updateContent = function(contentObj) {

//     contentTableModel.findById(contentObj._id, function (err, content) {
//         if (err) return handleError(err);

//         content.content = contentObj.content;
//         content.isChecked = contentObj.isChecked;
//         content.save(function (err, updatedContent) {
//           if (err) return handleError(err);
//         //   res.send(updatedTank);
//         console.log(updatedContent);
//         });
//       });

// } 

exports.updateContent = function (contentObj) {

    var query = { '_id': contentObj._id };
    newContentObj = contentObj;
    contentTableModel.findOneAndUpdate(query, newContentObj, { upsert: true }, function (err, doc) {
        if (err) throw err
        console.log(doc);
        // return res.send("succesfully saved");
    });

}

exports.createContentByUpdate = function (contentObj, notesID) {

    var contentObjDatabase = {
        notesID: notesID,
        content: contentObj.content,
        isChecked: contentObj.isChecked

    };

    console.log('contentObjDatabase here :', contentObjDatabase)

    var createContents = new contentTableModel(contentObjDatabase);
    createContents.save(function (err, contentData) {
        if (err) throw err
        console.log(contentData)
    });
}


exports.deleteContent = function (id) {
    contentTableModel.deleteOne({ _id: id }, function (err) {
        if (err) throw err
        // deleted at most one document
    });
}

exports.deleteNotes = function (id) {
    notesTableModel.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: Date.now() }, function (err) {
        if (err) throw err
        // deleted at most one document
    });
}

exports.findUserInfo = function (id) {
    return userTableModel.findOne({ _id: id }).exec();
}

exports.changePassword = function (id, newPassword) {

    return userTableModel.findOneAndUpdate(id, { password: bcrypt.hashSync(newPassword, saltRounds) }, function (err, doc) {
        console.log(doc);
    })

}

exports.checkEmail = function (emailId) {
    return userTableModel.findOne({ emailId: emailId }).exec();
}