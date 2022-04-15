import React from "react";


import { Avatar, Box, HStack, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Screens from "../util/Screens";

const UserSearchCard = ({ user }) => {
     const navigation = useNavigation()
     const GoToChatScreen = () => {
          navigation.navigate(Screens.CHAT_SCREEN,{ user })
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
                    mx={4}
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
