import React, { useEffect, useState } from "react";
import { Box, Text, VStack, FlatList, Spinner, Slide, Alert } from "native-base";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { getDocId } from "../util/helperfunctions";
import ChatRoomCard from "../components/ChatRoomCard";
import NetInfo from "@react-native-community/netinfo"
import { useNavigation } from "@react-navigation/native";

const AllChatsScreen: React.FC = () => {
     const navigation  = useNavigation()
     const currentUser = auth().currentUser
     const [receiverEmails,setReceiverEmails] = useState([])
     const [isLoading,setIsLoading] = useState(false)


     navigation.addListener("focus",() => {
          setIsLoading(true)
          if (currentUser !== null){
               getDocId(currentUser.email)
               .then((docId)=>{
                    firestore()
                    .collection("Users")
                    .doc(docId)
                    .collection("Chats")
                    .onSnapshot((receiverDocs) => {
                         const receivers = receiverDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
                         setIsLoading(false)
                         setReceiverEmails(receivers)
                    })
               })
               .catch((err)=>{
                    setIsLoading(false)
                    console.log(err);
                    console.log("error");
               })
          }
     })
     useEffect(() => {
          setIsLoading(true)
          if (currentUser !== null){
               getDocId(currentUser.email)
               .then((docId)=>{
                    firestore()
                    .collection("Users")
                    .doc(docId)
                    .collection("Chats")
                    .onSnapshot((receiverDocs) => {
                         const receivers = receiverDocs.docs.map((doc) => ({ id:doc.id,...doc.data() }))
                         setIsLoading(false)
                         setReceiverEmails(receivers)
                    })
               })
               .catch((err)=>{
                    setIsLoading(false)
                    console.log(err);
                    console.log("error");
               })
          }

     }, []);

     return (
          <VStack width="100%"height="100%">

               {
                    isLoading ? (
                         <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
                              <Spinner size="lg" />
                         </Box>
                    ):(
                         <FlatList
                              py={2}
                              width="100%"
                              data={receiverEmails}
                              keyExtractor={(item) => item.id}
                              renderItem={({ item }) => {
                                   return(
                                        <>
                                             <ChatRoomCard key={item.id} email={item.receiver} />
                                        </>

                                   )
                              }}
                         />
                    )
               }

          </VStack>
     );
};

export default AllChatsScreen;
