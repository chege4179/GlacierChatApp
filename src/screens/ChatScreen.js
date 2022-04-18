import React, { useEffect, useLayoutEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Actionsheet, Alert, Avatar, Box, HStack, KeyboardAvoidingView, Slide, Text, useDisclose } from "native-base";
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
     sendMessageToExistingChat, truncate,
} from "../util/helperfunctions";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import NetInfo from "@react-native-community/netinfo";

const ChatScreen = ({ route }) => {
     const currentUser = auth().currentUser;
     const navigation = useNavigation();
     const { user } = route.params;
     const [messages, setMessages] = useState();
     const { isOpen, onOpen, onClose } = useDisclose();

     useLayoutEffect(() => {
          navigation.setOptions({
               headerTitle: () => {
                    return (
                         <TouchableOpacity onPress={onOpen}>
                              <HStack width="100%" space={2} justifyContent="flex-start" height="100%">
                                   <Avatar bg="cyan.500" alignSelf="center" size="sm" source={{ uri: user.photoURL }} />
                                   <Text color="black" fontSize={21}
                                         fontWeight="bold">{truncate(user.displayName, 13)}</Text>
                              </HStack>
                         </TouchableOpacity>

                    );
               },
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
                    const messages = snapshot.docs.map((doc) => ({ _id: doc.id, ...JSON.parse(doc.data().message) }));

                    setMessages(messages.sort((a, b) => b.time - a.time));
               });
          }
     }

     useEffect(() => {
          let isSubscribed = true;
          if (isSubscribed) {
               getChats()
               .then(() => {

                    })
               .catch((err) => {
                    console.log(err);


               });
          }
          return () => {
               isSubscribed = false;
          };
     }, []);

     const [IsConnected,setIsConnected] = useState(false)

     useEffect(() => {
          NetInfo.addEventListener(state => {
               setIsConnected(state.isConnected)
               // console.log("Connection type", state.type);
               // console.log("Is connected?", state.isConnected);
          });
          return () => {
               setIsConnected(false)

          }
     },[])

     const onSend = async (message) => {
          console.log("Sent message >>>>>>>>>>>>>>>>>>>", message);

          const docId = await getDocId(currentUser.email);
          const docId2 = await getDocId(user.email);
          const status = await checkIfChatsExists(currentUser.email, user.email, docId);
          const status2 = await checkIfChatsExists(user.email, currentUser.email, docId2);


          if (status) {
               const chatId = await getChatId(currentUser.email, user.email, docId);
               await sendMessageToExistingChat(currentUser.email, user.email, JSON.stringify({ time: Date.now(), ...message[0] }), docId, chatId);
          } else {
               await createNewChat(currentUser.email, user.email, JSON.stringify({ time: Date.now(), ...message[0] }), docId);
          }
          if (status2) {
               const chatId2 = await getChatId(user.email, currentUser.email, docId2);
               await sendMessageToExistingChat(user.email, currentUser.email, JSON.stringify({ time: Date.now(), ...message[0] }), docId2, chatId2);
          } else {
               await createNewChat(user.email, currentUser.email, JSON.stringify({ time: Date.now(), ...message[0] }), docId2);
          }
     };
     return (
          <KeyboardAvoidingView>
               <Slide in={!IsConnected} placement="top">
                    <Alert justifyContent="center" status="error">
                         <Alert.Icon />
                         <Text color="error.600" fontWeight="medium">
                              {IsConnected ? "Internet Connection found" : "No Internet Connection"}
                         </Text>
                    </Alert>
               </Slide>
               <Box width="100%" height="100%">
                    <Actionsheet isOpen={isOpen} onClose={onClose}>
                         <Actionsheet.Content>
                              <Box w="100%" h={60} px={4} justifyContent="center">
                                   <Text fontSize="16" color="gray.500" _dark={{
                                        color: "gray.300",
                                   }}>
                                        Albums
                                   </Text>
                              </Box>
                              <Actionsheet.Item>Delete</Actionsheet.Item>
                              <Actionsheet.Item isDisabled>Share</Actionsheet.Item>
                              <Actionsheet.Item>Play</Actionsheet.Item>
                              <Actionsheet.Item>Favourite</Actionsheet.Item>
                              <Actionsheet.Item>Cancel</Actionsheet.Item>
                         </Actionsheet.Content>
                    </Actionsheet>
                    <GiftedChat
                         messages={messages}
                         onSend={messages => onSend(messages)}
                         user={{
                              _id: currentUser.uid,
                              name: currentUser.displayName,
                              avatar: currentUser.photoURL,
                         }}
                         alignTop={true}
                         inverted={true}
                         showAvatarForEveryMessage={false}
                         showUserAvatar={false}
                         // renderChatEmpty={() => {
                         //      return(
                         //           <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" borderColor="black" borderWidth={2}>
                         //                <Text color="black" textAlign="center">You have messages with this Person ..Be the first to start a chat </Text>
                         //           </Box>
                         //      )
                         // }}

                    />
               </Box>
          </KeyboardAvoidingView>

     );
};
export default ChatScreen;
