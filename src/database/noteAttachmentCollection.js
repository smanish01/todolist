const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database');
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var noteAttachmentSchemaHandle = new mongoose.Schema({
    imageId: String,
    uId: String,
    notesID: String,
    originalName: String,
    savedName: String,
    mimeType: String
})

//defining the model
var noteAttachmentModel = mongoose.model('noteAttachmentModel', noteAttachmentSchemaHandle);

exports.createFiles = function (imageId, userId, notesId, originalname, newFilename, mimetype) {

    let fileObjDatabase = {
        imageId: imageId,
        uId: userId,
        notesID: notesId,
        originalName: originalname,
        savedName: newFilename,
        mimeType: mimetype
    }

    // let fileObj = new noteAttachmentModel(fileObjDatabase);

    return noteAttachmentModel.create(fileObjDatabase)
}

exports.findImageContent = function (notesId) {
    return noteAttachmentModel.find({ notesID: notesId })
}

exports.deleteImage = function(imageId){
    return noteAttachmentModel.deleteOne({imageId : imageId})
}