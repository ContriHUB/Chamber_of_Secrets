const asyncHandler=require('express-async-handler')
const Message=require('../models/messageModel.js')
const User=require('../models/userModel.js')
const Chat=require('../models/chatModel.js')

const sendMessage=asyncHandler(async(req,res)=>{
    const {content,chatId}=req.body

    if(!content||!chatId){
        console.log("Invalid data passed into request")
        return res.sendStatus(400)
    }

    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId,
    }

    try {
        var message=await Message.create(newMessage)
        message.status = 'delivered'

        message=await message.populate('sender','name profilePic')
        message=await message.populate('chat')
        message=await User.populate(message,{
            path:'chat.users',
            select:'name profilePic email'
        })

        await Chat.findByIdAndUpdate(req.body.chatId,{latestMessage:message})
        await message.save();
        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const allMessages=asyncHandler(async(req,res)=>{
    try {
        const messages=await Message.find({chat:req.params.chatId})
            .populate("sender","name profilePic email")
            .populate("chat")

        res.json(messages)
    } catch (error) {
        res.status(400);
    throw new Error(error.message);
    }
})

const markMessageAsReceived = asyncHandler(async (req, res) => {
    try {
      const { messageIds } = req.body;
  
      await Message.updateMany(
        { _id: { $in: messageIds } }, 
        { 
            status: 'received'
         } 
      );
  
      console.log(res);
      return res.status(200).json({ message: 'Messages marked as received' });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

const markMessageAsRead = asyncHandler(async (req, res) => {
    try {
      const { messageIds } = req.body;
  
      await Message.updateMany(
        { _id: { $in: messageIds } }, 
        { readByReceiver: true,
            status: 'read'
         } 
      );
  
      return res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });


module.exports={sendMessage,allMessages,markMessageAsRead,markMessageAsReceived}