const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
           if(value.toLowerCase().includes('password')){
                throw new Error('You cannot use "password" as password')
            }
        }
    },
    age:{
        type:Number,
        validate(value){
            if(value<0){
                throw new Error('Age must be a postive number')
            }
        }
    }
})

userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    console.log('Just before saving!')

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User