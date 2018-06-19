const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')
mongoose.connect('mongodb://localhost/database');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');
const saltRounds = 10;
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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

userTableSchema.plugin(findOrCreate);

const userTableModel = mongoose.model('userTableModel', userTableSchema);

exports.createAccount = function (userObj) {
    userObj.password = bcrypt.hashSync(userObj.password, saltRounds);
    // console.log(userObj);
    // var createAccount = new userTableModel(userObj);
    return userTableModel.create(userObj)
}

exports.checkCredentials = function (userObj) {
    return userTableModel.findOne({ emailId: userObj.emailId })
}

exports.findUserInfo = function (id) {
    return userTableModel.findOne({ _id: id });
}

exports.changePassword = function (id, newPassword) {
    return userTableModel.findOneAndUpdate(id, { password: bcrypt.hashSync(newPassword, saltRounds) })
}

exports.checkEmail = function (emailId) {
    return userTableModel.findOne({ emailId: emailId });
}

exports.findOrCreateUser = function(emailId) {
    return userTableModel.findOrCreate({emailId: emailId})
}