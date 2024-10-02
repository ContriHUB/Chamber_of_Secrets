const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const userModel=mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        trim:true
    },
    profilePic:{
        type:String,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
},{
    timestamps:true
})

userModel.methods.matchPassword=async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userModel.pre("save",async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})
// next is a function that you call to pass control to the next middleware function in the
//  stack. It's a way to indicate that the current middleware function has completed its work,
//   and the next one in line should be executed.
// !this.isModified('password')->It checks whether the 'password' field has been modified. If
//  it hasn't been modified, the middleware calls next().This is a common pattern to ensure 
//  that expensive operations, like hashing a password, are only performed when necessary, 
//  i.e., when the password is being modified during a save operation.

const User=mongoose.model("User",userModel)
module.exports=User