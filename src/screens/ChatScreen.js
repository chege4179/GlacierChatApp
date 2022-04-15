import React, { useCallback, useLayoutEffect, useState } from "react";

import { Text, View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Box, HStack, KeyboardAvoidingView } from "native-base";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import { GiftedChat } from "react-native-gifted-chat";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const ChatScreen = ({ route }) => {
     const currentUser = auth().currentUser
     const navigation = useNavigation()
     const { user } = route.params
     const [messages,setMessages] = useState()
     useLayoutEffect(() => {
          navigation.setOptions({
               headerTitle:user.displayName || "Glacier Chat User",
               headerRight:() => {
                    return(
                         <HStack>
                              <TouchableOpacity style={{ paddingRight:30, }}>
                                   <Feather name='phone' color="black" size={23}/>
                              </TouchableOpacity>
                              <TouchableOpacity >
                                   <Entypo name='dots-three-vertical' color="black" size={23}/>
                              </TouchableOpacity>
                         </HStack>
                    )
               }
          })
     },[])
     const onSend = (message) => {
          console.warn(JSON.stringify(message));
          firestore()
          .collection("Users")
          .doc(currentUser.email)
          .collection("messages")
          .add({
               message:JSON.stringify(message)
          })
          .then(() => {
               console.warn("message added successfully");
          })
          .catch((err) => {
               console.log(JSON.stringify(err));
               console.log("An error ocurred");
          })
     }
     return (
          <KeyboardAvoidingView>
               <Box width="100%" height="100%">
                    <GiftedChat
                         messages={messages}
                         onSend={messages => onSend(messages)}
                         user={{
                              _id: user.uid,
                              name:user.displayName,
                              avatar:user.photoURL,
                         }}
                    />
               </Box>
          </KeyboardAvoidingView>

     );
};
const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",

     },
});
export default ChatScreen;
