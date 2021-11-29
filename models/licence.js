const mongoose = require('mongoose')

const licenceSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subscription_end_date: {
        type: Date,
        required: true
    },
    subscription_add_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    licence_key: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Licences', licenceSchema)