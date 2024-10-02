import { FormControl, FormLabel, VStack,Input,Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'

const Login = () => {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [loading,setLoading]=useState(false)
    const toast = useToast();
    const history = useNavigate();


    const submitHandler=async()=>{
      setLoading(true);
      if(!email || !password){
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

        const { data } = await axios.post("/api/user/login",{email,password},config);
        toast({
          title: "Login Successful",
          status: "success",
          duration:5000,
          isClosable:true,
          position:'bottom'
        });

        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        history("/chats")
      } catch (error) {
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
        <FormControl id="email" isRequired color={"#000000"}>
            <FormLabel>Email</FormLabel>
            <Input value={email} placeholder="Enter your Email"
            onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id="password" isRequired color={"#000000"}>
            <FormLabel>Password</FormLabel>
            <Input type={"password"} value={password} placeholder="Enter your Password"
            onChange={(e)=>setPassword(e.target.value)}
            />
        </FormControl>
        <Button
        variant="solid"
        color = "#0056A1"
        width="100%"
        style={{ marginTop: 25 }}
        onClick={submitHandler}
        isLoading = {loading}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
      </VStack>
    </div>
  )
}

export default Login
