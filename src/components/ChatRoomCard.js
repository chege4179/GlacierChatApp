import React, { useEffect, useState } from "react";

import { Avatar, Box, HStack, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Screens from "../util/Screens";
import { getUserInfo } from "../util/helperfunctions";

const ChatRoomCard = ({ email }) => {
     const [receiver,setReceiver] = useState({})
     async function getUserData(){
          const userInfo = await getUserInfo(email)
          setReceiver(userInfo)
     }
     useEffect(() => {
          getUserData()
          .then(() => {

          })
          .catch((err) => {

          })
     },[])
     const navigation = useNavigation()
     const GoToChatScreen = () => {
          navigation.navigate(Screens.CHAT_SCREEN,{ user:receiver })
     }
     return (
          <TouchableOpacity onPress={GoToChatScreen}>
               <Box
                    width="100%"
                    height={16}
                    borderWidth={1}
                    borderColor="black"
                    display="flex"
                    justifyContent="center"
                    px={4}
                    my={1}
               >
                    <HStack justifyContent="space-evenly">
                         <Avatar bg="cyan.500" alignSelf="center" size="md" source={{ uri: receiver.photoURL }}/>
                         <VStack width="80%">
                              <Text color="black">{receiver.displayName}</Text>
                              <Text color="black">{receiver.email}</Text>
                         </VStack>
                    </HStack>
               </Box>
          </TouchableOpacity>
     );
};

export default ChatRoomCard;
