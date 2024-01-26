const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },email:{
        type:String,
        required:true
    },phone:{
        type:Number,
        required:true
    },password:{
        type:String,
        required:true
    },role:{
        type:String,
        required:true,
        default:'user'
    },
    status:{
        type:String,
        required:true,
        default:'active'
    }
},{timestamps:true})


const User = mongoose.model('users',usersSchema)

module.exports = User