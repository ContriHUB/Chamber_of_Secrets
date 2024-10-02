import { Box, Center, Container,Text,
Tabs,TabList,Tab,TabPanel,TabPanels } from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Homepage = () => {
  const history=useNavigate()
    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        if(userInfo){
            history("/chats")
        }
    },[history])


  return (
    <Container maxW="xl" centerContent>
        <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        >
            <Center>
            <Text fontSize="4xl" fontFamily="Rubik Doodle Shadow" color="black" alignContent="center" fontWeight="bold">Chamber  of  Secrets</Text>
            </Center>
        </Box>
        <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="10px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        >
            <Tabs variant="soft-rounded">
  <TabList mb="1em">
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Signup</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
        </Box>
    </Container>
  )
}

export default Homepage
