import React from "react";


import { Avatar, Box, HStack, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Screens from "../util/Screens";
import User from "../types/User";

type UserSearchCardProps = {
     user:User
}
const UserSearchCard:React.FC = ({ user }:UserSearchCardProps) => {
     const navigation = useNavigation()
     const goToChatScreen = () => {
          navigation.navigate(Screens.CHAT_SCREEN,{ user })
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
                         <Avatar bg="cyan.500" alignSelf="center" size="md" source={{ uri: user.photoURL }}/>
                         <VStack width="80%">
                              <Text color="black">{user.displayName}</Text>
                              <Text color="black">{user.email}</Text>
                         </VStack>
                    </HStack>
               </Box>
          </TouchableOpacity>

     );
};

export default UserSearchCard;
