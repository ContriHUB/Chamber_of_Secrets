import React,{useEffect, useState} from 'react'
import {ChatState} from '../context/ChatProvider.js'
import { VStack, useToast,Box,Text } from '@chakra-ui/react'
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import GroupChatModal from './miscellaneous/GroupChatModal.js';

const MyChats = ({fetchAgain}) => {
  const [loggedUser,setLoggedUser]=useState();
  const {selectedChat,setSelectedChat,user,chats,setChats}=ChatState();
  const toast=useToast()

  const fetchChats= async()=>{
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data}=await axios.get(`/api/chat`,config)
      setChats(data)
    } catch (error) {
       toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  },[fetchAgain])

  return (
   <>
     <Box
      display={{base: chats ? "none" : "flex" , md:"flex"}}
        flexDir="column"
        w={{ base: "100%" }}
        bg="#2694f0"
        borderRadius="5px"
        boxShadow="dark-lg"
        p = "2"
        marginRight="10px"
      >
        <Box
        display="flex"
          w="100%"
          fontFamily="Work sans"  
          fontWeight="bold"
          fontSize="3xl"
          alignItems="center"
          justifyContent="space-between"
          textColor="#03080d"
        >
          My Chats
          <GroupChatModal>
          <Button
          d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
          </GroupChatModal>
        </Box>
        <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#044b91"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        >
          {chats?(
            <VStack >
              {chats.map((chat)=>(
                <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                    ? getSender(loggedUser,chat.users)
                    :chat.chatName}
                  </Text>
                </Box>
              ))}
            </VStack>
          ):(<ChatLoading/>)
          }
        </Box>
        </Box>  
    </>
  )
}

export default MyChats
