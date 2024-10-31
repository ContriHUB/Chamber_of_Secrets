const express=require("express")
const router=express.Router()
const {registerUser,authUser, allUsers,verifyEmail,updateLastSeen}=require('../controllers/userController.js')
const {protect}=require('../middleware/authMiddleware.js')

router.route('/register').post(registerUser).get(protect,allUsers)
router.route('/login').post(authUser)
router.route('/verify-email/:userId/:token').get(verifyEmail);
router.route('/lastSeen/:id').put(protect, updateLastSeen); // Add this line for updating lastSeen

module.exports=router