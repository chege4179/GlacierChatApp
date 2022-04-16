import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Box, HStack, KeyboardAvoidingView } from "native-base";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import { GiftedChat } from "react-native-gifted-chat";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import {
     checkIfChatsExists,
     createNewChat,
     getChatId,
     getDocId,
     sendMessageToExistingChat,
} from "../util/helperfunctions";

const ChatScreen = ({ route }) => {
     const currentUser = auth().currentUser;
     const navigation = useNavigation();
     const { user } = route.params;
     const [messages, setMessages] = useState();


     useLayoutEffect(() => {
          navigation.setOptions({
               headerTitle: user.displayName || "Glacier Chat User",
               headerRight: () => {
                    return (
                         <HStack>
                              <TouchableOpacity style={{ paddingRight: 30 }}>
                                   <Feather name="phone" color="black" size={23} />
                              </TouchableOpacity>
                              <TouchableOpacity>
                                   <Entypo name="dots-three-vertical" color="black" size={23} />
                              </TouchableOpacity>
                         </HStack>
                    );
               },
          });
     }, []);

     async function getChats() {
          const docId = await getDocId(currentUser.email);
          const status = await checkIfChatsExists(currentUser.email, user.email, docId);
          if (status) {
               const chatId = await getChatId(currentUser.email, user.email, docId);
               firestore()
               .collection("Users")
               .doc(docId)
               .collection("Chats")
               .doc(chatId)
               .collection("messages")
               .onSnapshot((snapshot) => {
                    const messages = snapshot.docs.map((doc) => ({ _id:doc.id,...JSON.parse(doc.data().message) }));
                    console.warn("Incoming messages",messages);
                    setMessages(messages);
               });
          }
     }

     useEffect(() => {
          getChats();

     }, []);

     const onSend = async (message) => {
          console.log("Sent message >>>>>>>>>>>>>>>>>>>",message);
          const docId = await getDocId(currentUser.email);
          const docId2 = await getDocId(user.email);
          const status = await checkIfChatsExists(currentUser.email, user.email, docId);
          const status2 = await checkIfChatsExists(user.email, currentUser.email, docId2);

          if (status) {
               const chatId = await getChatId(currentUser.email, user.email, docId);
               await sendMessageToExistingChat(currentUser.email, user.email, JSON.stringify(message[0]), docId, chatId);
          } else {
               await createNewChat(currentUser.email, user.email, JSON.stringify(message[0]), docId);
          }
          if (status2) {
               const chatId2 = await getChatId(currentUser.email, user.email, docId2);
               await sendMessageToExistingChat(currentUser.email, user.email, JSON.stringify(message[0]), docId2, chatId2);
          } else {
               await createNewChat(currentUser.email, user.email, JSON.stringify(message[0]), docId2);
          }
     };
     return (
          <KeyboardAvoidingView>
               <Box width="100%" height="100%">
                    <GiftedChat
                         messages={messages}
                         onSend={messages => onSend(messages)}
                         user={{
                              _id:currentUser.uid,
                              name: currentUser.displayName,
                              avatar: currentUser.photoURL,
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
