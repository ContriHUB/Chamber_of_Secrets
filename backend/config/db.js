require('dotenv').config();
const mongoose=require('mongoose')

const ConnectDB= async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI,{//process.env is an object
            useNewUrlParser:true,
            useUnifiedTopology : true,
        })
        console.log(`DB connected`)
    } catch (error) {
        console.log(error)
        process.exit();
    }
}
module.exports=ConnectDB;