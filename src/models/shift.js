const mongoose = require('mongoose')
// const validator = require('validator')

const shiftSchema = new mongoose.Schema({
    user_name: {
        type: String,
        trim: true
    },
    store_name: {
        type: String,
        required: true
    },
    shift_date: {
        type: Date,
        required: true,
    },
    starting_time: {
        type: String,
    },
    ending_time: {
        type: String,
    },
    lunch_break: {
        type: Number,
        default: 0,
        validate (value) {
            if (value < 0) {
                throw new Error ('Rate must be a positive number.')
            }
        }
    },
    hourly_rate: {
        type: Number,
        default: 0,
        validate (value) {
            if (value < 0) {
                throw new Error ('Rate must be a positive number.')
            }
        }
    },
    hours: {
        type: Number,
        default: 0,
        validate (value) {
            if (value < 0){
                throw new Error('Hours must be a positive number.')
            }
        }
    },
    paid: {
        type: Boolean,
        default: false
    },
    date_paid: {
        type: Date
    },
    locum: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
{
    timestamps: true
})



const Shift = mongoose.model('Shift', shiftSchema)

module.exports = Shift