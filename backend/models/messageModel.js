const mongoose=require('mongoose')

const messageModel= mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chats"
    },
    status: {
        type: String,
        enum: ['sending', 'delivered', 'read', 'received'],
        default: 'sending'
    },
    readByReceiver: {
        type: Boolean,
        default: false 
    }
},
{
    timestamps:true
})

const Message=mongoose.model("Message",messageModel)
module.exports=Message