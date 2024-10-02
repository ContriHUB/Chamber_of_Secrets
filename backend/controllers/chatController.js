const asyncHandler=require('express-async-handler')
const User=require('../models/userModel.js')
const Chats=require('../models/chatModel.js')

const accessChat=asyncHandler(async(req,res)=>{
    const {userID}=req.body
    if(!userID){
        console.log('User ID parameter not requested')
        return res.status(400)
    }

    var isChat=await Chats.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:userID}}},
            {users:{$elemMatch:{$eq:req.user._id}}},
        ]
    }).populate("users","-password")
    .populate("latestMessage")

    isChat=await User.populate(isChat,{ //additional Population
        path:"latestMessage.sender",
        select:"name email profilePic"
    })

    if(isChat.length>0){
        res.send(isChat[0])
    }
    else{
        var chatData={
            isGroupChat:false,
            users:[
                req.user._id,
                userID
            ],
            chatName:'sender'
        }

        try {
            const createdChat=await Chats.create(chatData);
            const fullChat=await Chats.findOne({_id:createdChat._id}).populate('users','-password')
            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

const fetchChat=asyncHandler(async(req,res)=>{
    try {
        Chats.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async(results)=>{
            results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"name profilePic email"
            })
            res.status(200).send(results)
        })
    } catch (error) {
        res.status(400)
        throw new Error(err.message)
    }
})

const createGroupChat=asyncHandler(async(req,res)=>{
    if(!req.body.users||!req.body.name){
        return res.status(400).send({message:"Please fill all the fields"})
    }
    var users=JSON.parse(req.body.users)
    if(users.length<2){
        return res.status(400).send("More than 2 users are required to form a Group Chat")
    }
    users.push(req.user)

    try {
        const groupChat=await Chats.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        })
        const fullGroupChat=await Chats.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const renameGroup=asyncHandler(async(req,res)=>{
    const {chatId,chatName}=req.body
    const updatedChat=await Chats.findByIdAndUpdate(
        chatId,
        {
            chatName:chatName,
        },
        {
            new:true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!updatedChat){
        res.status(404)
        throw new Error("Chat not found")
    }
    else{
        res.json(updatedChat)
    }
})

const addToGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body
    const added=await Chats.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId},
        },
        {
            new:true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!added){
        res.status(404)
        throw new Error("Chat not found")
    }
    else{
        res.json(added)
    }
})

const removeFromGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body
    const removed=await Chats.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId},
        },
        {
            new:true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!removed){
        res.status(404)
        throw new Error("Chat not found")
    }
    else{
        res.json(removed)
    }
})

module.exports={accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup}