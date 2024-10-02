const express=require('express')
const {protect}=require('../middleware/authMiddleware.js');
const { accessChat,fetchChat,createGroupChat,renameGroup,removeFromGroup,addToGroup } = require('../controllers/chatController.js');

const router=express.Router();

 router.route('/').post(protect,accessChat)
 router.route('/').get(protect,fetchChat)
 router.route('/group').post(protect,createGroupChat)
 router.route('/rename').put(protect,renameGroup)
 router.route('/groupremove').put(protect,removeFromGroup)
 router.route('/groupadd').put(protect,addToGroup)

module.exports=router