const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;
var connection = mongoose.createConnection("mongodb://localhost:27017/users");
autoIncrement.initialize(connection);
const schema = new Schema({
    login: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password : {type : String , required: true}
    
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);