var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database');

userTableModel.find({name : 'manish'}, function(err,doc)
{
    if(err) throw err

    console.log(doc);
})