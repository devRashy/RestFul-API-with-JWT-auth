const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Enter a valid email')
            }
        }
    },
    password: {
        type: String,
       required: true,
        minlength: 7
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.methods.generateAuthToken = async function () {
       const user = this
       const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_KEY)
       user.tokens = user.tokens.concat({token})
       console.log(user.tokens)
       await user.save()
       return token
}


//setting up a virtual property
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// setting a model method on userSchema
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error("unable to login")
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error ('unable to log in')
    }
    return user
}

//instance method
userSchema.pre('save',async function(next) {
    const user = this
    if(user.isModified('password')){
        user.password =  await bcrypt.hash(user.password,8)
       }
    next()
})

// userSchema.pre('remove', async function (next) {
//     const user = this
//     await Task.deleteMany({ owner: user._id })
//     next()
// })

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})


const User = mongoose.model('User',userSchema)

module.exports = User