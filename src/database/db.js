const userCollection = require('../database/userCollection')
const notesCollection = require('../database/notesCollection');
const contentCollection = require('../database/contentCollection')
const noteAttachmentCollection = require('../database/noteAttachmentCollection')

/*****************user functions start *********************************************************/

exports.createAccount = function (userObj) {
    return userCollection.createAccount(userObj);
}

exports.findUserInfo = function (id) {
    return userCollection.findUserInfo(id)
}

exports.changePassword = function (id, newPassword) {
    return userCollection.changePassword(id, newPassword);
}

exports.checkCredentials = function (userObj) {
    return userCollection.checkCredentials(userObj)
}

exports.checkEmail = function (emailId) {
    return userCollection.checkEmail(emailId);
}

exports.findOrCreateUser = function(emailId){
    return userCollection.findOrCreateUser(emailId);
}

/*****************user functions ends *********************************************************/


/************************************notes function starts *********************************************/
exports.createNotes = function (notesObj) {
    return notesCollection.createNotes(notesObj)
}

exports.findNotes = function (userId) {
    return notesCollection.findNotes(userId);
}

exports.findNotesTitle = function (notesId, userId) {
    return notesCollection.findNotesTitle(notesId, userId)
}

exports.updateNotesTitle = function (notesId, notesTitle) {
    return notesCollection.updateNotesTitle(notesId, notesTitle);
}

exports.deleteNotes = function (id) {
    return notesCollection.deleteNotes(id)
}

/************************************notes function ends *********************************************/



/************************************content function starts *********************************************/

exports.createContent = function (contentArray) {
    return contentCollection.createContent(contentArray);
}

exports.findContent = function (notesId) {
    return contentCollection.findContent(notesId);
}

exports.updateContent = function (contentObj) {
    return contentCollection.updateContent(contentObj);
}

exports.createContentByUpdate = function (contentObj, notesID) {
    return contentCollection.createContentByUpdate(contentObj, notesID)
}

exports.deleteContent = function (id) {
    return contentCollection.deleteContent(id);

}


/************************************content function ends *********************************************/



/*********************************noteAttachment starts **********************************************************/

exports.createFiles = function (imageId, userId, notesId, originalname, newFilename, mimetype) {

    return noteAttachmentCollection.createFiles(imageId, userId, notesId, originalname, newFilename, mimetype)
}

exports.findImageContent = function (notesId) {
    return noteAttachmentCollection.findImageContent(notesId);
}

exports.deleteImage = function(imageId){
    return noteAttachmentCollection.deleteImage(imageId)
}

/*********************************noteAttachment ends **********************************************************/