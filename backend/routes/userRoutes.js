const express=require("express")
const router=express.Router()
const {registerUser,authUser, allUsers,verifyEmail}=require('../controllers/userController.js')
const {protect}=require('../middleware/authMiddleware.js')

router.route('/register').post(registerUser).get(protect,allUsers)
router.route('/login').post(authUser)
router.route('/verify-email/:userId/:token').get(verifyEmail);
module.exports=router