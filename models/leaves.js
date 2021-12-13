const mongoose = require('mongoose')

const LeaveSchema = new mongoose.Schema({
    email: String,
    date: String,
    reason: String,
    approved: {type: String, default: ""}
})

const Leave = mongoose.model('Leave', LeaveSchema)

module.exports = Leave