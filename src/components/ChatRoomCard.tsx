import React, { useEffect, useState } from "react";

import { Avatar, Box, HStack, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Screens from "../util/Screens";
import { getLastMessage, getUserInfo, truncate } from "../util/helperfunctions";
import auth from "@react-native-firebase/auth";
import User from "../types/User";


type ChatRoomCardProps = {
     email:string
}
const ChatRoomCard:React.FC = ({ email }:ChatRoomCardProps) => {
     const navigation = useNavigation()
     const currentUser = auth().currentUser
     const [receiver,setReceiver] = useState<User | null>(null)
     const [lastMessage,setLastMessage] = useState({})
     async function getUserData(){
          try {
               const userInfo:User = await getUserInfo(email)
               setReceiver(userInfo)
          }catch (e:unknown){
               console.log(e);
          }

     }
     useEffect(() => {
          getUserData()
          .then(() => {
               if(currentUser !== null){
                    getLastMessage(currentUser.email,email)
                    .then((lastMessage) => {

                         console.log("Last Message",lastMessage);
                         setLastMessage(lastMessage)
                    })
                    .catch((e) => {
                         console.log("Error here",e);
                    })
               }


          })
          .catch((err) => {
               console.log(err);

          })
     },[])

     const goToChatScreen = () => {
          navigation.navigate(Screens.CHAT_SCREEN,{ user:receiver })
     }
     return (
          <TouchableOpacity onPress={goToChatScreen}>
               <Box
                    width="100%"
                    height={16}
                    display="flex"
                    justifyContent="center"
                    px={4}
                    bg="muted.300"
                    rounded="lg"
                    mb={2}
               >
                    <HStack justifyContent="space-evenly">
                         <Avatar bg="cyan.500" alignSelf="center" size="md" source={{ uri: receiver?.photoURL }}/>
                         <VStack width="90%" ml={4} pl={2}>
                              <Text color="black" fontSize={17} fontWeight="bold">{receiver?.displayName}</Text>
                              <HStack width="100%" height="50%" justifyContent="space-evenly" alignItems="center">
                                   <Text color="black">{ currentUser?.uid === lastMessage?.user?._id ? "Me :" : truncate(lastMessage?.user?.name,15)  + ":" }</Text>
                                   <Box width="40%">
                                        <Text color="black" textAlign="left">{truncate(lastMessage?.text,20)}</Text>
                                   </Box>
                                   <Text color="black">{new Date(lastMessage?.createdAt).toLocaleTimeString()}</Text>
                              </HStack>
                         </VStack>
                    </HStack>
               </Box>
          </TouchableOpacity>
     );
};

export default ChatRoomCard;
