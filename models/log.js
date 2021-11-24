const mongoose = require('mongoose')
const { stringify } = require('querystring')
const logSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },

    dateReuqested:{
        type: Date,
        required:true,
        default:Date.now
    }
})

module.exports = mongoose.model('Logs',logSchema)