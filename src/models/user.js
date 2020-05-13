const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Shift = require('./shift')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    email: {
        type: String,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid e-mail address.')
            }
        }
    },
    phone: {
        type: String,
        trim: true
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},
{
    timestamps: true
})


// Creating a Virtual property in order to create a relationship between
//      the User model and the Shift Model. Each shift has a reference to
//      the User model, each User has a virtual property that links it to 
//      its shifts.
userSchema.virtual('shifts', {
    ref: 'Shift',
    localField: '_id',
    foreignField: 'locum'
})


// New Query to find a user by Email and Password
userSchema.statics.findByEmailAndPassword = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error ('Unauthorized.')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error ('Unauthorized.')
    } 

    return user
}


// Generate a token for Authorising access to routes
userSchema.methods.generateAuthToken = async function () {
    const token_pw = 'tokenpw'
    const token = jwt.sign( { _id: this._id.toString() }, token_pw)
    
    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token

}


// Reducing the amount of information sent back:
//      removing the password and tokens properties from the
//      received user instance.
// The method toJSON is called everytime the method JSON.stringify()
//      is called, and the method JSON.stringify() is called every time
//      we send a res through res.send(): this means that everytime we
//      use res.send() we apply the code below.
userSchema.methods.toJSON = function() {
    const userObject = this.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.createdAt
    delete userObject.updatedAt

    return userObject
}


// Hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})


// Delete user's shifts if user deletes their account
userSchema.pre('remove', async function(next) {
    await Shift.deleteMany({ locum: this._id })

    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User