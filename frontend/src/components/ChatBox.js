import React from 'react'
import { ChatState } from '../context/ChatProvider'
import SingleChat from './SingleChat'
import { Box } from '@chakra-ui/react'

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat}=ChatState()
  return (
      <Box
      display={{base:selectedChat ? "flex" : "none" ,md:"flex"}}
      w = {{base:"100%" , md:"90%"}}
      background={'white'}
      alignItems="center"
      p = {3}
      flexDirection="column"
      borderRadius="5px"
      boxShadow="dark-lg"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
    
  )
}

export default ChatBox
