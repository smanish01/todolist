const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database');
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)

var contentTableSchema = new mongoose.Schema({
    // the id of the note it is present in
    notesID: String,
    content: String,
    isChecked: {
        type: Boolean,
        default: false
    }

})

var contentTableModel = mongoose.model('contentTableModel', contentTableSchema);


exports.createContent = function (contentArray) {
    return contentTableModel.insertMany(contentArray);
}

exports.updateContent = function (contentObj) {

    var query = { '_id': contentObj._id };
    newContentObj = contentObj;
    return contentTableModel.findOneAndUpdate(query, newContentObj, { upsert: true }, function (err, doc) {
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
    return createContents.save(function (err, contentData) {
        if (err) throw err
        console.log(contentData)
    });
}


exports.deleteContent = function (id) {
    return contentTableModel.deleteOne({ _id: id }, function (err) {
        if (err) throw err
        // deleted at most one document
    });
}

exports.findContent = function (notesId) {

    return contentTableModel.find({ notesID: notesId }, (err, doc) => {
        if (err) throw err
        console.log('find contents here', doc);
    })
}