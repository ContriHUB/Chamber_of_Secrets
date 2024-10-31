const asyncHandler=require('express-async-handler')
const User =require('../models/userModel.js')
const generateToken = require('../config/generateToken.js')
var nodemailer = require('nodemailer');
const jwt=require('jsonwebtoken')

const sendVerificationEmail = (user, token) => {
    const link = `http://localhost:4000/api/user/verify-email/${user._id}/${token}`;
    console.log(link);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'rsidali9@gmail.com',
            pass: 'tdzufbfybxllqckt'
        }
    });

    var mailOptions = {
        from: 'rsidali9@gmail.com',
        to: user.email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: ${link}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Verification email sent');
        }
    });
}
const registerUser= asyncHandler(async(req,res)=>{
    const {name,email,password,profilePic}=req.body;
    if(!email||!password){
        res.status(400)
        throw new Error("Please enter all the fields")
    }
    const userExists=await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error("User already exists")
    }
    const user=await User.create({
        name,
        email,
        password,
        profilePic,
        isVerified: false
    })
    if(user){
        const token =generateToken(user.email)
        sendVerificationEmail(user, token);
        res.status(201).json({
            message: "Registration successful! Please check your email to verify your account.",
        });
        // console.log('new user created');
        // res.status(201).json({
        //     _id:user._id,
        //     name:user.name,
        //     email:user.email,
        //     password:user.password,
        //     pic:user.profilePic,
        //     token:generateToken(user._id)
        // })
    }
    else{
        res.status(400)
        throw new Error('Failed to register the User')
    }
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { userId, token } = req.params;

    if (!token) {
        res.status(400);
        throw new Error("No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(userId);

        if (!user) {
            res.status(400);
            throw new Error("User not found");
        }

        if (user.isVerified) {
            res.status(400);
            throw new Error("User is already verified");
        }

        user.isVerified = true;
        await user.save();
        console.log('verified');
        res.status(200).json({
            message: "Email verified successfully!",
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('Invalid or expired token');
    }
});

const authUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(user && (await user.matchPassword(password)) && user.isVerified){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic: user.profilePic,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(401)
        throw new Error('Invalid Email or Password')
    }
})

const allUsers=asyncHandler(async(req,res)=>{
    const keyword=req.query.search
    ?{
        $or:[
            {name:{$regex:req.query.search,$options:'i'}},
            {email:{$regex:req.query.search,$options:'i'}},
            //a MongoDB query to search for users regular expression ($regex) with 
            //case-insensitive matching ($options: 'i').
        ]
    }:{};

    const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
    //It ensures that the current user making the request is not included in the 
    //search results ({_id:{$ne:req.user._id}}).
    res.send(users)
})

//last seen
const updateLastSeen = async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndUpdate(userId, { lastSeen: Date.now() }, { new: true });
        res.status(200).json({ message: "Last seen updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating last seen" });
    }
};

module.exports={registerUser,authUser,allUsers,verifyEmail,updateLastSeen}