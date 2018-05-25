const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database');

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

var notesTableModel = mongoose.model('notesTableModel', notesTableSchema);

notesTableModel.findOne({ uId: "5b06b1e901924d59047f9bf7" }).populate()
        console.log('find notes here', doc);
    })
