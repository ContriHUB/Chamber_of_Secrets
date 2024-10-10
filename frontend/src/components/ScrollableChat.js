import React from 'react'
import { ChatState } from '../context/ChatProvider'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin,isSameUser } from '../config/ChatLogics'
import { Avatar, Tooltip, Box, Text, Icon } from '@chakra-ui/react'
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import { CiClock2 } from "react-icons/ci";

const ScrollableChat = ({messages}) => {
  const {user}=ChatState()

  return (
    <ScrollableFeed>
      {messages && messages.map((m, i) => (
        <Box display="flex" key={m._id}>
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.profilePic}
              />
            </Tooltip>
          )}
          <Box
            bg={m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}
            borderRadius="17px"
            p="7px 17px"
            maxWidth="75%"
            ml={isSameSenderMargin(messages, m, i, user._id)}
            mt={isSameUser(messages, m, i, user._id) ? 3 : 10}
            position="relative" // To position the icon
          >
            <Text>{m.content}</Text>

            {m.sender._id === user._id && ( 
              <>
              {/* Sending to the server -> clock */}
              {m.status === 'sending' &&(
                <Icon
                  as={CiClock2}
                  position="absolute"
                  bottom="3px" 
                  right="5px" 
                  boxSize="11px" 
                  color="#012E1F" 
                />
              )}
              {/* Sent to he server -> single gray tick */}
              {m.status === 'delivered' &&(
                <Icon
                  as={BiCheck}
                  position="absolute"
                  bottom="3px" 
                  right="5px" 
                  boxSize="15px" 
                  color="gray.500" 
                />
              )}
              {/* received but not read -> double gray tick */}
              {m.status === 'received' &&(
                <Icon
                  as={BiCheckDouble}
                  position="absolute"
                  bottom="3px" 
                  right="5px" 
                  boxSize="15px" 
                  color="gray.500" 
                />
              )}
              {/* received and read -> double green tick */}
              {m.readByReceiver && (
                <Icon
                  as={BiCheckDouble}
                  position="absolute"
                  bottom="3px" 
                  right="5px" 
                  boxSize="15px" 
                  color="green.500" 
                />
              )}

              </>
            )}
          </Box>
        </Box>
      ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat
