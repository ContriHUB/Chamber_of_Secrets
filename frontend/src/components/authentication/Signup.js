import { FormControl, FormLabel, VStack,Input,Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [profilePic, setProfilePic] = useState()
    const [loading,setLoading]=useState(false)
    const toast=useToast();
    const navigate = useNavigate();
    

    const postDetails=(pics)=>{
      setLoading(true)
      if(pics===undefined){
        toast({
          title: "Undefined",
          status: "warning",
          duration:5000,
          isClosable:true,
          position:'bottom'
        });
        return;
      }

      if(pics.type==="image/jpeg"||pics.type==="image/png"){
        const data=new FormData()
        data.append('file',pics)
        data.append('upload_preset','chamber')
        data.append('cloud_name','dlgovuir2')
        fetch("https://api.cloudinary.com/v1_1/dlgovuir2/image/upload",{
          method:'post',
          body:data,
        })
        .then((res)=>res.json())
        .then((data)=>{
          setProfilePic(data.url.toString())
          console.log(data.url.toString())
          setLoading(false)
        })
        .catch((err)=>{
          console.log(err)
          setLoading(false)
        })
      }
      else{
        toast({
          title: "Unsupported Format",
          status: "warning",
          duration:5000,
          isClosable:true,
          position:'bottom'
        });
        setLoading(false);
        return;
      }
    };

    const submitHandler = async()=>{
      setLoading(true);
      if(!name || !email || !password || !confirmPassword || (password !== confirmPassword)){
        toast({
          title: "Please Fill all the Fields",
          status: "warning",
          duration:5000,
          isClosable:true,
          position:'bottom'
        });
        setLoading(false)
        return;
      }

      try {
        const config = {
          headers:{
            "Content-Type":"application/json",
          },
        };
        console.log({ name, email, password ,profilePic});
        const { data } = await axios.post("/api/user/register",{name,email,password,profilePic},config);
        //console.log(data);
        toast({
          title: "User Successfully Registered",
          status: "success",
          duration:5000,
          isClosable:true,
          position:'bottom'
        });

        localStorage.setItem('userInfo',JSON.stringify(data));
        setLoading(false);
        // Get the navigate function
    navigate("/"); 
      } catch (error){
        console.error("Error caught:", error); // Log the entire error object
        const errorMessage = error.response && error.response.data && error.response.data.message 
                             ? error.response.data.message 
                             : "Server error"; // Fallback message
        toast({
          title: "Error Occured!",
          description:error.response.data.message,
          status: "error",
          duration:5000,
          isClosable:true,
          position:'bottom'
        });
        setLoading(false)
      }
    };

  return (
    <div>
      <VStack>
        <FormControl id="first-name" isRequired color={"#000000"}>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Enter your Name"
            onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>
        <FormControl id="email" isRequired color={"#000000"}>
            <FormLabel>Email</FormLabel>
            <Input placeholder="Enter your Email"
            onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id="password" isRequired color={"#000000"}>
            <FormLabel>Password</FormLabel>
            <Input type={"password"} placeholder="Enter your Password"
            onChange={(e)=>setPassword(e.target.value)}
            />
        </FormControl>
        <FormControl id="confirmPassword" isRequired color={"#000000"}>
            <FormLabel>Password</FormLabel>
            <Input type={"password"} placeholder="Confirm your Password"
            onChange={(e)=>setConfirmPassword(e.target.value)}
            />
        </FormControl>
        <FormControl id="pic" isRequired color={"#000000"}>
            <FormLabel>Upload your Picture</FormLabel>
            <Input type={"file"} p={1.5} accept="image/*"
            onChange={(e)=>postDetails(e.target.files[0])}
            />
        </FormControl>
        <Button
        color = "#0056A1"
        width="100%"
        style={{ marginTop: 25 }}
        onClick={submitHandler}
        isLoading = {loading}
      >
        Sign Up
      </Button>
      </VStack>
    </div>
  )
}

export default Signup
