import React, { useState } from 'react'
import { Input } from "@chakra-ui/input";
import {Box, Button, Tooltip,Text, MenuButton, Menu,MenuItem,
  MenuList,MenuDivider,useDisclosure} from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {ChatState} from "../../context/ChatProvider.js"
import { Avatar } from "@chakra-ui/avatar"
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { getSender } from '../../config/ChatLogics.js';
import ChatLoading from "../ChatLoading";
// import {Spinner} from "@chakra-ui/spinner"
import { useNavigate } from 'react-router-dom'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import ProfileModal from './ProfileModal.js';
import UserListItem from '../UserAvatar/UserListItem.js';

const SideDrawer = () => {
  const [search,setSearch]=useState("");
  const [loading,setLoading] = useState(false)
    const [loadingChat,setLoadingChat] = useState(false)
    const[searchResults,setSearchResults] = useState([])
    const {user,setSelectedChat,chats,setChats,notification,
    setNotification}=ChatState()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const history=useNavigate()

    const logoutHandler=()=>{
      localStorage.removeItem("userInfo");
      history("/")
    }

    const handleSearch=async ()=>{
      if(!search){
        toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position:"top-left",
      });
      return;
      }
      try {
        setLoading(true)

        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,
          },
        }

        const {data}=await axios.get(`/api/user?search=${search}`,config)
        //a GET request to an endpoint (/api/user) with a query parameter search, which likely contains the search term.
        setLoading(false)
        setSearchResults(data)
      } catch (error) {
        toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      }
    }
    const accessChat=async(userID)=>{
      try{
        setLoadingChat(true)
        const config={
          headers:{
            "Content-type":"application/json",
            Authorization:`Bearer ${user.token}`,
          },
        }
        const {data}=await axios.post(`/api/chat`,{userID},config)
        if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats])
        setSelectedChat(data)
        setLoadingChat(false)
        onClose()
      }catch (error){}
    }
  return (
    <div>
      <Box
      display="flex"
      justifyContent="space-between"
      alignContent="center"
      bg='#7e83a3'
      w="100%"
      p="5px 15px 5px 10px"
      borderWidth="5px"
      >
        <Tooltip  label="Search User" placement='bottom-end'>
          <Button variant="ghost" onClick={onOpen}>
            <i class="fas fa-search"/>
            <Text display={{base:"none",md:"flex"}} px="4">
                Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontFamily="Rubik Doodle Shadow" fontSize="2xl" justifyContent="center" color="#141830" fontWeight="bold">
          Chamber Of Secret
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1}/>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size="sm" cursor="pointer"  src={user.pic}/>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading?(<ChatLoading/>):(
              searchResults?.map((user)=>(
                <UserListItem
                key={user._id}
                user={user}
                handleFunction={()=>accessChat(user._id)}
                />
              ))
            )
            }
            {/* {loadingChat&&<Spinner ml="auto" display="flex"/>} */}
          </DrawerBody>
          </DrawerContent>
      </Drawer>
    </div>
  )
}

export default SideDrawer
