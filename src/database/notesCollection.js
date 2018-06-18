const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database');
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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

var notesTableModel = mongoose.model('notesTableModel', notesTableSchema);

exports.createNotes = function (notesObj) {
    console.log(notesObj);

    //creating notes objects

    var createNotes =
        {
            uId: notesObj.userId,
            title: notesObj.notes,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

    return notesTableModel.create(createNotes)

}


exports.findNotes = function (userId) {

    return notesTableModel.find({ uId: userId, deletedAt: null })
}


exports.findNotesTitle = function (notesId, userId) {

    return notesTableModel.findOne({ uId: userId, _id: notesId }, (err, doc) => {
        if (err) throw err
        console.log('find notes here', doc);
    })
}

exports.updateNotesTitle = function (notesId, notesTitle) {
    var query = { '_id': notesId };
    return notesTableModel.findByIdAndUpdate(query, { title: notesTitle, updatedAt: Date.now() }, (err, doc) => {
        if (err) throw err
        console.log('update notes here', doc);
    })
}

exports.deleteNotes = function (id) {
    return notesTableModel.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: Date.now() }, function (err) {
        if (err) throw err
        // deleted at most one document
    });
}