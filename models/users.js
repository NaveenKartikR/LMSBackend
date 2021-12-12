const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    rollno: String,
    name: String,
    email: String,
    password: String,
    mobile: String,
    course: String
})

const User = mongoose.model('User', UserSchema)

module.exports = User